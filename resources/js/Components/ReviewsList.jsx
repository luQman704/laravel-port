import { useState, useEffect } from 'react';
import { Stars } from '@/Components/StarRating';

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ReviewsList({ turn14Id, stats, onStatsChange }) {
    const [data, setData]       = useState(null);
    const [page, setPage]       = useState(1);
    const [loading, setLoading] = useState(true);

    async function load(p = 1) {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${encodeURIComponent(turn14Id)}/reviews?page=${p}`);
            const json = await res.json();
            setData(json);
            if (onStatsChange && json.avg_rating !== undefined) {
                onStatsChange({ avg_rating: json.avg_rating, total: json.total });
            }
        } catch {}
        finally { setLoading(false); }
    }

    useEffect(() => { load(page); }, [page, turn14Id]);

    // Rating breakdown bar
    function BreakdownBar({ label, count, total }) {
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
            <div className="flex items-center gap-2 text-xs">
                <span className="text-alloy w-8 text-right shrink-0">{label}★</span>
                <div className="flex-1 bg-asphalt rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-alloy w-6 shrink-0">{count}</span>
            </div>
        );
    }

    const reviews = data?.reviews?.data ?? [];
    const lastPage = data?.reviews?.last_page ?? 1;
    const total = data?.total ?? stats?.total ?? 0;
    const avg = data?.avg_rating ?? stats?.avg_rating ?? 0;
    const breakdown = stats?.breakdown ?? {};

    return (
        <div>
            {/* Summary header */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 bg-asphalt rounded-xl">
                {/* Score */}
                <div className="flex flex-col items-center justify-center shrink-0 min-w-[100px]">
                    <div className="text-5xl font-black text-pitlane">{avg > 0 ? avg.toFixed(1) : '—'}</div>
                    <Stars rating={avg} size="md" />
                    <div className="text-xs text-alloy mt-1">{total} review{total !== 1 ? 's' : ''}</div>
                </div>

                {/* Breakdown bars */}
                {total > 0 && (
                    <div className="flex-1 flex flex-col justify-center gap-1.5">
                        {[5, 4, 3, 2, 1].map(n => (
                            <BreakdownBar key={n} label={n} count={breakdown[n] ?? 0} total={total} />
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse bg-asphalt rounded-xl h-24" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 text-alloy">
                    <div className="text-4xl mb-3">★</div>
                    <p className="font-medium text-pitlane">No reviews yet</p>
                    <p className="text-sm mt-1">Be the first to share your experience.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white border border-asphalt rounded-xl p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-pitlane text-sm">{review.reviewer_name}</span>
                                        {review.verified_purchase && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-forest-700 bg-forest-50 border border-forest-200 rounded-full px-2 py-0.5">
                                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Stars rating={review.rating} size="sm" />
                                        {review.title && (
                                            <span className="text-sm font-medium text-pitlane">"{review.title}"</span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-alloy shrink-0">{timeAgo(review.created_at)}</span>
                            </div>
                            <p className="text-sm text-pitlane-60 leading-relaxed">{review.body}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                                p === page
                                    ? 'bg-sector-600 text-white'
                                    : 'bg-asphalt text-pitlane-60 hover:bg-asphalt-dark'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
