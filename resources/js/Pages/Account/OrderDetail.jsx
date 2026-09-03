import MainLayout from '@/Layouts/MainLayout';
import { formatZAR } from '@/utils/format';

const STATUS_LABELS = {
    pending:   { label: 'Pending Payment',  cls: 'bg-amber-100 text-amber-700' },
    paid:      { label: 'Paid',             cls: 'bg-green-100 text-green-700' },
    processing:{ label: 'Processing',       cls: 'bg-blue-100 text-blue-700' },
    shipped:   { label: 'Shipped',          cls: 'bg-sector-100 text-sector-700' },
    delivered: { label: 'Delivered',        cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled',        cls: 'bg-red-100 text-red-600' },
};

const SERVICE_NAMES = {
    THE_COURIER_GUY_ECO:      'The Courier Guy — Economy (3–5 days)',
    THE_COURIER_GUY_OVN:      'The Courier Guy — Overnight',
    THE_COURIER_GUY_SAME_DAY: 'The Courier Guy — Same Day',
};

export default function OrderDetail({ order }) {
    const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, cls: 'bg-asphalt text-pitlane-60' };
    const shippingServiceLabel = SERVICE_NAMES[order.shipping_service] ?? order.shipping_service ?? 'Standard Shipping';

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto px-6 py-10">
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2">
                    <a href="/account" className="hover:text-sector-600">Account</a>
                    <span>/</span>
                    <a href="/account/orders" className="hover:text-sector-600">Orders</a>
                    <span>/</span>
                    <span className="text-pitlane">#{order.id}</span>
                </nav>

                <div className="flex items-center justify-between mb-6">
                    <h1 className="t-h1 text-pitlane">Order #{order.id}</h1>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.cls}`}>
                            {statusInfo.label}
                        </span>
                        <a
                            href={`/account/orders/${order.id}/receipt?print=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-asphalt-dark text-sm text-pitlane-60 hover:text-pitlane hover:border-pitlane-60 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                            Print Receipt
                        </a>
                    </div>
                </div>

                {/* Items table */}
                <div className="bg-white border border-asphalt rounded-2xl overflow-hidden mb-6">
                    <table className="w-full text-sm">
                        <thead className="bg-asphalt text-alloy text-xs">
                            <tr>
                                <th className="text-left px-4 py-3">Product</th>
                                <th className="text-center px-4 py-3">Qty</th>
                                <th className="text-right px-4 py-3">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.items ?? []).map(item => (
                                <tr key={item.id} className="border-t border-asphalt">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-pitlane">{item.product_name}</div>
                                        <div className="text-alloy text-xs font-mono">#{item.part_number}</div>
                                        {item.brand_name && <div className="text-alloy text-xs">{item.brand_name}</div>}
                                    </td>
                                    <td className="px-4 py-3 text-center text-pitlane-60">{item.qty}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{formatZAR(Number(item.line_total_incl))}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-asphalt">
                            <tr>
                                <td colSpan={2} className="px-4 py-2 text-right text-alloy text-xs">Subtotal excl. VAT</td>
                                <td className="px-4 py-2 text-right text-sm">{formatZAR(Number(order.subtotal_excl))}</td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="px-4 py-2 text-right text-alloy text-xs">VAT (15%)</td>
                                <td className="px-4 py-2 text-right text-sm">{formatZAR(Number(order.vat_amount))}</td>
                            </tr>
                            {Number(order.shipping_cost) > 0 && (
                                <tr>
                                    <td colSpan={2} className="px-4 py-2 text-right text-alloy text-xs">Shipping (incl. VAT)</td>
                                    <td className="px-4 py-2 text-right text-sm">{formatZAR(Number(order.shipping_cost))}</td>
                                </tr>
                            )}
                            {order.gift_wrapped && Number(order.gift_wrap_cost) > 0 && (
                                <tr>
                                    <td colSpan={2} className="px-4 py-2 text-right text-alloy text-xs">Gift Wrapping</td>
                                    <td className="px-4 py-2 text-right text-sm">{formatZAR(Number(order.gift_wrap_cost))}</td>
                                </tr>
                            )}
                            <tr className="bg-asphalt">
                                <td colSpan={2} className="px-4 py-3 text-right font-bold">Total</td>
                                <td className="px-4 py-3 text-right font-bold text-sector-600">{formatZAR(Number(order.total_incl))}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Order notes + gift wrap */}
                {(order.order_notes || order.gift_wrapped) && (
                    <div className="bg-asphalt rounded-2xl p-5 text-sm mb-4">
                        <h3 className="t-h3 text-pitlane mb-3">Order Options</h3>
                        {order.gift_wrapped && (
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-sector-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1019.5 6.75H15M12 4.875A2.625 2.625 0 104.5 6.75H9m3-1.875V21M9 6.75H5.25A1.5 1.5 0 003.75 8.25V12h17.25V8.25a1.5 1.5 0 00-1.5-1.5H15M9 6.75h6"/>
                                </svg>
                                <span className="text-pitlane-60">Gift wrapped</span>
                            </div>
                        )}
                        {order.order_notes && (
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-alloy mb-1">Order Notes</p>
                                <p className="text-pitlane-60 leading-relaxed">{order.order_notes}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Delivery + Shipping info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-asphalt rounded-2xl p-5 text-sm">
                        <h3 className="t-h3 text-pitlane mb-3">Delivery Address</h3>
                        <p className="text-pitlane-60 leading-relaxed">
                            {order.shipping_name}<br />
                            {order.shipping_address}<br />
                            {order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}
                        </p>
                        {order.shipping_phone && (
                            <p className="text-alloy text-xs mt-2">{order.shipping_phone}</p>
                        )}
                    </div>

                    <div className="bg-asphalt rounded-2xl p-5 text-sm">
                        <h3 className="t-h3 text-pitlane mb-3">Shipping Method</h3>
                        <p className="text-pitlane-60 leading-relaxed">{shippingServiceLabel}</p>
                        {Number(order.shipping_cost) > 0 && (
                            <p className="text-alloy text-xs mt-1">{formatZAR(Number(order.shipping_cost))} incl. VAT</p>
                        )}
                        {order.waybill_number && (
                            <div className="mt-3 p-2.5 bg-white rounded-lg border border-gray-200">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-alloy mb-0.5">Tracking Reference</p>
                                <a href={`https://portal.thecourierguy.co.za/track?waybill=${order.waybill_number}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-sm font-mono font-bold text-sector-600 hover:text-sector-700 hover:underline">
                                    {order.waybill_number}
                                </a>
                                <p className="text-[10px] text-alloy mt-0.5">Click to track on The Courier Guy portal</p>
                            </div>
                        )}
                        <p className="text-alloy text-xs mt-2">
                            Payment: <span className="uppercase">{order.payment_method}</span>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
