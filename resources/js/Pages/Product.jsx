import MainLayout from '@/Layouts/MainLayout';
import { useState, useRef, useCallback, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { formatZAR } from '@/utils/format';
import WishlistButton from '@/Components/WishlistButton';
import CompareButton from '@/Components/CompareButton';
import { Stars } from '@/Components/StarRating';
import ReviewForm from '@/Components/ReviewForm';
import ReviewsList from '@/Components/ReviewsList';

function StockRow({ label, qty, esd }) {
    const inStock = qty > 0;
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-asphalt last:border-0">
            <span className="text-pitlane-60 text-sm">{label}</span>
            <div className="flex flex-col items-end gap-0.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${inStock ? 'bg-sector-50 text-sector-700' : 'bg-asphalt text-pitlane-60'}`}>
                    {inStock ? `${qty} in stock` : 'Out of stock'}
                </span>
                {!inStock && esd && (
                    <span className="t-partno text-alloy">Ships by: {esd}</span>
                )}
            </div>
        </div>
    );
}

function StockBadge({ stock }) {
    const local = Math.max(0, stock?.quantity ?? 0);
    const usa = (() => {
        if (!stock?.warehouse_stock) return 0;
        const ws = typeof stock.warehouse_stock === 'string'
            ? JSON.parse(stock.warehouse_stock) : stock.warehouse_stock;
        return Object.values(ws).reduce((s, v) => s + (Number(v) || 0), 0);
    })();
    const mfr = Math.max(0, stock?.mfr_quantity ?? 0);
    const esd = stock?.mfr_esd ?? null;

    return (
        <div>
            <StockRow label="SA Warehouse" qty={local} />
            <StockRow label="USA Warehouse" qty={usa} />
            <StockRow label="Manufacturer" qty={mfr} esd={esd} />
        </div>
    );
}

function StockAlertWidget({ productId, initialHasAlert, userEmail }) {
    const [subscribed, setSubscribed] = useState(initialHasAlert);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isLoggedIn = !!userEmail;

    async function subscribe(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/stock-alert/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({
                    turn14_product_id: productId,
                    email: isLoggedIn ? userEmail : email,
                    watch_local: 1,
                    watch_usa: 1,
                    watch_mfr: 1,
                }),
            });
            const data = await res.json();
            if (res.ok || res.status === 200) {
                setSubscribed(true);
            } else {
                setError(data.message ?? 'Failed to subscribe.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (subscribed) {
        return (
            <div className="mt-3 flex items-center gap-2 p-3 bg-sector-50 border border-sector-200 rounded-xl text-sm text-sector-700">
                <svg className="w-4 h-4 shrink-0 text-sector-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                </svg>
                <span>
                    {isLoggedIn
                        ? "You're subscribed — we'll notify you when back in stock."
                        : "We'll email you when this product is back in stock."}
                </span>
            </div>
        );
    }

    // Logged-in: one-click subscribe, no email input needed
    if (isLoggedIn) {
        return (
            <div className="mt-3">
                <p className="text-sm text-pitlane-60 mb-2">Get notified when back in stock:</p>
                <button
                    onClick={subscribe}
                    disabled={loading}
                    className="btn btn-primary px-5 py-2 text-sm disabled:opacity-50 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                    </svg>
                    {loading ? 'Setting up…' : 'Notify Me'}
                </button>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
        );
    }

    // Guest: show email input
    return (
        <div className="mt-3">
            <p className="text-sm text-pitlane-60 mb-2">Get notified when back in stock:</p>
            <form onSubmit={subscribe} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-3 py-2 text-sm border border-asphalt rounded-xl focus:outline-none focus:border-sector-500 text-pitlane"
                />
                <button type="submit" disabled={loading}
                    className="btn btn-primary px-4 py-2 text-sm disabled:opacity-50">
                    {loading ? '…' : 'Notify Me'}
                </button>
            </form>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

/** Lightbox modal — full-screen zoom view */
function Lightbox({ images, index, onClose, onPrev, onNext }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            {/* Prev */}
            {images.length > 1 && (
                <button
                    onClick={e => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white text-xl"
                >‹</button>
            )}

            <img
                src={images[index]}
                alt=""
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                onClick={e => e.stopPropagation()}
            />

            {/* Next */}
            {images.length > 1 && (
                <button
                    onClick={e => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white text-xl"
                >›</button>
            )}

            {/* Close */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white text-lg"
            >✕</button>

            {/* Counter */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                    {index + 1} / {images.length}
                </div>
            )}
        </div>
    );
}

/** Main image area: slideshow + hover zoom + click to lightbox */
function ProductImageGallery({ images, productName, loading = false }) {
    const [active, setActive]       = useState(0);
    const [lightbox, setLightbox]   = useState(false);
    const [zoom, setZoom]           = useState(false);
    const [zoomPos, setZoomPos]     = useState({ x: 50, y: 50 });
    const imgRef = useRef(null);

    const hasImages = !loading && images && images.length > 0;

    const handleMouseMove = useCallback((e) => {
        const rect = imgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
    }, []);

    function prev() { setActive(i => (i - 1 + images.length) % images.length); }
    function next() { setActive(i => (i + 1) % images.length); }

    return (
        <>
            <div className="flex flex-col gap-3">
                {/* Main image */}
                <div
                    ref={imgRef}
                    className="relative aspect-square bg-white border border-asphalt rounded-2xl overflow-hidden cursor-zoom-in"
                    onMouseEnter={() => setZoom(true)}
                    onMouseLeave={() => setZoom(false)}
                    onMouseMove={handleMouseMove}
                    onClick={() => hasImages && setLightbox(true)}
                >
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-asphalt-dark border-t-sector-500 rounded-full animate-spin" />
                        </div>
                    ) : hasImages ? (
                        <img
                            src={images[active]}
                            alt={productName}
                            className="w-full h-full object-contain p-6 transition-transform duration-200"
                            style={zoom ? {
                                transform: 'scale(2)',
                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                            } : undefined}
                            draggable={false}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-alloy-light text-6xl">▣</div>
                    )}

                    {/* Slideshow arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={e => { e.stopPropagation(); prev(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-pitlane text-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ opacity: 0.7 }}
                            >‹</button>
                            <button
                                onClick={e => { e.stopPropagation(); next(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-pitlane text-lg shadow-sm"
                                style={{ opacity: 0.7 }}
                            >›</button>
                        </>
                    )}

                    {/* Zoom hint */}
                    {hasImages && !zoom && (
                        <div className="absolute bottom-2 right-2 text-[10px] text-alloy-light bg-white/70 px-1.5 py-0.5 rounded pointer-events-none">
                            Hover to zoom
                        </div>
                    )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.map((url, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                                    i === active
                                        ? 'border-sector-500 ring-1 ring-sector-300'
                                        : 'border-asphalt hover:border-asphalt-dark'
                                }`}
                            >
                                <img src={url} alt="" className="w-full h-full object-contain p-1 bg-white" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {lightbox && (
                <Lightbox
                    images={images}
                    index={active}
                    onClose={() => setLightbox(false)}
                    onPrev={prev}
                    onNext={next}
                />
            )}
        </>
    );
}

export default function Product({ product, review_stats, has_alert }) {
    const { auth } = usePage().props;
    const userEmail = auth?.user?.email ?? null;
    const reviewStats = review_stats ?? { total: 0, avg_rating: 0, breakdown: {} };
    const [qty, setQty]         = useState(1);
    const [adding, setAdding]   = useState(false);
    const [added, setAdded]     = useState(false);
    const [removing, setRemoving] = useState(false);
    const imgContainerRef = useRef(null);

    // Lazy-load high-res images from Turn14 API (cached server-side after first fetch)
    const [images, setImages]         = useState(product?.images?.length > 0 ? product.images : []);
    const [imagesLoading, setImagesLoading] = useState(images.length === 0);

    useEffect(() => {
        if (!product?.id) return;
        fetch(`/api/product/${encodeURIComponent(product.id)}/images`)
            .then(r => r.json())
            .then(data => {
                if (data.images?.length > 0) setImages(data.images);
            })
            .catch(() => {})
            .finally(() => setImagesLoading(false));
    }, [product?.id]);

    if (!product) return null;

    const inStock = (product.stock?.quantity ?? 0) > 0 ||
        (() => {
            if (!product.stock?.warehouse_stock) return false;
            const ws = typeof product.stock.warehouse_stock === 'string'
                ? JSON.parse(product.stock.warehouse_stock) : product.stock.warehouse_stock;
            return Object.values(ws).some(v => Number(v) > 0);
        })() ||
        (product.stock?.mfr_quantity ?? 0) > 0;

    function removeFromCart() {
        setRemoving(true);
        router.post('/cart/remove', {
            turn14_product_id: product.id,
        }, {
            preserveScroll: true,
            onSuccess: () => { setAdded(false); setRemoving(false); },
            onError:   () => setRemoving(false),
        });
    }

    function addToCart() {
        setAdding(true);
        router.post('/cart/add', {
            turn14_product_id: product.id,
            qty,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAdded(true);
                setAdding(false);
                // Fire fly-to-cart animation
                const containerEl = imgContainerRef.current;
                if (containerEl) {
                    const rect = containerEl.getBoundingClientRect();
                    window.dispatchEvent(new CustomEvent('cart:fly', {
                        detail: { src: images[0] ?? product.thumbnail ?? null, rect },
                    }));
                }
            },
            onError: () => setAdding(false),
        });
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Breadcrumb */}
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2 flex-wrap">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <a href={`/category/${encodeURIComponent(product.category)}`} className="hover:text-sector-600">{product.category}</a>
                    <span>/</span>
                    <span className="text-pitlane">{product.product_name}</span>
                </nav>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div ref={imgContainerRef}>
                        <ProductImageGallery images={images} productName={product.product_name} loading={imagesLoading} />
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            {product.brand?.name && (
                                <div className="t-label text-alloy">{product.brand.name}</div>
                            )}
                            {/* Wishlist + Compare */}
                            <div className="flex items-center gap-3 ml-auto shrink-0">
                                <WishlistButton productId={product.id} />
                                <CompareButton product={product} />
                            </div>
                        </div>
                        <h1 className="t-h1 text-pitlane mb-2">{product.product_name}</h1>

                        {/* Inline review summary */}
                        {reviewStats.total > 0 && (
                            <a href="#reviews" className="flex items-center gap-2 mb-3 group w-fit">
                                <Stars rating={reviewStats.avg_rating} size="sm" />
                                <span className="text-xs text-alloy group-hover:text-sector-600 transition-colors">
                                    {reviewStats.avg_rating.toFixed(1)} · {reviewStats.total} review{reviewStats.total !== 1 ? 's' : ''}
                                </span>
                            </a>
                        )}

                        <div className="flex flex-wrap gap-3 mb-4 text-pitlane-60">
                            <span className="t-partno">Part #: <strong className="text-pitlane">{product.part_number}</strong></span>
                            {product.mfr_part_number && (
                                <span className="t-partno">Mfr #: <strong className="text-pitlane">{product.mfr_part_number}</strong></span>
                            )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.special_order && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">Special Order</span>}
                            {product.ltl_freight_required && <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">LTL Freight</span>}
                            {product.clearance_item && <span className="px-2 py-1 bg-titanium-light text-titanium-dark rounded text-xs font-semibold">Clearance</span>}
                            {product.is_kit && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">Kit</span>}
                        </div>

                        {/* Price */}
                        {product.price_incl > 0 ? (
                            <div className="mb-6">
                                <div className="t-price text-sector-600" style={{ fontSize: '2rem' }}>
                                    {formatZAR(product.price_incl)}
                                </div>
                                <div className="text-sm text-pitlane-60 mt-1">
                                    Incl. VAT · {formatZAR(product.price_excl ?? 0)} excl.
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6 text-pitlane-60 italic text-sm">Price on request</div>
                        )}

                        {/* Stock */}
                        <div className="mb-6 p-4 bg-asphalt rounded-xl">
                            <h3 className="t-label text-alloy mb-3">Availability</h3>
                            <StockBadge stock={product.stock} />
                        </div>

                        {/* Add to cart */}
                        {inStock ? (
                            <div className="flex gap-3 mb-4">
                                <div className="flex items-center border border-asphalt-dark rounded-lg overflow-hidden">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-pitlane-60 hover:bg-asphalt text-lg">−</button>
                                    <span className="px-4 py-2 text-sm font-semibold text-pitlane min-w-[2.5rem] text-center">{qty}</span>
                                    <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-pitlane-60 hover:bg-asphalt text-lg">+</button>
                                </div>
                                {added ? (
                                    <button
                                        onClick={removeFromCart}
                                        disabled={removing}
                                        className="btn btn-ghost flex-1 py-3 disabled:opacity-50"
                                        style={{ boxShadow: 'inset 0 0 0 2px #fca5a5', color: '#dc2626' }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #dc2626'; e.currentTarget.style.background = '#fef2f2'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #fca5a5'; e.currentTarget.style.background = ''; }}
                                    >
                                        {removing ? 'Removing…' : 'Remove from Cart'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={addToCart}
                                        disabled={adding}
                                        className="btn btn-primary flex-1 py-3 disabled:opacity-50"
                                    >
                                        {adding ? 'Adding…' : 'Add to Cart'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="w-full bg-asphalt text-pitlane-60 font-bold py-3 rounded-xl text-base text-center mb-2">
                                    Out of Stock
                                </div>
                                <StockAlertWidget
                                    productId={product.id}
                                    initialHasAlert={has_alert}
                                    userEmail={userEmail}
                                />
                            </div>
                        )}

                        {/* Description */}
                        {product.part_description && (
                            <div className="mt-6">
                                <h3 className="t-label text-alloy mb-2">Description</h3>
                                <p className="text-pitlane-60 text-sm leading-relaxed">{product.part_description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kit Contents */}
                {product.is_kit && product.kit_items?.length > 0 && (
                    <div className="mt-12">
                        <h2 className="t-h2 text-pitlane mb-4">Kit Contents</h2>
                        <div className="bg-white border border-asphalt rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-asphalt">
                                    <tr>
                                        <th className="t-label text-alloy text-left px-4 py-3">Part #</th>
                                        <th className="t-label text-alloy text-left px-4 py-3">Description</th>
                                        <th className="t-label text-alloy text-right px-4 py-3">Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-asphalt">
                                    {product.kit_items.map((item, i) => (
                                        <tr key={i} className="hover:bg-asphalt">
                                            <td className="px-4 py-3 t-partno text-pitlane-60">{item.part_number}</td>
                                            <td className="px-4 py-3 text-pitlane-60">{item.item_name}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-pitlane">{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Reviews ─────────────────────────────────────────────────── */}
                <div id="reviews" className="mt-16 scroll-mt-20">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="t-h2 text-pitlane">Customer Reviews</h2>
                        {reviewStats.total > 0 && (
                            <div className="flex items-center gap-2">
                                <Stars rating={reviewStats.avg_rating} size="md" />
                                <span className="text-sm font-semibold text-pitlane">{reviewStats.avg_rating.toFixed(1)}</span>
                                <span className="text-sm text-alloy">({reviewStats.total})</span>
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Reviews list — takes 2 cols */}
                        <div className="lg:col-span-2">
                            <ReviewsList
                                turn14Id={product.id}
                                stats={reviewStats}
                            />
                        </div>

                        {/* Review form — 1 col */}
                        <div>
                            <ReviewForm
                                turn14Id={product.id}
                                onSubmitted={() => window.location.reload()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
