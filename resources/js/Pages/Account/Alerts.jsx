import MainLayout from '@/Layouts/MainLayout';
import { router } from '@inertiajs/react';

function WatchTag({ label, active }) {
    if (!active) return null;
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sector-50 text-sector-600 border border-sector-200">
            {label}
        </span>
    );
}

function BellIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
    );
}

function formatDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function removeAlert(id) {
    router.delete(`/account/alerts/${id}`, {}, {
        preserveScroll: true,
        onSuccess: () => router.reload({ only: ['alerts'] }),
    });
}

export default function Alerts({ alerts = [] }) {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <a href="/account" className="hover:text-sector-600">Your Account</a>
                    <span>/</span>
                    <span className="text-pitlane">Stock Alerts</span>
                </nav>

                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <BellIcon className="w-7 h-7 text-sector-600 shrink-0" />
                    <h1 className="t-h1 text-pitlane">Stock Alerts</h1>
                </div>
                <p className="text-sm text-alloy mb-8">
                    {alerts.length === 0
                        ? 'You have no active stock alert subscriptions.'
                        : `${alerts.length} active subscription${alerts.length === 1 ? '' : 's'}`}
                </p>

                {/* Empty state */}
                {alerts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-asphalt rounded-xl">
                        <BellIcon className="w-14 h-14 text-alloy mb-4" />
                        <p className="font-bold text-pitlane text-lg mb-1">No alerts set</p>
                        <p className="text-sm text-alloy mb-6 max-w-xs">
                            Subscribe to back-in-stock notifications on product pages
                        </p>
                        <a
                            href="/browse"
                            className="btn btn-primary px-6 py-2.5 text-sm"
                        >
                            Browse products
                        </a>
                    </div>
                )}

                {/* Alert list */}
                {alerts.length > 0 && (
                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div
                                key={alert.id_alert}
                                className="bg-white border border-asphalt rounded-xl p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 hover:border-sector-300 transition-colors"
                            >
                                {/* Left: product info */}
                                <div className="flex-1 min-w-0">
                                    {alert.product_url ? (
                                        <a
                                            href={alert.product_url}
                                            className="font-bold text-pitlane hover:text-sector-600 transition-colors line-clamp-2 leading-snug"
                                        >
                                            {alert.product_name}
                                        </a>
                                    ) : (
                                        <span className="font-bold text-pitlane leading-snug">
                                            {alert.product_name}
                                        </span>
                                    )}

                                    {alert.part_number && (
                                        <p className="text-xs text-alloy mt-0.5 font-mono">
                                            {alert.part_number}
                                        </p>
                                    )}

                                    {/* Watch tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        <span className="text-xs text-alloy mr-0.5">Watching:</span>
                                        <WatchTag label="Local" active={alert.watch_local} />
                                        <WatchTag label="USA" active={alert.watch_usa} />
                                        <WatchTag label="Manufacturer" active={alert.watch_mfr} />
                                    </div>
                                </div>

                                {/* Right: date + remove */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                                    <p className="text-xs text-alloy whitespace-nowrap">
                                        Added {formatDate(alert.date_add)}
                                    </p>
                                    <button
                                        onClick={() => removeAlert(alert.id_alert)}
                                        className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors whitespace-nowrap"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
