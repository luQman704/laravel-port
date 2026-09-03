import { useState, useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { formatZAR } from '@/utils/format';

function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export default function SearchOverlay({ open, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setResults([]);
            setTotal(0);
        }
    }, [open]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const doSearch = useCallback(debounce(async (q) => {
        if (q.length < 2) { setResults([]); setTotal(0); setLoading(false); return; }
        setLoading(true);
        try {
            const res = await fetch(`/api/search/quick?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.results ?? []);
            setTotal(data.total ?? 0);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, 280), []);

    function handleChange(e) {
        const q = e.target.value;
        setQuery(q);
        if (q.length >= 2) setLoading(true);
        else { setResults([]); setTotal(0); setLoading(false); }
        doSearch(q);
    }

    function goToSearch() {
        if (!query.trim()) return;
        onClose();
        router.get('/search', { q: query });
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') goToSearch();
    }

    function goToProduct(id) {
        onClose();
        router.get(`/product/${id}`);
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                 style={{ animation: 'slideDown 0.18s ease-out' }}>
                <div className="flex items-center gap-3 px-5 py-4 border-b border-asphalt">
                    <svg className="w-5 h-5 text-alloy shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search by part name, number, brand…"
                        className="flex-1 text-lg text-pitlane placeholder-alloy-light outline-none bg-transparent"
                    />
                    {loading && (
                        <svg className="w-5 h-5 text-sector-500 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                    )}
                    <button onClick={onClose} className="text-alloy hover:text-pitlane transition-colors ml-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {results.length > 0 && (
                    <div>
                        <ul className="divide-y divide-asphalt">
                            {results.map(r => (
                                <li key={r.id}>
                                    <button
                                        onClick={() => goToProduct(r.id)}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-sector-50 transition-colors text-left"
                                    >
                                        <div className="w-12 h-12 bg-asphalt rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                            {r.thumbnail
                                                ? <img src={r.thumbnail.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2')}
                                                    className="w-full h-full object-contain p-1"
                                                    onError={e => { e.target.style.display='none'; }} />
                                                : <span className="text-xl text-alloy-light">▣</span>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-pitlane text-sm truncate">{r.product_name}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {r.brand_name && <span className="t-label text-alloy">{r.brand_name}</span>}
                                                <span className="t-partno text-alloy-light">#{r.part_number}</span>
                                                {r.category && <span className="text-xs text-alloy">{r.category}</span>}
                                            </div>
                                        </div>
                                        <div className="t-price text-sector-600 shrink-0">
                                            {r.price_incl > 0
                                                ? formatZAR(r.price_incl)
                                                : <span className="text-alloy font-normal text-xs italic">POA</span>
                                            }
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="px-5 py-3 bg-asphalt border-t border-asphalt-dark flex items-center justify-between">
                            <span className="text-xs text-alloy">
                                {total > results.length
                                    ? `Showing ${results.length} of ${total.toLocaleString()} results`
                                    : `${total} result${total !== 1 ? 's' : ''}`}
                            </span>
                            <button onClick={goToSearch}
                                className="text-sm font-semibold text-sector-600 hover:text-sector-700 transition-colors">
                                See all results
                            </button>
                        </div>
                    </div>
                )}

                {!loading && query.length >= 2 && results.length === 0 && (
                    <div className="px-5 py-8 text-center text-alloy text-sm">
                        No results for <strong className="text-pitlane">"{query}"</strong>
                        <div className="mt-3">
                            <button onClick={goToSearch} className="text-sector-600 font-semibold text-xs hover:underline">
                                Try full search
                            </button>
                        </div>
                    </div>
                )}

                {query.length === 0 && (
                    <div className="px-5 py-5 text-xs text-alloy flex gap-6">
                        <span>↵ to search</span>
                        <span>Esc to close</span>
                        <span>Search by part name, number or brand</span>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-12px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
