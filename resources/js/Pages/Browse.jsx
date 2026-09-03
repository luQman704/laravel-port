import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import ProductListRow from '@/Components/ProductListRow';
import Pagination from '@/Components/Pagination';
import ViewControls, { useViewMode } from '@/Components/ViewControls';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Browse({ products, pagination, categories, filters, sort_options = [] }) {
    const [search, setSearch]     = useState(filters?.search ?? '');
    const [priceMin, setPriceMin] = useState(filters?.price_min ?? '');
    const [priceMax, setPriceMax] = useState(filters?.price_max ?? '');
    const [mode, setMode]         = useViewMode('grid');

    function applyFilter(key, value) {
        router.get('/browse', { ...filters, [key]: value, page: 1 }, { preserveState: true });
    }

    function applyFilters(extra = {}) {
        router.get('/browse', { ...filters, ...extra, page: 1 }, { preserveState: true });
    }

    function handleSearch(e) {
        e.preventDefault();
        applyFilter('search', search);
    }

    function handlePriceFilter(e) {
        e.preventDefault();
        applyFilters({ price_min: priceMin, price_max: priceMax });
    }

    function clearFilter(key) {
        const next = { ...filters };
        delete next[key];
        router.get('/browse', { ...next, page: 1 }, { preserveState: true });
    }

    const currentSort  = filters?.sort ?? 'default';
    const inStockOn    = !!filters?.in_stock;
    const hasCategory  = !!filters?.category;
    const hasPriceMin  = filters?.price_min !== undefined && filters?.price_min !== '';
    const hasPriceMax  = filters?.price_max !== undefined && filters?.price_max !== '';

    const activeCount = [inStockOn, hasCategory, hasPriceMin || hasPriceMax].filter(Boolean).length;

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-56 shrink-0 space-y-6">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search parts…"
                                className="flex-1 border border-asphalt-dark rounded-lg px-3 py-2 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-500"
                            />
                            <button className="btn btn-primary px-3 py-2">Go</button>
                        </form>

                        {/* Quick filters */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="t-label text-alloy">Filters</h3>
                                {activeCount > 0 && (
                                    <button
                                        onClick={() => router.get('/browse', {}, { preserveState: true })}
                                        className="text-[10px] text-red-500 hover:text-red-700 font-semibold uppercase tracking-wide"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* In stock toggle */}
                            <button
                                onClick={() => inStockOn ? clearFilter('in_stock') : applyFilter('in_stock', '1')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors mb-3 ${
                                    inStockOn
                                        ? 'bg-green-50 border-green-300 text-green-700'
                                        : 'border-asphalt-dark text-pitlane hover:border-sector-400 hover:text-sector-700'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${inStockOn ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    In stock only
                                </span>
                                {inStockOn && (
                                    <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>

                            {/* Price range */}
                            <form onSubmit={handlePriceFilter} className="space-y-2">
                                <h4 className="t-label text-alloy text-[10px]">Price range (ZAR incl. VAT)</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Min"
                                        value={priceMin}
                                        onChange={e => setPriceMin(e.target.value)}
                                        className="w-full border border-asphalt-dark rounded-lg px-2 py-1.5 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-500"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Max"
                                        value={priceMax}
                                        onChange={e => setPriceMax(e.target.value)}
                                        className="w-full border border-asphalt-dark rounded-lg px-2 py-1.5 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-500"
                                    />
                                </div>
                                <button type="submit" className="w-full btn btn-primary py-1.5 text-sm">Apply</button>
                                {(hasPriceMin || hasPriceMax) && (
                                    <button
                                        type="button"
                                        onClick={() => { setPriceMin(''); setPriceMax(''); applyFilters({ price_min: '', price_max: '' }); }}
                                        className="w-full text-xs text-alloy hover:text-red-500 transition-colors"
                                    >
                                        Clear price filter
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="t-label text-alloy mb-3">Categories</h3>
                            <ul className="space-y-1 text-sm">
                                {categories?.map(cat => (
                                    <li key={cat.category}>
                                        <button
                                            onClick={() => applyFilter('category', cat.category)}
                                            className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${filters?.category === cat.category ? 'bg-sector-50 text-sector-700 font-semibold' : 'text-pitlane hover:text-sector-600'}`}
                                        >
                                            {cat.category}
                                            <span className="float-right text-alloy text-xs">{Number(cat.count).toLocaleString()}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                            <h1 className="t-h2 text-pitlane">
                                {filters?.category ?? 'All Products'}
                                {filters?.search && <span className="ml-2 text-pitlane-60 font-normal text-base">"{filters.search}"</span>}
                            </h1>
                            <ViewControls
                                mode={mode} onMode={setMode}
                                sort={currentSort} onSort={v => applyFilter('sort', v)}
                                total={pagination?.total}
                                sortOptions={sort_options}
                            />
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-20 text-pitlane-60">No products found.</div>
                        ) : mode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {products.map(p => <ProductListRow key={p.id} product={p} />)}
                            </div>
                        )}

                        {pagination && <Pagination pagination={pagination} onChange={page => router.get('/browse', { ...filters, page })} />}
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
