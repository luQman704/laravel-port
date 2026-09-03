import { useState, useEffect, useRef } from 'react';
import { formatZAR } from '@/utils/format';

export default function CartDropdown({ onClose }) {
    const [items, setItems]     = useState([]);
    const [total, setTotal]     = useState(0);
    const [loading, setLoading] = useState(true);
    const panelRef = useRef(null);

    // Fetch cart contents whenever the dropdown opens
    useEffect(() => {
        setLoading(true);
        fetch('/api/cart')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                setItems(data.items ?? []);
                setTotal(data.total ?? 0);
            })
            .catch(() => { setItems([]); setTotal(0); })
            .finally(() => setLoading(false));
    }, []);

    // Close on click outside the cart zone
    useEffect(() => {
        function onMouseDown(e) {
            if (panelRef.current && !e.target.closest('[data-cart-zone]')) {
                onClose();
            }
        }
        // Delay so the opening click doesn't immediately close
        const t = setTimeout(() => window.addEventListener('mousedown', onMouseDown), 50);
        return () => { clearTimeout(t); window.removeEventListener('mousedown', onMouseDown); };
    }, [onClose]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            ref={panelRef}
            className="absolute right-0 top-[calc(100%+8px)] w-96 bg-white rounded-xl border border-asphalt shadow-xl overflow-hidden"
            style={{ animation: 'cartDropIn 0.18s ease-out', zIndex: 200 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-asphalt">
                <span className="font-semibold text-pitlane text-sm">
                    Cart {items.length > 0 && <span className="text-alloy font-normal">· {items.length} item{items.length !== 1 ? 's' : ''}</span>}
                </span>
                <button onClick={onClose} className="text-alloy hover:text-pitlane transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            {/* Body */}
            {loading ? (
                <div className="px-4 py-8 flex items-center justify-center">
                    <svg className="w-5 h-5 text-sector-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                </div>
            ) : items.length === 0 ? (
                <div className="px-4 py-10 text-center">
                    <div className="text-4xl text-alloy-light mb-3">▣</div>
                    <div className="text-sm font-semibold text-pitlane mb-1">Your cart is empty</div>
                    <p className="text-xs text-alloy">Add parts to your cart to see them here.</p>
                    <a href="/browse" onClick={onClose}
                       className="btn btn-primary px-5 py-2 mt-4 inline-flex">
                        Browse parts
                    </a>
                </div>
            ) : (
                <>
                    {/* Item list — max 4 items visible, scroll beyond */}
                    <ul className="divide-y divide-asphalt max-h-72 overflow-y-auto">
                        {items.map(item => {
                            const thumb = item.thumbnail
                                ? item.thumbnail.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2')
                                : null;
                            const subtotal = (item.subtotal ?? item.price_incl * item.qty ?? 0);
                            return (
                                <li key={item.id ?? item.id_turn14_product} className="flex gap-3 px-4 py-3 hover:bg-asphalt/40 transition-colors">
                                    {/* Thumbnail */}
                                    <div className="w-12 h-12 bg-asphalt rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                        {thumb
                                            ? <img src={thumb} alt={item.product_name}
                                                className="w-full h-full object-contain p-1"
                                                onError={e => e.target.style.display='none'} />
                                            : <span className="text-lg text-alloy-light">▣</span>
                                        }
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-pitlane leading-snug line-clamp-1">
                                            {item.product_name}
                                        </div>
                                        <div className="t-partno text-alloy-light mt-0.5">#{item.part_number}</div>
                                        <div className="text-xs text-alloy mt-1">Qty: {item.qty}</div>
                                    </div>
                                    {/* Price */}
                                    <div className="shrink-0 text-right">
                                        <div className="t-price text-sector-600 text-sm">
                                            {formatZAR(subtotal)}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Footer */}
                    <div className="border-t border-asphalt px-4 py-4 bg-cloud">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-pitlane">Total</span>
                            <span className="t-price text-pitlane" style={{ fontSize: '1.25rem' }}>
                                {formatZAR(total)}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <a href="/cart" onClick={onClose}
                               className="btn btn-ghost flex-1 py-2.5 text-center">
                                View cart
                            </a>
                            <a href="/checkout" onClick={onClose}
                               className="btn btn-primary flex-1 py-2.5 text-center">
                                Checkout
                            </a>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes cartDropIn {
                    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
