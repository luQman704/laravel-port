import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';

import SearchOverlay from '@/Components/SearchOverlay';
import CartDropdown from '@/Components/CartDropdown';
import CompareBar from '@/Components/CompareBar';
import { CompareProvider } from '@/contexts/CompareContext';

function getGreeting(name) {
    const hour = new Date().getHours();
    const first = name.split(' ')[0];
    const greetings = {
        night:     ['Still up',   'Burning midnight oil', 'Night owl'],
        morning:   ['Good morning', 'Rise and shine', 'Morning'],
        midday:    ['Good afternoon', 'Hey there', 'Afternoon'],
        evening:   ['Good evening', 'Evening', 'Welcome back'],
    };
    let pool;
    if (hour >= 0  && hour < 5)  pool = greetings.night;
    else if (hour < 12)           pool = greetings.morning;
    else if (hour < 17)           pool = greetings.midday;
    else                          pool = greetings.evening;
    const phrase = pool[Math.floor(Date.now() / 60000) % pool.length]; // rotates per minute
    return `${phrase}, ${first}`;
}

function AccountMenu({ user }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        function handler(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const greeting = getGreeting(user.name);

    const menuItems = [
        { label: 'My Account',    href: '/account' },
        { label: 'Order History', href: '/account/orders' },
        { label: 'My Garage',     href: '/account/garage' },
        { label: 'My Wishlist',   href: '/wishlist' },
        { label: 'Stock Alerts',  href: '/account/alerts' },
    ];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 group"
            >
                <div className="text-right">
                    <div className="text-[10px] text-alloy leading-none uppercase tracking-wider">Your account</div>
                    <div className="text-sm font-semibold text-pitlane leading-tight group-hover:text-sector-600 transition-colors">
                        {greeting}
                    </div>
                </div>
                <svg className={`w-3.5 h-3.5 text-alloy transition-transform ml-0.5 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-asphalt rounded-xl shadow-xl z-50 overflow-hidden py-1">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-asphalt">
                        <div className="font-semibold text-pitlane text-sm truncate">{user.name}</div>
                        <div className="text-xs text-alloy truncate">{user.email}</div>
                    </div>

                    {/* Nav links */}
                    {menuItems.map(({ label, href }) => (
                        <a
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-pitlane-60 hover:bg-asphalt hover:text-pitlane transition-colors"
                        >
                            {label}
                        </a>
                    ))}

                    {/* Sign out */}
                    <div className="border-t border-asphalt mt-1">
                        <form method="POST" action="/logout">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content ?? ''} />
                            <button
                                type="submit"
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function Layout({ children }) {
    const page = usePage();
    const { auth, cart_count } = page.props;
    const isHome = page.component === 'Home';
    const user = auth?.user ?? null;
    const cartCount = cart_count ?? 0;

    const [searchOpen, setSearchOpen] = useState(false);
    const [cartOpen, setCartOpen]     = useState(false);
    const [cartBounce, setCartBounce] = useState(false);
    const [activeVehicle, setActiveVehicle] = useState(null);

    const cartIconRef = useRef(null); // ref on the cart button element

    useEffect(() => {
        try {
            const v = JSON.parse(localStorage.getItem('ppsa_active_vehicle') ?? 'null');
            setActiveVehicle(v);
        } catch {}
    }, []);

    const clearVehicle = useCallback(() => {
        try { localStorage.removeItem('ppsa_active_vehicle'); } catch {}
        setActiveVehicle(null);
    }, []);

    // ── Fly-to-cart animation ─────────────────────────────────────────────────
    useEffect(() => {
        function handleCartFly({ detail: { src, rect } }) {
            const cartEl = cartIconRef.current;
            if (!cartEl) return;

            const cartRect = cartEl.getBoundingClientRect();
            const size = 72; // px — size of the flying thumbnail clone

            const startX = rect.left + rect.width  / 2 - size / 2;
            const startY = rect.top  + rect.height / 2 - size / 2;
            const endX   = cartRect.left + cartRect.width  / 2 - size / 2;
            const endY   = cartRect.top  + cartRect.height / 2 - size / 2;

            // Build the flying element
            const flyEl = document.createElement('div');
            flyEl.setAttribute('aria-hidden', 'true');
            Object.assign(flyEl.style, {
                position:      'fixed',
                left:          `${startX}px`,
                top:           `${startY}px`,
                width:         `${size}px`,
                height:        `${size}px`,
                zIndex:        '9999',
                pointerEvents: 'none',
                borderRadius:  '10px',
                overflow:      'hidden',
                background:    '#E4E8E9',
                padding:       '6px',
                boxShadow:     '0 8px 24px rgba(0,0,0,0.18)',
                willChange:    'transform, opacity',
            });

            if (src) {
                const img = document.createElement('img');
                img.src = src;
                Object.assign(img.style, {
                    width: '100%', height: '100%',
                    objectFit: 'contain', display: 'block',
                });
                flyEl.appendChild(img);
            } else {
                flyEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#BCC8D8;font-size:1.75rem">▣</div>`;
            }

            document.body.appendChild(flyEl);

            // Double rAF to ensure the element is painted before we apply the transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const dx = endX - startX;
                    const dy = endY - startY;
                    Object.assign(flyEl.style, {
                        transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.45s ease 0.1s',
                        transform:  `translate(${dx}px, ${dy}px) scale(0.12)`,
                        opacity:    '0',
                    });
                });
            });

            // Clean up + bounce badge
            setTimeout(() => {
                flyEl.remove();
                setCartBounce(true);
                setTimeout(() => setCartBounce(false), 550);
            }, 580);
        }

        window.addEventListener('cart:fly', handleCartFly);
        return () => window.removeEventListener('cart:fly', handleCartFly);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white relative overflow-x-hidden">

            {/* ── Car trace background (all pages) ─────────────────────────── */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed right-0 top-0 h-full w-[55vw] z-0 select-none"
                style={{ mixBlendMode: 'multiply' }}
            >
                <img
                    src="/images/car-trace.webp"
                    alt=""
                    className="absolute bottom-0 right-0 w-full h-auto object-contain object-right-bottom"
                    style={{ opacity: 0.045 }}
                    draggable={false}
                />
            </div>

            {/* ── Main nav ─────────────────────────────────────────────────── */}
            <header className="bg-white sticky top-0 z-50 shadow-sm border-b-2 border-sector-600">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-lg bg-sector-600 flex items-center justify-center shrink-0">
                            <span className="text-white font-black text-sm tracking-tight">PP</span>
                        </div>
                        <div className="leading-none">
                            <div className="font-black text-pitlane text-base tracking-tight">Performance Products</div>
                            <div className="t-label text-sector-600">South Africa</div>
                        </div>
                    </Link>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                        <Link href="/browse"   className="px-3 py-1.5 rounded-lg text-alloy hover:text-pitlane hover:bg-asphalt transition-colors">Browse All</Link>
                        <Link href="/vehicles" className="px-3 py-1.5 rounded-lg text-alloy hover:text-pitlane hover:bg-asphalt transition-colors">Find by Vehicle</Link>
                        {activeVehicle && (
                            <span className="flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                                <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                                <button onClick={clearVehicle} className="ml-1 text-green-500 hover:text-green-700 leading-none" title="Clear vehicle">×</button>
                            </span>
                        )}
                        <Link href="/engines"  className="px-3 py-1.5 rounded-lg text-alloy hover:text-pitlane hover:bg-asphalt transition-colors">Find by Engine</Link>
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-4">

                        {/* Search */}
                        <button onClick={() => setSearchOpen(true)}
                            className="text-alloy hover:text-sector-600 transition-colors" title="Search">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>

                        {/* Wishlist */}
                        <Link href="/wishlist"
                            className="text-alloy hover:text-sector-600 transition-colors" title="My Wishlist">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </Link>

                        {/* Garage */}
                        <Link href="/account/garage"
                            className="text-alloy hover:text-sector-600 transition-colors" title="My Garage">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                        </Link>

                        {/* Cart — button + dropdown, all wrapped in data-cart-zone */}
                        <div className="relative" data-cart-zone="">
                            <button
                                ref={cartIconRef}
                                onClick={() => setCartOpen(o => !o)}
                                className="relative text-alloy hover:text-sector-600 transition-colors"
                                title="Cart"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                {cartCount > 0 && (
                                    <span
                                        className={`absolute -top-1.5 -right-1.5 bg-sector-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold ${cartBounce ? 'cart-badge-bounce' : ''}`}
                                    >
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </button>

                            {cartOpen && (
                                <CartDropdown onClose={() => setCartOpen(false)} />
                            )}
                        </div>

                        {/* Account */}
                        {user ? (
                            <AccountMenu user={user} />
                        ) : (
                            <Link href="/login" className="btn btn-primary px-4 py-2">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer style={{ background: '#1A2B1D', borderTop: '1px solid #243828' }} className="text-gray-400 mt-20">

                {/* ── Contact strip ─────────────────────────────────────────── */}
                <div style={{ background: '#243828', borderBottom: '1px solid #2e4a34' }}>
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6 justify-between">
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sector-600/20 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-sector-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h1l1 2 1-3 2 6 1-4 1 3h1m5 4a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-sector-400">Easy Returns</div>
                                    <div className="text-white text-sm font-semibold">+27 11 000 1234</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sector-600/20 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-sector-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-sector-400">Call Us</div>
                                    <div className="text-white text-sm font-semibold">+27 11 000 5678</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sector-600/20 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-sector-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-sector-400">Mon – Fri</div>
                                    <div className="text-white text-sm font-semibold">9:00 – 18:00</div>
                                </div>
                            </div>
                        </div>
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sector-600 hover:bg-sector-700 text-white text-sm font-semibold transition-colors shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            Find Us on Map
                        </a>
                    </div>
                </div>

                {/* ── Main footer columns ───────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-sector-600 flex items-center justify-center shrink-0">
                                <span className="text-white font-black text-xs">PP</span>
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm leading-none">Performance Products</div>
                                <div className="t-label text-sector-400">South Africa</div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">SA's performance build specialist. 716k+ parts, 426 brands, stage-matched to your vehicle.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Shop</h4>
                        <ul className="space-y-2">
                            <li><Link href="/browse"   className="text-gray-400 hover:text-sector-400 transition-colors">Browse All</Link></li>
                            <li><Link href="/vehicles" className="text-gray-400 hover:text-sector-400 transition-colors">Find by Vehicle</Link></li>
                            <li><Link href="/engines"  className="text-gray-400 hover:text-sector-400 transition-colors">Find by Engine</Link></li>
                            <li><Link href="/search"   className="text-gray-400 hover:text-sector-400 transition-colors">Search</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Account</h4>
                        <ul className="space-y-2">
                            <li><Link href="/account"        className="text-gray-400 hover:text-sector-400 transition-colors">My Account</Link></li>
                            <li><Link href="/account/garage" className="text-gray-400 hover:text-sector-400 transition-colors">My Garage</Link></li>
                            <li><Link href="/wishlist" className="text-gray-400 hover:text-sector-400 transition-colors">Wishlist</Link></li>
                            <li><Link href="/compare" className="text-gray-400 hover:text-sector-400 transition-colors">Compare</Link></li>
                            <li><Link href="/account/orders" className="text-gray-400 hover:text-sector-400 transition-colors">Order History</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Help</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-sector-400 transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-sector-400 transition-colors">Returns</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-sector-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-sector-400 transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                </div>

                {/* ── Bottom bar: copyright + payment icons ─────────────────── */}
                <div className="border-t border-gray-800 py-4">
                    <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} Performance Products SA. All rights reserved.
                        </p>
                        {/* Payment method icons */}
                        <div className="flex items-center gap-2">
                            {/* Visa */}
                            <div className="h-6 px-2 rounded bg-white flex items-center justify-center" title="Visa">
                                <svg viewBox="0 0 38 24" className="h-4 w-auto" aria-label="Visa">
                                    <rect width="38" height="24" rx="3" fill="white"/>
                                    <text x="5" y="17" fontFamily="Arial" fontWeight="800" fontSize="13" fill="#1A1F71">VISA</text>
                                </svg>
                            </div>
                            {/* Mastercard */}
                            <div className="h-6 px-1.5 rounded bg-white flex items-center justify-center" title="Mastercard">
                                <svg viewBox="0 0 38 24" className="h-4 w-auto" aria-label="Mastercard">
                                    <rect width="38" height="24" rx="3" fill="white"/>
                                    <circle cx="14" cy="12" r="7" fill="#EB001B"/>
                                    <circle cx="24" cy="12" r="7" fill="#F79E1B"/>
                                    <path d="M19 6.8a7 7 0 010 10.4A7 7 0 0119 6.8z" fill="#FF5F00"/>
                                </svg>
                            </div>
                            {/* PayFast */}
                            <div className="h-6 px-2 rounded bg-white flex items-center justify-center" title="PayFast">
                                <span className="text-[10px] font-black text-blue-700 tracking-tight leading-none">Pay<span className="text-orange-500">Fast</span></span>
                            </div>
                            {/* EFT */}
                            <div className="h-6 px-2 rounded bg-gray-700 flex items-center justify-center" title="EFT">
                                <span className="text-[10px] font-bold text-gray-300 tracking-wider">EFT</span>
                            </div>
                            {/* Yoco */}
                            <div className="h-6 px-2 rounded bg-white flex items-center justify-center" title="Yoco">
                                <span className="text-[10px] font-black text-[#2B59FF] tracking-tight leading-none">yoco</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
            <CompareBar />

            <style>{`
                @keyframes cartBadgeBounce {
                    0%   { transform: scale(1); }
                    35%  { transform: scale(1.65); }
                    65%  { transform: scale(0.85); }
                    85%  { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
                .cart-badge-bounce {
                    animation: cartBadgeBounce 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
                }
            `}</style>
        </div>
    );
}

export default function MainLayout({ children }) {
    return (
        <CompareProvider>
            <Layout>{children}</Layout>
        </CompareProvider>
    );
}
