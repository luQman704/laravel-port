import MainLayout from '@/Layouts/MainLayout';
import { formatZAR } from '@/utils/format';
import { Stars } from '@/Components/StarRating';

function toHighRes(url) {
    if (!url) return url;
    return url.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2');
}

function Row({ label, children }) {
    return (
        <tr className="border-b border-asphalt">
            <td className="py-3 px-4 text-xs font-semibold text-alloy uppercase tracking-wide bg-asphalt/50 w-32 shrink-0 align-top">
                {label}
            </td>
            {children}
        </tr>
    );
}

function Cell({ children }) {
    return (
        <td className="py-3 px-4 text-sm text-pitlane align-top">
            {children ?? <span className="text-alloy-light">—</span>}
        </td>
    );
}

function StockDot({ product }) {
    const local = Math.max(0, product.stock?.quantity ?? 0);
    const usa = (() => {
        const ws = product.stock?.warehouse_stock;
        if (!ws) return 0;
        const obj = typeof ws === 'string' ? JSON.parse(ws) : ws;
        return Object.values(obj).reduce((s, v) => s + (Number(v) || 0), 0);
    })();
    const mfr = Math.max(0, product.stock?.mfr_quantity ?? 0);
    const inStock = local + usa + mfr > 0;
    return (
        <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${inStock ? 'bg-sector-50 text-sector-700' : 'bg-asphalt text-alloy'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-sector-500' : 'bg-alloy-light'}`} />
                {inStock ? 'In stock' : 'Out of stock'}
            </span>
            {local > 0 && <span className="text-[10px] text-alloy">SA: {local}</span>}
            {usa > 0   && <span className="text-[10px] text-alloy">USA: {usa}</span>}
            {mfr > 0   && <span className="text-[10px] text-alloy">Mfr: {mfr}</span>}
        </div>
    );
}

export default function Compare({ products = [] }) {
    if (products.length === 0) {
        return (
            <MainLayout>
                <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <div className="text-6xl mb-4">⊟</div>
                    <h1 className="t-h1 text-pitlane mb-2">Nothing to compare</h1>
                    <p className="text-alloy mb-6">Add products to compare using the compare button on product cards.</p>
                    <a href="/browse" className="btn btn-primary px-6 py-2.5">Browse Products</a>
                </div>
            </MainLayout>
        );
    }

    const cols = products.length;
    const colWidth = cols === 2 ? 'w-1/2' : cols === 3 ? 'w-1/3' : 'w-1/4';

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="t-h1 text-pitlane">Compare Products</h1>
                        <p className="text-alloy text-sm mt-1">Side-by-side comparison of {cols} products</p>
                    </div>
                    <a href="/browse" className="btn btn-ghost px-4 py-2 text-sm">← Browse more</a>
                </div>

                <div className="bg-white rounded-2xl border border-asphalt overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-b border-asphalt">
                                    <th className="py-4 px-4 bg-asphalt/50 w-32" />
                                    {products.map(p => (
                                        <th key={p.id} className={`py-4 px-4 ${colWidth}`}>
                                            <a href={`/product/${p.id}`} className="block group">
                                                <div className="aspect-square max-w-[140px] mx-auto bg-asphalt rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                                                    {(p.images?.[0] ?? p.thumbnail) ? (
                                                        <img
                                                            src={toHighRes(p.images?.[0] ?? p.thumbnail)}
                                                            alt={p.product_name}
                                                            className="w-full h-full object-contain p-3"
                                                        />
                                                    ) : (
                                                        <span className="text-alloy-light text-3xl">▣</span>
                                                    )}
                                                </div>
                                                <div className="text-xs font-semibold text-alloy mb-0.5">{p.brand?.name}</div>
                                                <div className="text-sm font-bold text-pitlane group-hover:text-sector-600 transition-colors line-clamp-2">
                                                    {p.product_name}
                                                </div>
                                            </a>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <Row label="Price">
                                    {products.map(p => (
                                        <Cell key={p.id}>
                                            {p.price_incl > 0 ? (
                                                <div>
                                                    <div className="t-price text-sector-600 text-lg">{formatZAR(p.price_incl)}</div>
                                                    <div className="text-[10px] text-alloy">incl. VAT</div>
                                                </div>
                                            ) : <span className="text-alloy italic text-xs">POA</span>}
                                        </Cell>
                                    ))}
                                </Row>

                                <Row label="Part #">
                                    {products.map(p => (
                                        <Cell key={p.id}>
                                            <span className="t-partno">{p.part_number}</span>
                                        </Cell>
                                    ))}
                                </Row>

                                <Row label="Mfr Part #">
                                    {products.map(p => (
                                        <Cell key={p.id}>{p.mfr_part_number}</Cell>
                                    ))}
                                </Row>

                                <Row label="Category">
                                    {products.map(p => (
                                        <Cell key={p.id}>{p.category}</Cell>
                                    ))}
                                </Row>

                                <Row label="Subcategory">
                                    {products.map(p => (
                                        <Cell key={p.id}>{p.subcategory}</Cell>
                                    ))}
                                </Row>

                                <Row label="Weight">
                                    {products.map(p => (
                                        <Cell key={p.id}>{p.weight ? `${p.weight} lbs` : null}</Cell>
                                    ))}
                                </Row>

                                <Row label="Dimensions">
                                    {products.map(p => (
                                        <Cell key={p.id}>
                                            {(p.length && p.width && p.height)
                                                ? `${p.length}" × ${p.width}" × ${p.height}"`
                                                : null}
                                        </Cell>
                                    ))}
                                </Row>

                                <Row label="Stock">
                                    {products.map(p => (
                                        <Cell key={p.id}><StockDot product={p} /></Cell>
                                    ))}
                                </Row>

                                <Row label="Shipping">
                                    {products.map(p => (
                                        <Cell key={p.id}>
                                            {p.ltl_freight_required
                                                ? <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold">LTL Freight</span>
                                                : <span className="text-sector-600 text-xs font-medium">Standard</span>}
                                        </Cell>
                                    ))}
                                </Row>

                                <Row label="Flags">
                                    {products.map(p => (
                                        <Cell key={p.id}>
                                            <div className="flex flex-wrap gap-1">
                                                {p.special_order   && <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-semibold">Special Order</span>}
                                                {p.clearance_item  && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-semibold">Clearance</span>}
                                                {p.is_kit          && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-semibold">Kit</span>}
                                            </div>
                                        </Cell>
                                    ))}
                                </Row>

                                {/* Actions */}
                                <tr className="bg-asphalt/30">
                                    <td className="py-4 px-4" />
                                    {products.map(p => (
                                        <td key={p.id} className="py-4 px-4">
                                            <a
                                                href={`/product/${p.id}`}
                                                className="btn btn-primary w-full py-2.5 text-sm text-center block"
                                            >
                                                View Product
                                            </a>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
