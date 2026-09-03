import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import ProductListRow from '@/Components/ProductListRow';
import ViewControls, { useViewMode } from '@/Components/ViewControls';
import { useState } from 'react';

function sortProducts(arr, s) {
    const sorted = [...arr];
    if (s === 'price_asc')  return sorted.sort((a, b) => (a.price_incl ?? 0) - (b.price_incl ?? 0));
    if (s === 'price_desc') return sorted.sort((a, b) => (b.price_incl ?? 0) - (a.price_incl ?? 0));
    if (s === 'name_asc')   return sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
    if (s === 'name_desc')  return sorted.sort((a, b) => b.product_name.localeCompare(a.product_name));
    return sorted;
}

export default function EngineDetail({ engine, products = [] }) {
    const title = `${engine.make} ${engine.engine}`;
    const [mode, setMode] = useViewMode('grid');
    const [sort, setSort] = useState('default');

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
                    <a href="/engines" className="hover:text-sector-600">Find by Engine</a>
                    <span>/</span>
                    <span className="text-pitlane font-medium">{title}</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                    {engine.image && (
                        <img src={`/img/engines/${engine.image}`} alt={engine.engine}
                            className="w-20 h-20 object-contain bg-asphalt rounded-xl p-2"
                            onError={e => e.target.style.display = 'none'} />
                    )}
                    <div>
                        <h1 className="t-h1 text-pitlane">{title}</h1>
                        <p className="text-pitlane-60 text-sm mt-1">{products.length} compatible parts</p>
                    </div>
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
                                <p>No parts found for this engine.</p>
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
                                        {sorted.map(p => <ProductCard key={p.id_turn14_product} product={p} />)}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {sorted.map(p => <ProductListRow key={p.id_turn14_product} product={p} />)}
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
