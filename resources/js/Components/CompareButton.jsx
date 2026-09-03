import { useCompare } from '@/contexts/CompareContext';

export default function CompareButton({ product, className = '' }) {
    const { isCompared, toggle, items, max } = useCompare();
    const compared = isCompared(product.id ?? product.id_turn14_product);
    const atMax = !compared && items.length >= max;

    return (
        <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
            disabled={atMax}
            title={compared ? 'Remove from compare' : atMax ? `Max ${max} products` : 'Add to compare'}
            className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                compared
                    ? 'text-sector-600'
                    : atMax
                        ? 'text-alloy-light cursor-not-allowed'
                        : 'text-alloy hover:text-sector-600'
            } ${className}`}
        >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
            </svg>
            {compared ? 'In compare' : 'Compare'}
        </button>
    );
}
