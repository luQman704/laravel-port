import { useCompare } from '@/contexts/CompareContext';

function toHighRes(url) {
    if (!url) return url;
    return url.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2');
}

export default function CompareBar() {
    const { items, toggle, clear, max } = useCompare();

    if (items.length === 0) return null;

    const compareUrl = '/compare?ids=' + items.map(p => p.id ?? p).join(',');

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-pitlane border-t-2 border-sector-600 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">

                {/* Label */}
                <div className="shrink-0 text-white">
                    <div className="text-xs font-semibold text-sector-400 uppercase tracking-wider">Compare</div>
                    <div className="text-xs text-gray-400">{items.length} of {max} selected</div>
                </div>

                {/* Product thumbnails */}
                <div className="flex-1 flex items-center gap-3">
                    {items.map((product) => {
                        const id = product.id ?? product;
                        const img = toHighRes(product.images?.[0] ?? product.thumbnail ?? null);
                        const name = product.product_name ?? '';
                        return (
                            <div key={id} className="relative flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1.5 min-w-0">
                                {img && (
                                    <img src={img} alt={name}
                                        className="w-10 h-10 object-contain bg-white rounded shrink-0"
                                    />
                                )}
                                <span className="text-white text-xs font-medium truncate max-w-[120px]">{name}</span>
                                <button
                                    onClick={() => toggle(product)}
                                    className="ml-1 text-gray-400 hover:text-white shrink-0"
                                    title="Remove"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        );
                    })}

                    {/* Empty slots */}
                    {Array.from({ length: max - items.length }).map((_, i) => (
                        <div key={`empty-${i}`}
                            className="w-14 h-14 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center text-gray-600 text-xs">
                            +
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={clear}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        Clear all
                    </button>
                    <a
                        href={compareUrl}
                        className={`btn btn-primary px-5 py-2 text-sm ${items.length < 2 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        Compare {items.length}
                    </a>
                </div>
            </div>
        </div>
    );
}
