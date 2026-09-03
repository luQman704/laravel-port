import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';

export default function Wishlist({ products = [] }) {
    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="t-h1 text-pitlane">My Wishlist</h1>
                        <p className="text-alloy text-sm mt-1">
                            {products.length > 0
                                ? `${products.length} saved product${products.length !== 1 ? 's' : ''}`
                                : 'Your wishlist is empty'}
                        </p>
                    </div>
                    <a href="/browse" className="btn btn-ghost px-4 py-2 text-sm">Browse Products</a>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">♡</div>
                        <h2 className="t-h2 text-pitlane mb-2">Nothing saved yet</h2>
                        <p className="text-alloy mb-6">Tap the heart icon on any product to save it here.</p>
                        <a href="/browse" className="btn btn-primary px-6 py-2.5">Start Browsing</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
