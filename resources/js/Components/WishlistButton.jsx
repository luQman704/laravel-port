import { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function WishlistButton({ productId, className = '', size = 'md' }) {
    const { auth, wishlist_ids = [] } = usePage().props;
    const [inWishlist, setInWishlist] = useState(() => wishlist_ids.includes(String(productId)));
    const [loading, setLoading] = useState(false);

    async function toggle(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/wishlist/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({ turn14_product_id: productId }),
            });
            const data = await res.json();
            if (res.ok) setInWishlist(data.in_wishlist);
        } catch {}
        finally { setLoading(false); }
    }

    const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    return (
        <button
            onClick={toggle}
            disabled={loading}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`transition-colors disabled:opacity-50 ${
                inWishlist ? 'text-red-500 hover:text-red-700' : 'text-alloy hover:text-red-400'
            } ${className}`}
        >
            <svg className={iconSize} viewBox="0 0 24 24"
                fill={inWishlist ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
        </button>
    );
}
