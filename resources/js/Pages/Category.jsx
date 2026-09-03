import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import ProductListRow from '@/Components/ProductListRow';
import Pagination from '@/Components/Pagination';
import ViewControls, { useViewMode } from '@/Components/ViewControls';
import { router } from '@inertiajs/react';

export default function Category({ category, subcategory, products, pagination, subcategories, brands, activeFilters, sort_options = [] }) {
    const [mode, setMode] = useViewMode('grid');
    const base = `/category/${encodeURIComponent(category)}`;
    const currentSort = activeFilters?.sort ?? 'default';

    function applyFilter(key, value) {
        const params = { ...activeFilters };
        if (value) params[key] = value;
        else delete params[key];
        delete params.category;
        router.get(base, params);
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <nav className="text-sm text-alloy mb-6 flex gap-2 items-center">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <a href="/browse" className="hover:text-sector-600">Browse</a>
                    <span>/</span>
                    <span className="text-pitlane font-medium">{category}</span>
                    {subcategory && <><span>/</span><span className="text-pitlane font-medium">{subcategory}</span></>}
                </nav>

                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-56 shrink-0 space-y-6">
                        {subcategories?.length > 0 && (
                            <div>
                                <h3 className="t-label text-alloy mb-3">Subcategory</h3>
                                <ul className="space-y-1 text-sm">
                                    <li>
                                        <button onClick={() => applyFilter('subcategory', '')}
                                            className={`w-full text-left px-2 py-1.5 rounded-lg ${!subcategory ? 'bg-sector-50 text-sector-700 font-semibold' : 'text-pitlane hover:text-sector-600'}`}>
                                            All
                                        </button>
                                    </li>
                                    {subcategories.map(s => (
                                        <li key={s.subcategory}>
                                            <button onClick={() => applyFilter('subcategory', s.subcategory)}
                                                className={`w-full text-left px-2 py-1.5 rounded-lg ${subcategory === s.subcategory ? 'bg-sector-50 text-sector-700 font-semibold' : 'text-pitlane hover:text-sector-600'}`}>
                                                {s.subcategory}
                                                <span className="float-right text-alloy text-xs">{Number(s.count).toLocaleString()}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {brands?.length > 0 && (
                            <div>
                                <h3 className="t-label text-alloy mb-3">Brand</h3>
                                <ul className="space-y-1 text-sm max-h-60 overflow-y-auto">
                                    {brands.map(b => (
                                        <li key={b.brand_id}>
                                            <button onClick={() => applyFilter('brand_id', activeFilters?.brand_id == b.brand_id ? '' : b.brand_id)}
                                                className={`w-full text-left px-2 py-1.5 rounded-lg ${activeFilters?.brand_id == b.brand_id ? 'bg-sector-50 text-sector-700 font-semibold' : 'text-pitlane hover:text-sector-600'}`}>
                                                {b.name}
                                                <span className="float-right text-alloy text-xs">{Number(b.count).toLocaleString()}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </aside>

                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                            <h1 className="t-h2 text-pitlane">{subcategory ?? category}</h1>
                            <ViewControls
                                mode={mode} onMode={setMode}
                                sort={currentSort} onSort={v => applyFilter('sort', v)}
                                total={pagination?.total}
                                sortOptions={sort_options}
                            />
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-20 text-alloy">No products found.</div>
                        ) : mode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {products.map(p => <ProductListRow key={p.id} product={p} />)}
                            </div>
                        )}

                        {pagination && <Pagination pagination={pagination} onChange={page => router.get(base, { ...activeFilters, page })} />}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
