import MainLayout from '@/Layouts/MainLayout';
import { formatZAR } from '@/utils/format';

const cards = [
    {
        label: 'Personal Information',
        desc: 'Manage your name, email and password',
        href: '/account/profile',
        icon: (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
        ),
    },
    {
        label: 'My Addresses',
        desc: 'Save and manage delivery addresses',
        href: '/account/addresses',
        icon: (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
            </svg>
        ),
    },
    {
        label: 'Order History',
        desc: 'Track and view all your past orders',
        href: '/account/orders',
        icon: (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
            </svg>
        ),
    },
    {
        label: 'My Wishlist',
        desc: "Products you've saved for later",
        href: '/wishlist',
        icon: (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
            </svg>
        ),
    },
    {
        label: 'My Garage',
        desc: 'Your saved vehicles and build stages',
        href: '/account/garage',
        icon: (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
            </svg>
        ),
    },
    {
        label: 'Stock Alerts',
        desc: 'Get notified when items are back in stock',
        href: '/account/alerts',
        icon: (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
            </svg>
        ),
    },
    {
        label: 'Credit Slips',
        desc: 'View refunds and credit notes',
        href: '/account/credits',
        icon: (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
            </svg>
        ),
    },
    {
        label: 'Privacy & Data',
        desc: 'Manage your personal data and GDPR rights',
        href: '/account/privacy',
        icon: (
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
            </svg>
        ),
    },
];

export default function AccountDashboard({ user, order_count, recent_orders = [] }) {
    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <span className="text-pitlane">Your Account</span>
                </nav>

                <h1 className="t-h1 text-pitlane text-center mb-10">Your Account</h1>

                {/* Cards grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {cards.map(({ label, desc, href, icon }) => (
                        <a
                            key={label}
                            href={href}
                            className="group flex flex-col items-center text-center gap-3 bg-white border border-asphalt rounded-2xl p-7 hover:border-sector-400 hover:shadow-md transition-all duration-200"
                        >
                            <div className="text-alloy group-hover:text-sector-600 transition-colors">
                                {icon}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-pitlane uppercase tracking-widest group-hover:text-sector-600 transition-colors">
                                    {label}
                                </div>
                                <div className="text-xs text-alloy mt-1 leading-snug hidden sm:block">{desc}</div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Recent orders */}
                {recent_orders.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="t-h3 text-pitlane">Recent Orders</h2>
                            <a href="/account/orders" className="text-sm text-sector-600 hover:underline">View all →</a>
                        </div>
                        <div className="space-y-3">
                            {recent_orders.map(order => (
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
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
