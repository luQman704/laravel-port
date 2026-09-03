import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import ProductListRow from '@/Components/ProductListRow';
import ViewControls, { useViewMode } from '@/Components/ViewControls';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const STAGE_COLORS = [
    'bg-asphalt text-alloy',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-red-100 text-red-700',
];

function sortProducts(arr, s) {
    const sorted = [...arr];
    if (s === 'price_asc')  return sorted.sort((a, b) => (a.price_incl ?? 0) - (b.price_incl ?? 0));
    if (s === 'price_desc') return sorted.sort((a, b) => (b.price_incl ?? 0) - (a.price_incl ?? 0));
    if (s === 'name_asc')   return sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
    if (s === 'name_desc')  return sorted.sort((a, b) => b.product_name.localeCompare(a.product_name));
    return sorted;
}

export default function VehicleDetail({ vehicle, products = [], garage_stage = 0, show_completed = false, stage_labels = [] }) {
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    const [mode, setMode] = useViewMode('grid');
    const [sort, setSort] = useState('default');

    function setStage(stage) {
        router.get(`/vehicles/${vehicle.id_vehicle_filter}`, { stage }, { preserveScroll: false });
    }

    function toggleCompleted() {
        router.get(`/vehicles/${vehicle.id_vehicle_filter}`, {
            stage: garage_stage,
            show_completed: show_completed ? 0 : 1,
        });
    }

    const categoryCount = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
    }, {});

    const sorted = sortProducts(products, sort);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2 flex-wrap">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <a href="/vehicles" className="hover:text-sector-600">Find by Vehicle</a>
                    <span>/</span>
                    <span className="text-pitlane font-medium">{title}</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="t-h1 text-pitlane">{title}</h1>
                        <p className="text-pitlane-60 text-sm mt-1">{products.length} compatible parts</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {stage_labels.map((label, i) => (
                            <button
                                key={i}
                                onClick={() => setStage(i)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${garage_stage === i ? 'bg-sector-600 text-white border-sector-600' : 'bg-white text-alloy border-asphalt-dark hover:border-sector-300'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-sector-50 border border-sector-100 rounded-xl px-4 py-3 mb-6 text-sm text-sector-800 flex items-center justify-between flex-wrap gap-3">
                    <span>
                        {garage_stage === 0
                            ? 'Showing stock + Stage 1 upgrades for this vehicle.'
                            : `Your vehicle is at ${stage_labels[garage_stage]}. Showing Stage ${garage_stage + 1} upgrades.`}
                    </span>
                    {garage_stage > 0 && (
                        <button onClick={toggleCompleted} className="text-xs font-semibold underline text-sector-700">
                            {show_completed ? 'Hide completed stages' : 'Show completed stages'}
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {Object.keys(categoryCount).length > 1 && (
                        <aside className="w-full lg:w-52 shrink-0">
                            <h3 className="t-label text-alloy mb-3">Categories</h3>
                            <ul className="space-y-1 text-sm">
                                {Object.entries(categoryCount)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([cat, count]) => (
                                        <li key={cat} className="flex justify-between text-pitlane px-2 py-1">
                                            <span>{cat}</span>
                                            <span className="text-alloy text-xs">{count}</span>
                                        </li>
                                    ))}
                            </ul>
                        </aside>
                    )}

                    <main className="flex-1">
                        {products.length === 0 ? (
                            <div className="text-center py-20 text-alloy">
                                <div className="text-4xl mb-3 text-alloy-light">⚙</div>
                                <p className="text-pitlane-60">No parts found for this stage.</p>
                                {garage_stage > 0 && (
                                    <button onClick={() => setStage(0)} className="mt-3 text-sector-600 font-semibold text-sm">
                                        View all parts →
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-end mb-4">
                                    <ViewControls
                                        mode={mode} onMode={setMode}
                                        sort={sort} onSort={setSort}
                                        total={products.length}
                                    />
                                </div>
                                {mode === 'grid' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {sorted.map(p => (
                                            <div key={p.id_turn14_product} className="relative">
                                                {p.stage > 0 && (
                                                    <span className={`absolute top-2 left-2 z-10 text-xs px-2 py-0.5 rounded-full font-semibold ${STAGE_COLORS[p.stage] ?? ''}`}>
                                                        {stage_labels[p.stage] ?? `Stage ${p.stage}`}
                                                    </span>
                                                )}
                                                <ProductCard product={p} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {sorted.map(p => (
                                            <div key={p.id_turn14_product} className="relative">
                                                {p.stage > 0 && (
                                                    <span className={`absolute top-2 left-2 z-10 text-xs px-2 py-0.5 rounded-full font-semibold ${STAGE_COLORS[p.stage] ?? ''}`}>
                                                        {stage_labels[p.stage] ?? `Stage ${p.stage}`}
                                                    </span>
                                                )}
                                                <ProductListRow product={p} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
