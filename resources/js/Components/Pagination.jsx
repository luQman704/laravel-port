export default function Pagination({ pagination, onChange }) {
    if (!pagination || pagination.last_page <= 1) return null;

    const { current_page, last_page } = pagination;

    const pages = [];
    const start = Math.max(1, current_page - 2);
    const end   = Math.min(last_page, current_page + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex items-center justify-center gap-1 mt-10">
            <button
                onClick={() => onChange(current_page - 1)}
                disabled={current_page === 1}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30"
            >
                ‹ Prev
            </button>
            {start > 1 && <span className="px-2 text-gray-400">…</span>}
            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${p === current_page ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    {p}
                </button>
            ))}
            {end < last_page && <span className="px-2 text-gray-400">…</span>}
            <button
                onClick={() => onChange(current_page + 1)}
                disabled={current_page === last_page}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30"
            >
                Next ›
            </button>
        </div>
    );
}
