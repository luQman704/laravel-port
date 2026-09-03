import { useState, useEffect } from 'react';
import { formatZAR } from '@/utils/format';
import WishlistButton from '@/Components/WishlistButton';
import CompareButton from '@/Components/CompareButton';

const VEHICLE_KEY = 'ppsa_active_vehicle';

/**
 * Upgrade Turn14 CDN size code S/M → L for higher-res image.
 * Returns url unchanged if it doesn't match the pattern.
 */
function toHighRes(url) {
    if (!url) return null;
    return url.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2');
}

/** Price tier — drives only typography scale, not backgrounds */
function priceTier(priceIncl) {
    if (priceIncl <= 0)    return 'poa';
    if (priceIncl < 1000)  return 'budget';
    if (priceIncl < 5000)  return 'standard';
    if (priceIncl < 20000) return 'premium';
    return 'elite';
}

/** Small pill badges overlaid on the image */
function TypeBadges({ product }) {
    const badges = [];
    if (product.is_kit)         badges.push({ label: 'Kit',           cls: 'bg-purple-600 text-white' });
    if (product.clearance_item) badges.push({ label: 'Clearance',     cls: 'bg-red-500 text-white' });
    if (product.special_order)  badges.push({ label: 'Special Order', cls: 'bg-amber-500 text-white' });
    if (product.discontinued)   badges.push({ label: 'Discontinued',  cls: 'bg-gray-400 text-white' });
    if (!badges.length) return null;
    return (
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            {badges.map(b => (
                <span key={b.label}
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm ${b.cls}`}>
                    {b.label}
                </span>
            ))}
        </div>
    );
}

/** Placeholder shown when all image attempts fail */
function ImagePlaceholder({ brandName }) {
    const initial = (brandName?.[0] ?? '?').toUpperCase();
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 select-none">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-black text-gray-400">{initial}</span>
            </div>
            {brandName && (
                <span className="text-[10px] text-gray-400 text-center px-3 leading-tight line-clamp-1">
                    {brandName}
                </span>
            )}
        </div>
    );
}

export default function ProductCard({ product }) {
    const raw     = product.images?.[0] ?? product.thumbnail ?? null;
    const highRes = toHighRes(raw);

    // Two-stage image fallback: high-res → original → placeholder
    const [imgSrc,    setImgSrc]    = useState(highRes);
    const [imgFailed, setImgFailed] = useState(false);

    function handleImgError() {
        if (!imgFailed && imgSrc && imgSrc !== raw && raw) {
            setImgSrc(raw);   // try original size
        } else {
            setImgFailed(true);
        }
    }

    const [activeVehicle, setActiveVehicle] = useState(null);
    useEffect(() => {
        try {
            const v = JSON.parse(localStorage.getItem(VEHICLE_KEY) ?? 'null');
            setActiveVehicle(v);
        } catch {}
    }, []);

    const priceIncl = product.price_incl ?? 0;
    const brandName = product.brand?.name ?? product.brand_name ?? '';
    const tier      = priceTier(priceIncl);

    const localQty = Math.max(0, product.stock?.quantity ?? product.quantity ?? 0);
    const mfrQty   = Math.max(0, product.stock?.mfr_quantity ?? product.mfr_quantity ?? 0);
    const usaQty   = (() => {
        const ws = product.stock?.warehouse_stock ?? product.warehouse_stock;
        if (!ws) return 0;
        const obj = typeof ws === 'string' ? JSON.parse(ws) : ws;
        return Object.values(obj).reduce((s, v) => s + (Number(v) || 0), 0);
    })();
    const inStock = product.in_stock ?? (localQty + usaQty + mfrQty > 0);

    const productUrl = `/product/${product.id ?? product.id_turn14_product}`;

    const cardBorder = 'border border-gray-200 hover:border-gray-300';

    // ── Price typography — the ONLY tier differentiator ─────────────────
    const priceSize = {
        budget:   'text-sm font-semibold text-gray-700',
        standard: 'text-base font-bold text-sector-600',
        premium:  'text-lg font-bold text-sector-700',
        elite:    'text-xl font-extrabold text-sector-700',
        poa:      'text-xs italic text-gray-400',
    }[tier];

    const showVatLabel = tier !== 'budget' && tier !== 'poa' && priceIncl > 0;

    return (
        <a
            href={productUrl}
            className={`group flex flex-col bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 ${cardBorder}`}
        >
            {/* ── Image area — consistent warm-white neutral across all tiers ── */}
            <div className="relative aspect-square bg-[#F7F6F4] flex items-center justify-center overflow-hidden">
                {!imgFailed && imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={product.product_name}
                        className="object-contain w-full h-full p-3 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={handleImgError}
                    />
                ) : (
                    <ImagePlaceholder brandName={brandName} />
                )}

                {/* Wishlist */}
                <div className="absolute top-2 left-2">
                    <WishlistButton
                        productId={product.id ?? product.id_turn14_product}
                        size="sm"
                        className="bg-white/90 hover:bg-white rounded-full p-1 shadow-sm"
                    />
                </div>

                {/* Stock dot */}
                <span
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-gray-300'}`}
                    title={inStock ? 'In stock' : 'Out of stock'}
                />

                {/* Type badges */}
                <TypeBadges product={product} />
            </div>

            {/* ── Info ───────────────────────────────────────────────────────── */}
            <div className="px-3 pt-2.5 pb-3 flex flex-col gap-0.5 flex-1 border-t border-gray-100">
                {/* Brand */}
                {brandName && (
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 truncate">
                        {brandName}
                    </div>
                )}

                {/* Product name */}
                <div className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-sector-700 transition-colors mt-0.5">
                    {product.product_name}
                </div>

                {/* Part number */}
                <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                    #{product.part_number}
                </div>

                <CompareButton product={product} className="mt-1.5" />

                {/* Price + stock */}
                <div className="mt-auto pt-2.5 flex items-end justify-between gap-2">
                    <div>
                        {priceIncl > 0 ? (
                            <>
                                <div className={priceSize}>{formatZAR(priceIncl)}</div>
                                {showVatLabel && (
                                    <div className="text-[10px] text-gray-400 mt-0.5">incl. VAT</div>
                                )}
                            </>
                        ) : (
                            <div className="text-xs italic text-gray-400">POA — contact us</div>
                        )}
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                        inStock ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                        {inStock ? 'In stock' : 'Order'}
                    </span>
                </div>
            </div>

            {/* ── Fitment badge ───────────────────────────────────────────────── */}
            {activeVehicle && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border-t border-green-100">
                    <svg className="w-3 h-3 text-green-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] font-semibold text-green-700 truncate">
                        Fits your {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                    </span>
                </div>
            )}
        </a>
    );
}
