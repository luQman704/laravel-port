import MainLayout from '@/Layouts/MainLayout';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { formatZAR } from '@/utils/format';

// ── Scroll-triggered reveal ──────────────────────────────────────────────────
function useInView(threshold = 0.12) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
}

// ── Countdown timer ──────────────────────────────────────────────────────────
function useCountdown(endsAt) {
    const [remaining, setRemaining] = useState(null);
    useEffect(() => {
        if (!endsAt) return;
        const target = new Date(endsAt).getTime();
        function tick() {
            const diff = target - Date.now();
            if (diff <= 0) { setRemaining(null); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setRemaining({ d, h, m, s });
        }
        tick();
        const t = setInterval(tick, 1000);
        return () => clearInterval(t);
    }, [endsAt]);
    return remaining;
}

function CountdownDisplay({ endsAt }) {
    const t = useCountdown(endsAt);
    if (!t) return null;
    return (
        <div className="flex items-center gap-1 mt-2">
            {[['d', t.d], ['h', t.h], ['m', t.m], ['s', t.s]].map(([unit, val]) => (
                <span key={unit} className="flex flex-col items-center">
                    <span className="font-mono text-xs font-bold bg-pitlane text-white px-1.5 py-0.5 rounded min-w-[1.75rem] text-center">
                        {String(val).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-alloy uppercase tracking-wide">{unit}</span>
                </span>
            ))}
        </div>
    );
}

function toHighRes(url) {
    if (!url) return url;
    return url.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2');
}

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, dealPrice }) {
    const thumb = toHighRes(product.images?.[0] ?? product.thumbnail ?? null);
    const price = dealPrice ?? product.price_incl;

    return (
        <a
            href={`/product/${product.id}`}
            className="group flex flex-col bg-white border border-asphalt rounded-xl overflow-hidden hover:border-sector-300 hover:shadow-md transition-all duration-200"
        >
            {/* Image */}
            <div className="aspect-square bg-cloud flex items-center justify-center overflow-hidden">
                {thumb
                    ? <img src={thumb} alt={product.product_name}
                           className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                           onError={e => { e.target.style.display = 'none'; }} />
                    : <span className="text-4xl text-alloy-light">▣</span>
                }
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-3 gap-1">
                {product.brand?.name && (
                    <div className="t-label text-alloy">{product.brand.name}</div>
                )}
                <div className="text-sm font-semibold text-pitlane leading-snug line-clamp-2 flex-1">
                    {product.product_name}
                </div>
                <div className="t-partno text-alloy-light">#{product.part_number}</div>
                <div className="mt-2">
                    {price > 0 ? (
                        <>
                            <div className="font-mono font-bold text-sector-600 text-base">{formatZAR(price)}</div>
                            {dealPrice && product.price_incl > dealPrice && (
                                <div className="font-mono text-xs text-alloy line-through">{formatZAR(product.price_incl)}</div>
                            )}
                        </>
                    ) : (
                        <span className="text-xs text-alloy italic">POA</span>
                    )}
                </div>
            </div>
        </a>
    );
}

// ── Category SVG icons ───────────────────────────────────────────────────────
const CategoryIcon = ({ name, className = "w-6 h-6" }) => {
    const icons = {
        'Brakes, Rotors & Pads': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5"/>
                <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2"/>
                <circle cx="20" cy="20" r="2.5" fill="currentColor"/>
                <rect x="18.75" y="4" width="2.5" height="7" rx="1.25" fill="currentColor"/>
                <rect x="18.75" y="29" width="2.5" height="7" rx="1.25" fill="currentColor"/>
                <rect x="4" y="18.75" width="7" height="2.5" rx="1.25" fill="currentColor"/>
                <rect x="29" y="18.75" width="7" height="2.5" rx="1.25" fill="currentColor"/>
            </svg>
        ),
        'Engine Components': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <rect x="9" y="13" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
                <rect x="15" y="9" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="21" y="9" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 21H5M35 21h-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        'Suspension': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <circle cx="10" cy="31" r="4.5" stroke="currentColor" strokeWidth="2.5"/>
                <circle cx="30" cy="31" r="4.5" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M10 26.5V15l5-5h10l5 5v11.5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M15 15h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 19.5h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2.5"/>
            </svg>
        ),
        'Drivetrain': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <circle cx="8" cy="20" r="5" stroke="currentColor" strokeWidth="2.5"/>
                <circle cx="32" cy="20" r="5" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M13 20h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        'Exhaust, Mufflers & Tips': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <path d="M6 20c3-5 10-7 15-3s11 6 13 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <rect x="28" y="15" width="8" height="10" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M32 8c0 0 1.5 3.5 0 6M35.5 9.5c0 0 1 3 0 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
            </svg>
        ),
        'Wheels': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <circle cx="20" cy="20" r="15.5" stroke="currentColor" strokeWidth="2.5"/>
                <circle cx="20" cy="20" r="5.5" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 14.5V7M20 33v-7.5M14.5 20H7M33 20h-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M15.3 15.3L10 10M24.7 24.7L30 30M24.7 15.3L30 10M15.3 24.7L10 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        ),
        'Air Intake Systems': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <path d="M8 29c3-8 8-13 12-13s8 5 12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <rect x="28" y="16" width="7" height="10" rx="3.5" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M13 25c2-3 4-5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
            </svg>
        ),
        'Forced Induction': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <circle cx="23" cy="20" r="11" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M12 20c3-3 5-4 8-4M14 26c2-3 5-5 8-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="23" cy="20" r="3.5" fill="currentColor"/>
                <path d="M6 20H2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
        ),
        'Fuel Delivery': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <rect x="7" y="10" width="18" height="24" rx="2" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M25 16.5h4a2 2 0 012 2v4a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="2"/>
                <path d="M13 20.5h8M13 15.5h8M13 25.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        ),
        'Exterior Styling': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <path d="M5 27c0 0 3-9 9-11s14-2 18 0 4 7 4 11H5z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                <circle cx="12" cy="30" r="3.5" stroke="currentColor" strokeWidth="2.5"/>
                <circle cx="28" cy="30" r="3.5" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M15 23c2-4 6-5 10-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
            </svg>
        ),
        'Lights': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <circle cx="20" cy="18" r="6.5" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M20 7.5V5M20 31v-2.5M8 18H5.5M34.5 18H32M11.5 9.5L10 8M30 9.5l1.5-1.5M11.5 26.5L10 28M30 26.5l1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 15v3l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        'Fabrication': (
            <svg viewBox="0 0 40 40" fill="none" className={className}>
                <path d="M8 32l5-5M27 13l5-5M13 27l14-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <rect x="5" y="26" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="2.5"/>
                <rect x="26" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="2.5"/>
            </svg>
        ),
    };
    return icons[name] ?? (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
            <rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5"/>
            <path d="M13 20h14M20 13v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
    );
};

// ── Data ─────────────────────────────────────────────────────────────────────
const STAGES = [
    {
        n: 0, label: 'Stock',
        desc: 'Keep your car right. Factory-spec parts, correct fitment, no guesswork.',
        detail: 'Maintenance parts, OEM replacements, and consumables. Everything to keep the car reliable and roadworthy at factory spec.',
        tags: ['Maintenance', 'OEM replacement', 'Brake pads', 'Filters', 'Fluids'],
    },
    {
        n: 1, label: 'Stage 1',
        desc: 'First bolt-ons. Gains you can feel without touching the internals.',
        detail: 'Direct-fit upgrades that require no engine work. Cold air intake, cat-back exhaust, suspension — the builds most SA enthusiasts start with.',
        tags: ['Cold air intake', 'Cat-back exhaust', 'Performance coilovers', 'Sway bar', 'Sport brake pads'],
    },
    {
        n: 2, label: 'Stage 2',
        desc: 'Power-supporting mods. The parts that let you tune properly.',
        detail: 'When Stage 1 parts are on and a tune is next, these are the supporting upgrades. Headers, high-flow fuel system, intercooler — the foundation for real power.',
        tags: ['Headers / manifold', 'High-flow fuel pump', 'Injectors', 'Big brake kit', 'Intercooler'],
    },
    {
        n: 3, label: 'Stage 3',
        desc: 'Track-ready. Built for sustained high-load use.',
        detail: 'Full braking overhaul, forged wheels, aero. Parts that handle track-day heat cycles and loads that destroy stock components.',
        tags: ['Full coilover kit', 'Forged wheels', 'Slotted rotors', 'Splitter / diffuser', 'Strut brace'],
    },
    {
        n: 4, label: 'Stage 4',
        desc: 'Full build. Engine internals, standalone ECU, safety equipment.',
        detail: 'Forged bottom end, ported head, standalone ECU, safety cage. Maximum performance — built for the strip, the circuit, or both.',
        tags: ['Forged pistons & rods', 'Ported head', 'Standalone ECU', 'Roll cage', 'Racing harness'],
    },
];

const BRANDS_FALLBACK = [
    'Brembo', 'EBC Brakes', 'Wilwood', 'PowerStop', 'Wiseco', 'COMP Cams',
    'WeatherTech', 'Goodridge', 'Gates', 'Vortex Racing', 'DFC', 'Covercraft',
    'ACT Clutch', 'Mishimoto', 'KW Suspension', 'Eibach', 'Stoptech',
];

const CATEGORY_COUNT = 10;

const HERO_IMG = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80';

const SERVICE_FEATURES = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M10 12v4m4-4v4"/>
            </svg>
        ),
        label: 'Door Delivery',
        desc: '2–5 business days, nationally',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
        ),
        label: 'Easy Returns',
        desc: '30-day hassle-free returns',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
        ),
        label: 'Secure Checkout',
        desc: 'SSL-encrypted, safe payment',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        ),
        label: 'ZAR All-In Pricing',
        desc: 'Exchange rate + duty + VAT included',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
        ),
        label: 'Expert Support',
        desc: 'SA-based team, real car people',
    },
];

// ── Testimonial carousel ─────────────────────────────────────────────────────
function TestimonialCarousel({ testimonials }) {
    const [idx, setIdx] = useState(0);
    const [dir, setDir] = useState(1);
    const total = testimonials.length;

    function go(next) {
        setDir(next > idx ? 1 : -1);
        setIdx(next);
    }

    if (total === 0) return null;

    const t = testimonials[idx];
    return (
        <div className="relative">
            <div key={idx} className="animate-testimonialFade max-w-2xl mx-auto text-center px-10">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < t.rating ? 'text-sector-500' : 'text-asphalt-dark'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    ))}
                </div>
                {/* Quote */}
                <blockquote className="t-h3 text-pitlane leading-relaxed mb-6 font-normal italic">
                    "{t.body}"
                </blockquote>
                {/* Attribution */}
                <div>
                    <div className="font-semibold text-pitlane">{t.customer_name}</div>
                    <div className="text-sm text-alloy mt-0.5">
                        {[t.vehicle, t.customer_location].filter(Boolean).join(' · ')}
                    </div>
                </div>
            </div>

            {total > 1 && (
                <>
                    <button
                        onClick={() => go((idx - 1 + total) % total)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-asphalt hover:border-sector-400 hover:text-sector-600 transition-colors text-alloy"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => go((idx + 1) % total)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-asphalt hover:border-sector-400 hover:text-sector-600 transition-colors text-alloy"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: total }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => go(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-sector-600 w-5' : 'bg-asphalt-dark'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ── Newsletter form ───────────────────────────────────────────────────────────
function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [sent, setSent]   = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function subscribe(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({ email }),
            });
            if (res.ok || res.status === 200) {
                setSent(true);
            } else {
                const data = await res.json();
                setError(data.message ?? 'Something went wrong.');
            }
        } catch {
            setError('Network error. Try again.');
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div className="text-center py-4">
                <div className="text-sector-400 text-3xl mb-2">✓</div>
                <p className="font-semibold text-white">You're in. Watch your inbox.</p>
            </div>
        );
    }

    return (
        <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg text-pitlane text-sm bg-white border-0 focus:outline-none focus:ring-2 focus:ring-sector-400"
            />
            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-7 py-3 disabled:opacity-50 whitespace-nowrap"
            >
                {loading ? 'Subscribing…' : 'Subscribe'}
            </button>
            {error && <p className="text-xs text-red-300 mt-1 sm:col-span-2">{error}</p>}
        </form>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home({
    stats, categories, makes,
    deals = [], featuredBrands = [], trending = [],
    popular = [], testimonials = [], articles = [],
}) {
    const [makeId, setMakeId]   = useState('');
    const [year, setYear]       = useState('');
    const [modelId, setModelId] = useState('');
    const [years, setYears]     = useState([]);
    const [models, setModels]   = useState([]);
    const [activeStage, setActiveStage] = useState(1);
    const [ready, setReady]     = useState(false);
    const [popularTab, setPopularTab]   = useState(0);

    const [stageRef,    stageInView]    = useInView();
    const [catRef,      catInView]      = useInView();
    const [whyRef,      whyInView]      = useInView();
    const [dealsRef,    dealsInView]    = useInView();
    const [brandsRef,   brandsInView]   = useInView();
    const [trendRef,    trendInView]    = useInView();
    const [popularRef,  popularInView]  = useInView();
    const [testiRef,    testiInView]    = useInView();
    const [newsRef,     newsInView]     = useInView();
    const [articlesRef, articlesInView] = useInView();

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 60);
        return () => clearTimeout(t);
    }, []);

    async function onMakeChange(e) {
        const id = e.target.value;
        setMakeId(id); setYear(''); setModelId(''); setModels([]);
        if (!id) { setYears([]); return; }
        setYears(await (await fetch(`/api/vehicles/years?make_id=${id}`)).json());
    }
    async function onYearChange(e) {
        const y = e.target.value;
        setYear(y); setModelId('');
        if (!y) { setModels([]); return; }
        setModels(await (await fetch(`/api/vehicles/models?make_id=${makeId}&year=${y}`)).json());
    }

    const heroSel = [
        'flex-1 bg-white border-0 text-pitlane rounded-lg px-3 py-2.5',
        'text-sm focus:outline-none focus:ring-2 focus:ring-sector-500 shadow-sm',
        'disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200',
    ].join(' ');

    const topCategories = categories?.slice(0, CATEGORY_COUNT) ?? [];

    const stageFillWidth = `${activeStage * 20}%`;

    // Brand strip — use admin-featured brands if available, else fall back to static list
    const brandNames = featuredBrands.length > 0
        ? featuredBrands.map(b => b.name)
        : BRANDS_FALLBACK;
    const marqueeItems = [...brandNames, ...brandNames];

    const popularTabs   = popular.map(g => g.tab);
    const popularProducts = popular[popularTab]?.products ?? [];

    return (
        <MainLayout>

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section
                className="relative bg-pitlane flex flex-col"
                style={{
                    backgroundImage: `linear-gradient(105deg, rgba(13,31,53,0.97) 0%, rgba(13,31,53,0.85) 40%, rgba(13,31,53,0.40) 100%), url(${HERO_IMG})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 42%',
                    minHeight: '600px',
                }}
            >
                <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-20 md:py-28 flex items-center">
                    <div className="max-w-xl">
                        <h1
                            className={`t-display text-white leading-[0.95] mb-6 transition-all duration-700 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}
                            style={{ transitionDelay: '0ms' }}
                        >
                            Build your car.<br />
                            <span className="text-sector-400">Stage by stage.</span>
                        </h1>
                        <p
                            className={`text-[1.05rem] text-white/60 leading-relaxed mb-10 transition-all duration-700 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}
                            style={{ transitionDelay: '80ms' }}
                        >
                            {(stats?.total_products ?? 0).toLocaleString()} parts from{' '}
                            <strong className="text-white/90 font-semibold">
                                {stats?.total_brands ?? 0} specialist brands
                            </strong>{' '}
                            — matched to your vehicle, landed price in ZAR.
                        </p>
                        <div
                            className={`transition-all duration-700 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}
                            style={{ transitionDelay: '160ms' }}
                        >
                            <div className="text-white/40 text-xs font-medium mb-2.5">Find parts for your vehicle</div>
                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                <select className={heroSel} value={makeId} onChange={onMakeChange}>
                                    <option value="">Make</option>
                                    {makes?.map(m => (
                                        <option key={m.id_make} value={m.id_make}>{m.make}</option>
                                    ))}
                                </select>
                                <select
                                    className={`${heroSel} ${makeId ? 'opacity-100' : 'opacity-50'}`}
                                    value={year} onChange={onYearChange} disabled={!makeId}
                                >
                                    <option value="">Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <select
                                    className={`${heroSel} ${year ? 'opacity-100' : 'opacity-50'}`}
                                    value={modelId} onChange={e => setModelId(e.target.value)} disabled={!year}
                                >
                                    <option value="">Model</option>
                                    {models.map(m => (
                                        <option key={m.id_vehicle_filter} value={m.id_vehicle_filter}>{m.model}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => modelId && router.get(`/vehicles/${modelId}`)}
                                    disabled={!modelId}
                                    className="btn btn-primary px-7 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    Find Parts
                                </button>
                            </div>
                            <div className="flex gap-5 border-t border-white/10 pt-4">
                                <a href="/vehicles" className="text-white/45 hover:text-white text-sm transition-colors">Browse by vehicle</a>
                                <a href="/engines"  className="text-white/45 hover:text-white text-sm transition-colors">Browse by engine</a>
                                <a href="/browse"   className="text-white/45 hover:text-white text-sm transition-colors">Full catalogue</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Service features strip ────────────────────────────────────── */}
            <section className="bg-pitlane border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex flex-wrap justify-between gap-6">
                        {SERVICE_FEATURES.map(({ icon, label, desc }) => (
                            <div key={label} className="flex items-center gap-3 text-white/80 flex-1 min-w-[160px]">
                                <div className="text-sector-400 shrink-0">{icon}</div>
                                <div>
                                    <div className="text-sm font-semibold text-white leading-tight">{label}</div>
                                    <div className="text-xs text-white/50 mt-0.5">{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ── Brand marquee strip ───────────────────────────────────────── */}
            <section className="border-b border-asphalt bg-white py-3 overflow-hidden">
                <div
                    className="flex items-center"
                    style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}
                >
                    <div className="flex gap-10 animate-marquee whitespace-nowrap shrink-0">
                        {marqueeItems.map((b, i) => (
                            <a
                                key={i}
                                href={`/browse?search=${encodeURIComponent(b)}`}
                                className="text-sm text-pitlane-60 hover:text-sector-600 transition-colors shrink-0"
                            >
                                {b}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Deals of the Day ─────────────────────────────────────────── */}
            {deals.length > 0 && (
                <section ref={dealsRef} className="bg-white border-b border-asphalt py-14">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className={`flex items-end justify-between mb-8 transition-all duration-700 ${dealsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div>
                                <h2 className="t-h1 text-pitlane">Deals of the day</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <p className="text-sm text-pitlane-60">Expires in</p>
                                    <CountdownDisplay endsAt={deals[0]?.ends_at} />
                                </div>
                            </div>
                            <a href="/browse?sort=price_asc" className="text-sm font-semibold text-sector-600 hover:text-sector-700">
                                View all deals →
                            </a>
                        </div>
                        <div
                            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 transition-all duration-700 ${dealsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: '120ms' }}
                        >
                            {deals.map(p => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    dealPrice={p.deal_price_incl}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Featured Brands ───────────────────────────────────────────── */}
            <section ref={brandsRef} className="bg-cloud border-b border-asphalt py-14">
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`mb-8 transition-all duration-700 ${brandsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="t-h1 text-pitlane">Featured brands</h2>
                        <p className="text-sm text-pitlane-60 mt-1">World-class performance marques, all stocked and priced in ZAR.</p>
                    </div>
                    <div
                        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 transition-all duration-700 ${brandsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: '100ms' }}
                    >
                        {(featuredBrands.length > 0 ? featuredBrands : BRANDS_FALLBACK.slice(0, 12).map(n => ({ name: n, brand_id: n }))).map((brand, i) => (
                            <a
                                key={brand.brand_id ?? i}
                                href={`/browse?search=${encodeURIComponent(brand.name)}`}
                                className="group bg-white border border-asphalt rounded-xl px-4 py-5 flex items-center justify-center hover:border-sector-300 hover:shadow-sm transition-all"
                            >
                                {brand.logo_url ? (
                                    <img src={brand.logo_url} alt={brand.name} className="h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <span className="text-sm font-semibold text-pitlane-60 group-hover:text-sector-700 transition-colors text-center leading-tight">{brand.name}</span>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Build Advisor ─────────────────────────────────────────────── */}
            <section ref={stageRef} className="bg-white py-16 border-b border-asphalt overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Heading */}
                    <div className={`mb-10 transition-all duration-700 ${stageInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                            <div>
                                <div className="text-xs font-semibold text-sector-600 uppercase tracking-widest mb-2">Build Advisor</div>
                                <h2 className="t-h1 text-pitlane">Track your build progress</h2>
                                <p className="t-body text-pitlane-60 mt-2 max-w-lg">
                                    Select your current stage — we'll show you exactly what parts
                                    move you to the next level, matched to your vehicle.
                                </p>
                            </div>
                            <a
                                href={`/advisor?stage=${activeStage}${modelId ? `&vehicle_filter_id=${modelId}` : ''}`}
                                className="shrink-0 inline-flex items-center gap-2 btn btn-primary px-7 py-3 self-start lg:self-auto"
                            >
                                Get my recommendations
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div
                        className={`transition-all duration-700 ${stageInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: '100ms' }}
                    >
                        <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">

                            {/* ── Left: Stage infographic ── */}
                            <div>
                                {/* Stage ladder */}
                                <div className="relative pb-8 mb-8 border-b border-asphalt">
                                    <div className="absolute h-px bg-asphalt-dark" style={{ top: '20px', left: '5%', right: '5%' }} />
                                    <div className="absolute h-px bg-sector-600 transition-all duration-500 ease-out" style={{ top: '20px', left: '5%', width: stageFillWidth }} />
                                    <div className="relative flex">
                                        {STAGES.map(s => {
                                            const past   = s.n < activeStage;
                                            const active = s.n === activeStage;
                                            return (
                                                <button
                                                    key={s.n}
                                                    onClick={() => setActiveStage(s.n)}
                                                    className="flex-1 flex flex-col items-center gap-3 focus:outline-none group"
                                                >
                                                    <div className={[
                                                        'w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm z-10',
                                                        'transition-all duration-300',
                                                        active
                                                            ? 'bg-sector-600 text-white scale-[1.25] shadow-lg shadow-sector-600/35 ring-4 ring-sector-100'
                                                            : past
                                                            ? 'bg-sector-600 text-white'
                                                            : 'bg-white border-2 border-asphalt-dark text-alloy-light group-hover:border-sector-400 group-hover:text-pitlane group-hover:scale-105',
                                                    ].join(' ')}>
                                                        {past ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                                                            </svg>
                                                        ) : <span>{s.n}</span>}
                                                    </div>
                                                    <div className={`text-xs font-semibold transition-colors ${
                                                        active ? 'text-sector-600' : past ? 'text-pitlane-60' : 'text-alloy group-hover:text-pitlane'
                                                    }`}>{s.label}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Stage description */}
                                <div key={activeStage} className="animate-stageFade">
                                    <div className="font-mono text-xs text-alloy mb-3 tracking-wider">
                                        {activeStage === 0 ? 'BASELINE' : `STAGE ${activeStage}`} — {STAGES[activeStage].label.toUpperCase()}
                                    </div>
                                    <p className="t-h2 text-pitlane mb-2 leading-snug max-w-xl">{STAGES[activeStage].desc}</p>
                                    <p className="text-sm text-pitlane-60 leading-relaxed mb-6 max-w-xl">{STAGES[activeStage].detail}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {STAGES[activeStage].tags.map(tag => (
                                            <a
                                                key={tag}
                                                href={`/search?q=${encodeURIComponent(tag)}`}
                                                className="text-sm text-pitlane-60 bg-cloud border border-asphalt-dark px-3 py-1.5 rounded-lg hover:border-sector-400 hover:text-sector-700 hover:bg-sector-50 transition-all"
                                            >
                                                {tag}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── Right: Advisor widget ── */}
                            <div className="bg-asphalt rounded-2xl p-6 space-y-5 lg:sticky lg:top-6">
                                <div>
                                    <div className="text-xs font-bold text-pitlane uppercase tracking-wider mb-0.5">Your build advisor</div>
                                    <p className="text-xs text-pitlane-60 leading-relaxed">
                                        {activeStage < 4
                                            ? <>You're at <strong>{STAGES[activeStage].label}</strong>. Add your vehicle and we'll find your <strong>Stage {activeStage + 1}</strong> upgrade list.</>
                                            : <>You're at the top — Stage 4. Browse specialist components below.</>
                                        }
                                    </p>
                                </div>

                                {/* Vehicle selectors */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-alloy uppercase tracking-wider">Vehicle (optional)</label>
                                    <select
                                        className="w-full bg-white border border-asphalt-dark rounded-lg px-3 py-2 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-400"
                                        value={makeId} onChange={onMakeChange}
                                    >
                                        <option value="">Any make</option>
                                        {makes?.map(m => <option key={m.id_make} value={m.id_make}>{m.make}</option>)}
                                    </select>
                                    <select
                                        className="w-full bg-white border border-asphalt-dark rounded-lg px-3 py-2 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-400 disabled:opacity-40"
                                        value={year} onChange={onYearChange} disabled={!makeId}
                                    >
                                        <option value="">Year</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <select
                                        className="w-full bg-white border border-asphalt-dark rounded-lg px-3 py-2 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-400 disabled:opacity-40"
                                        value={modelId} onChange={e => setModelId(e.target.value)} disabled={!year}
                                    >
                                        <option value="">Model</option>
                                        {models.map(m => <option key={m.id_vehicle_filter} value={m.id_vehicle_filter}>{m.model}</option>)}
                                    </select>
                                </div>

                                {activeStage < 4 && (
                                    <a
                                        href={`/advisor?stage=${activeStage}${modelId ? `&vehicle_filter_id=${modelId}` : ''}`}
                                        className="flex items-center justify-center gap-2 w-full bg-sector-600 hover:bg-sector-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                                    >
                                        Show Stage {activeStage + 1} parts
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </a>
                                )}
                                {activeStage === 4 && (
                                    <a href="/browse" className="flex items-center justify-center gap-2 w-full bg-sector-600 hover:bg-sector-700 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                                        Browse full catalogue →
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Top Trending Products ─────────────────────────────────────── */}
            {trending.length > 0 && (
                <section ref={trendRef} className="bg-white border-b border-asphalt py-14">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className={`flex items-end justify-between mb-8 transition-all duration-700 ${trendInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div>
                                <h2 className="t-h1 text-pitlane">Top trending</h2>
                                <p className="text-sm text-pitlane-60 mt-1">What SA builders are buying right now.</p>
                            </div>
                            <a href="/browse" className="text-sm font-semibold text-sector-600 hover:text-sector-700">View all →</a>
                        </div>
                        <div
                            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-700 ${trendInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: '100ms' }}
                        >
                            {trending.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Categories — 5 × 2 grid ───────────────────────────────────── */}
            <section ref={catRef} className="bg-white py-14 border-b border-asphalt">
                <div className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${catInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex items-end justify-between pb-5 border-b border-asphalt mb-0">
                        <h2 className="t-h1 text-pitlane">Browse by category</h2>
                        <a href="/browse" className="text-sm text-pitlane-60 hover:text-sector-700 font-medium underline underline-offset-2">
                            View all {(stats?.total_products ?? 0).toLocaleString()} parts
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-asphalt sm:divide-y-0">
                        {topCategories.map((cat, i) => (
                            <a
                                key={cat.category}
                                href={`/category/${encodeURIComponent(cat.category)}`}
                                className={[
                                    'group flex items-center gap-5 py-5 hover:pl-2 transition-all duration-700',
                                    'border-b border-asphalt',
                                    // right column: add left border on sm+
                                    i % 2 === 1 ? 'sm:pl-8 sm:border-l' : 'sm:pr-8',
                                    catInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4',
                                ].join(' ')}
                                style={{ transitionDelay: catInView ? `${i * 50}ms` : '0ms' }}
                            >
                                <div className="text-alloy group-hover:text-sector-600 transition-colors shrink-0">
                                    <CategoryIcon name={cat.category} className="w-7 h-7" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="t-h3 text-pitlane group-hover:text-sector-700 transition-colors leading-snug">{cat.category}</div>
                                    <div className="t-label text-alloy mt-0.5">{Number(cat.count).toLocaleString()} parts</div>
                                </div>
                                <svg className="w-4 h-4 text-alloy group-hover:text-sector-600 group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Popular Products with tabs ────────────────────────────────── */}
            {popular.length > 0 && (
                <section ref={popularRef} className="bg-cloud border-b border-asphalt py-14">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className={`mb-6 transition-all duration-700 ${popularInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h2 className="t-h1 text-pitlane">Popular products</h2>
                        </div>
                        {/* Tabs */}
                        <div
                            className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 ${popularInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: '60ms' }}
                        >
                            {popularTabs.map((tab, i) => (
                                <button
                                    key={tab}
                                    onClick={() => setPopularTab(i)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                        popularTab === i
                                            ? 'bg-sector-600 text-white'
                                            : 'bg-white border border-asphalt text-pitlane-60 hover:border-sector-400 hover:text-sector-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div
                            key={popularTab}
                            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-stageFade transition-all duration-700 ${popularInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: '120ms' }}
                        >
                            {popularProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Why PPSA ─────────────────────────────────────────────────── */}
            <section ref={whyRef} className="border-t border-asphalt bg-grid py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`mb-12 transition-all duration-700 ${whyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="t-h1 text-pitlane">US-spec performance.<br />SA-delivered price.</h2>
                    </div>
                    <div className={`pb-8 mb-8 border-b border-asphalt transition-all duration-700 ${whyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                         style={{ transitionDelay: whyInView ? '80ms' : '0ms' }}>
                        <div className="t-h2 text-pitlane mb-3">Stage-guided builds</div>
                        <p className="text-base text-pitlane-60 max-w-2xl leading-relaxed">
                            Most catalogues show everything. We show what's right for where your build is <em>now</em>.{' '}
                            Save your vehicle in your garage, set your stage, and the catalogue filters itself —{' '}
                            stock parts, bolt-on upgrades, or full build components, depending on where you are.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            {
                                heading: 'Full landed price',
                                body: 'Exchange rate, customs duty, freight and VAT already built into every price. What you see is what you pay — in rands, no surprises at checkout.',
                            },
                            {
                                heading: 'Vehicle-matched fitment',
                                body: 'Parts are mapped to your specific Make, Year and Model. Search your vehicle and see only parts confirmed to fit — not a generic catalogue dump.',
                            },
                            {
                                heading: 'Live stock visibility',
                                body: 'Every product shows real-time stock across our SA warehouse, USA warehouse and direct from the manufacturer. No guessing on lead times.',
                            },
                        ].map(({ heading, body }, i) => (
                            <div
                                key={heading}
                                className={`transition-all duration-700 ${whyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: whyInView ? `${(i + 2) * 80}ms` : '0ms' }}
                            >
                                <div className="t-h3 text-pitlane mb-2">{heading}</div>
                                <p className="text-sm text-pitlane-60 leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ─────────────────────────────────────────────── */}
            {testimonials.length > 0 && (
                <section ref={testiRef} className="bg-white border-t border-b border-asphalt py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className={`mb-12 text-center transition-all duration-700 ${testiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h2 className="t-h1 text-pitlane">What builders say</h2>
                            <p className="text-sm text-pitlane-60 mt-2">Real customers. Real builds.</p>
                        </div>
                        <div className={`transition-all duration-700 ${testiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
                            <TestimonialCarousel testimonials={testimonials} />
                        </div>
                    </div>
                </section>
            )}

            {/* ── Newsletter / Special Offers ───────────────────────────────── */}
            <section ref={newsRef} className="py-16" style={{ background: 'linear-gradient(135deg, #0d1f35 0%, #1a3a5c 100%)' }}>
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className={`transition-all duration-700 ${newsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-flex items-center gap-2 bg-sector-600/20 text-sector-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                            Special Offers &amp; News
                        </div>
                        <h2 className="t-h1 text-white mb-3">Get the best deals first</h2>
                        <p className="text-white/60 text-base mb-8 max-w-lg mx-auto leading-relaxed">
                            New arrivals, exclusive discounts, and build guides — straight to your inbox. No spam, just parts.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>
            </section>

            {/* ── Popular Articles ──────────────────────────────────────────── */}
            {articles.length > 0 && (
                <section ref={articlesRef} className="bg-white border-t border-asphalt py-14">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className={`flex items-end justify-between mb-8 transition-all duration-700 ${articlesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div>
                                <h2 className="t-h1 text-pitlane">Build guides &amp; articles</h2>
                                <p className="text-sm text-pitlane-60 mt-1">Tips, tuning guides, and product breakdowns from the PPSA team.</p>
                            </div>
                            <a href="/articles" className="text-sm font-semibold text-sector-600 hover:text-sector-700">All articles →</a>
                        </div>
                        <div
                            className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${articlesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: '100ms' }}
                        >
                            {articles.map((article, i) => (
                                <a
                                    key={article.id}
                                    href={`/articles/${article.slug}`}
                                    className="group flex flex-col bg-white border border-asphalt rounded-xl overflow-hidden hover:border-sector-300 hover:shadow-md transition-all duration-200"
                                >
                                    {/* Cover */}
                                    <div className="aspect-[16/9] bg-cloud overflow-hidden">
                                        {article.cover_image ? (
                                            <img
                                                src={article.cover_image}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-grid flex items-center justify-center">
                                                <svg className="w-10 h-10 text-alloy-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div className="flex flex-col flex-1 p-4 gap-2">
                                        <div className="flex items-center gap-2">
                                            {article.category && (
                                                <span className="t-label text-sector-600 bg-sector-50 px-2 py-0.5 rounded">{article.category}</span>
                                            )}
                                            <span className="t-label text-alloy">{article.read_minutes} min read</span>
                                        </div>
                                        <h3 className="text-base font-bold text-pitlane leading-snug group-hover:text-sector-700 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        {article.excerpt && (
                                            <p className="text-sm text-pitlane-60 leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
                                        )}
                                        <div className="text-xs text-alloy mt-1">
                                            {article.published_at && new Date(article.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 28s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }

                @keyframes stageFade {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-stageFade {
                    animation: stageFade 0.28s ease-out forwards;
                }

                @keyframes testimonialFade {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-testimonialFade {
                    animation: testimonialFade 0.3s ease-out forwards;
                }
            `}</style>

        </MainLayout>
    );
}
