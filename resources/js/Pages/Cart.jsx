import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';
import { formatZAR } from '@/utils/format';

function toHighRes(url) {
    if (!url) return url;
    return url.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2');
}

function CartRow({ row, onQtyChange, onRemove }) {
    const { product, item, line_total } = row;
    const thumb = toHighRes(product.images?.[0] ?? product.thumbnail ?? null);

    return (
        <div className="flex gap-4 py-4 border-b border-asphalt">
            <div className="w-20 h-20 bg-asphalt rounded-lg flex items-center justify-center shrink-0">
                {thumb
                    ? <img src={thumb} className="object-contain w-full h-full p-1" alt="" />
                    : <span className="text-2xl text-alloy-light">&#128230;</span>
                }
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-pitlane line-clamp-2">{product.product_name}</div>
                <div className="text-xs text-alloy mt-0.5">#{product.part_number}</div>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border border-asphalt-dark rounded-lg overflow-hidden">
                        <button onClick={() => onQtyChange(item.turn14_product_id, item.qty - 1)}
                            className="px-2.5 py-1 text-pitlane-60 hover:bg-asphalt">&#8722;</button>
                        <span className="px-3 py-1 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => onQtyChange(item.turn14_product_id, item.qty + 1)}
                            className="px-2.5 py-1 text-pitlane-60 hover:bg-asphalt">+</button>
                    </div>
                    <button onClick={() => onRemove(item.turn14_product_id)}
                        className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
            </div>
            <div className="text-right shrink-0">
                <div className="t-price text-sector-600">
                    {formatZAR(line_total)}
                </div>
                <div className="text-xs text-alloy">
                    {formatZAR(product.price_incl ?? 0)} each
                </div>
            </div>
        </div>
    );
}

export default function Cart({ contents = [], totals }) {
    function updateQty(id, qty) {
        router.post('/cart/update', { turn14_product_id: id, qty }, { preserveScroll: true });
    }
    function removeItem(id) {
        router.post('/cart/remove', { turn14_product_id: id }, { preserveScroll: true });
    }

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="t-h1 text-pitlane mb-8">Your Cart</h1>

                {contents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">&#128722;</div>
                        <p className="text-pitlane-60 mb-6">Your cart is empty.</p>
                        <a href="/browse" className="btn btn-primary px-6 py-3">Browse Products</a>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            {contents.map((row, i) => (
                                <CartRow key={i} row={row} onQtyChange={updateQty} onRemove={removeItem} />
                            ))}
                        </div>

                        <aside className="w-full lg:w-72 shrink-0">
                            <div className="bg-asphalt rounded-2xl p-6 sticky top-24">
                                <h2 className="font-bold text-pitlane mb-4">Order Summary</h2>
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between text-pitlane-60">
                                        <span>Subtotal (excl. VAT)</span>
                                        <span>{formatZAR(totals?.subtotal_excl ?? 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-pitlane-60">
                                        <span>VAT (15%)</span>
                                        <span>{formatZAR(totals?.vat_amount ?? 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-pitlane text-base pt-2 border-t border-asphalt-dark">
                                        <span>Total</span>
                                        <span className="text-sector-600">{formatZAR(totals?.total_incl ?? 0)}</span>
                                    </div>
                                </div>
                                <a href="/checkout"
                                    className="btn btn-primary w-full py-3.5">
                                    Proceed to Checkout
                                </a>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
