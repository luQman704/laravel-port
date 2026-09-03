import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import ProductListRow from '@/Components/ProductListRow';
import Pagination from '@/Components/Pagination';
import ViewControls, { useViewMode } from '@/Components/ViewControls';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Search({ term, products, pagination, current_sort, sort_options = [] }) {
    const [q, setQ] = useState(term ?? '');
    const [mode, setMode] = useViewMode('grid');

    function handleSearch(e) {
        e.preventDefault();
        router.get('/search', { q, sort: current_sort });
    }

    function handleSort(sort) {
        router.get('/search', { q: term, sort });
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-xl">
                    <input
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Search part number, name…"
                        className="flex-1 border border-asphalt-dark rounded-lg px-4 py-2.5 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-500"
                        autoFocus
                    />
                    <button className="btn btn-primary px-5 py-2.5">Search</button>
                </form>

                {term && (
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <h1 className="t-h2 text-pitlane">
                            {pagination?.total > 0
                                ? `${pagination.total.toLocaleString()} results for "${term}"`
                                : `No results for "${term}"`}
                        </h1>
                        {products.length > 0 && (
                            <ViewControls
                                mode={mode} onMode={setMode}
                                sort={current_sort} onSort={handleSort}
                                sortOptions={sort_options}
                            />
                        )}
                    </div>
                )}

                {products.length > 0 && (
                    <>
                        {mode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {products.map(p => <ProductListRow key={p.id} product={p} />)}
                            </div>
                        )}
                        {pagination && <Pagination pagination={pagination} onChange={page => router.get('/search', { q: term, sort: current_sort, page })} />}
                    </>
                )}
            </div>
        </MainLayout>
    );
}
