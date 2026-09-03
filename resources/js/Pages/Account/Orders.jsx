import MainLayout from '@/Layouts/MainLayout';
import { formatZAR } from '@/utils/format';

export default function Orders({ orders }) {
    const items = orders?.data ?? [];

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="t-h1 text-pitlane mb-8">Order History</h1>
                {items.length === 0 ? (
                    <p className="text-alloy">No orders yet.</p>
                ) : (
                    <div className="space-y-3">
                        {items.map(order => (
                            <a key={order.id} href={`/account/orders/${order.id}`}
                                className="flex items-center justify-between p-4 bg-white border border-asphalt rounded-xl hover:border-sector-300 transition-all">
                                <div>
                                    <div className="font-semibold text-pitlane">Order #{order.id}</div>
                                    <div className="text-sm text-alloy">{order.created_at}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sector-600">{formatZAR(Number(order.total_incl))}</div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-asphalt text-pitlane-60'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
