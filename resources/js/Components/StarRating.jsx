/** Display-only star rating */
export function Stars({ rating, max = 5, size = 'sm' }) {
    const full  = Math.floor(rating);
    const half  = rating - full >= 0.4;
    const sz    = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => {
                const filled = i < full;
                const isHalf = !filled && half && i === full;
                return (
                    <svg key={i} className={`${sz} shrink-0`} viewBox="0 0 24 24">
                        {isHalf ? (
                            <>
                                <defs>
                                    <linearGradient id={`half-${i}`}>
                                        <stop offset="50%" stopColor="#f59e0b"/>
                                        <stop offset="50%" stopColor="#d1d5db"/>
                                    </linearGradient>
                                </defs>
                                <path fill={`url(#half-${i})`}
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </>
                        ) : (
                            <path fill={filled ? '#f59e0b' : '#d1d5db'}
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        )}
                    </svg>
                );
            })}
        </div>
    );
}

/** Interactive star picker */
export function StarPicker({ value, onChange }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(n)}
                    className="transition-transform hover:scale-110"
                    title={`${n} star${n > 1 ? 's' : ''}`}
                >
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill={n <= value ? '#f59e0b' : '#d1d5db'}
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </button>
            ))}
            {value > 0 && (
                <span className="ml-2 text-sm text-alloy">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
                </span>
            )}
        </div>
    );
}
