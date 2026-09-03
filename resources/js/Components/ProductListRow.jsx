import { formatZAR } from '@/utils/format';

function toHighRes(url) {
    if (!url) return url;
    return url.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2');
}

export default function ProductListRow({ product }) {
    const thumbnail = toHighRes(product.images?.[0] ?? product.thumbnail ?? null);
    const priceIncl = product.price_incl ?? 0;
    const brandName = product.brand?.name ?? product.brand_name ?? '';
    const inStock = product.in_stock ?? ((product.stock?.quantity ?? 0) > 0);

    return (
        <a
            href={`/product/${product.id ?? product.id_turn14_product}`}
            className="group flex items-center gap-4 bg-white border border-asphalt rounded-xl p-4 hover:border-sector-300 transition-all"
        >
            <div className="w-20 h-20 bg-asphalt rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                {thumbnail
                    ? <img src={thumbnail} alt={product.product_name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                        loading="lazy" />
                    : <span className="text-3xl text-alloy-light">▣</span>
                }
            </div>
            <div className="flex-1 min-w-0">
                {brandName && <div className="t-label text-alloy mb-0.5">{brandName}</div>}
                <div className="font-semibold text-pitlane text-sm leading-snug group-hover:text-sector-600 transition-colors line-clamp-2">
                    {product.product_name}
                </div>
                <div className="flex items-center gap-3 mt-1 text-alloy">
                    <span className="t-partno">#{product.part_number}</span>
                    {product.category && <span className="text-xs">· {product.category}</span>}
                </div>
            </div>
            <div className="text-right shrink-0">
                {priceIncl > 0 ? (
                    <div className="t-price text-sector-600">
                        {formatZAR(priceIncl)}
                    </div>
                ) : (
                    <div className="text-alloy text-sm italic">POA</div>
                )}
                <div className={`text-xs mt-1 font-semibold ${inStock ? 'text-sector-600' : 'text-pitlane-60'}`}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                </div>
            </div>
        </a>
    );
}
