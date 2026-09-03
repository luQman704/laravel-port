import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';

function FloatField({ id, label, type = 'text', value, onChange, error, autoComplete }) {
    const [focused, setFocused] = useState(false);
    const lifted = focused || value;
    return (
        <div className="relative">
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete={autoComplete}
                className={`w-full bg-transparent border-b-2 px-0 pt-5 pb-2 text-pitlane text-sm outline-none transition-all
                    ${error ? 'border-red-400' : focused ? 'border-sector-500' : 'border-asphalt'}`}
            />
            <label
                htmlFor={id}
                className={`absolute left-0 pointer-events-none text-sm transition-all duration-150
                    ${lifted ? 'top-0 text-[10px] font-semibold tracking-wider uppercase' : 'top-4'}
                    ${error ? 'text-red-400' : focused ? 'text-sector-600' : 'text-alloy'}`}
            >
                {label}
            </label>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}

const STATS = [
    { value: '716k+', label: 'Performance parts' },
    { value: '426',   label: 'Brands stocked' },
    { value: '5',     label: 'Build stages' },
];

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPw, setShowPw] = useState(false);

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen flex">

            {/* ── Left panel ────────────────────────────────────────────── */}
            <div
                className="hidden lg:flex flex-col justify-between w-[46%] shrink-0 p-12 relative overflow-hidden"
                style={{ background: '#0E1A10' }}
            >
                {/* Faint car trace */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.07]" aria-hidden>
                    <img src="/images/car-trace.webp" alt="" className="absolute bottom-0 right-0 w-full h-auto object-contain object-right-bottom" draggable={false} />
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-sector-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-black tracking-tight">PP</span>
                    </div>
                    <div>
                        <div className="text-white font-black text-base tracking-tight leading-tight">Performance Products</div>
                        <div className="text-sector-400 text-xs uppercase tracking-widest font-semibold">South Africa</div>
                    </div>
                </Link>

                {/* Body copy */}
                <div className="relative z-10">
                    <h2 className="text-white font-black text-4xl leading-tight mb-4">
                        Built for drivers.<br/>
                        <span className="text-sector-400">Stage by stage.</span>
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs">
                        SA's largest performance parts catalogue, matched to your build stage — from stock daily to full race spec.
                    </p>

                    {/* Stats row */}
                    <div className="flex gap-8">
                        {STATS.map(({ value, label }) => (
                            <div key={label}>
                                <div className="text-sector-400 font-black text-2xl leading-none">{value}</div>
                                <div className="text-gray-500 text-xs mt-1 leading-tight">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom quote */}
                <p className="text-gray-600 text-xs relative z-10">
                    "The right part for the right stage, every time."
                </p>
            </div>

            {/* ── Right panel (form) ────────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white relative">

                {/* Mobile logo */}
                <Link href="/" className="flex items-center gap-3 mb-12 lg:hidden">
                    <div className="w-9 h-9 rounded-lg bg-sector-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm">PP</span>
                    </div>
                    <div className="font-black text-pitlane text-base">Performance Products SA</div>
                </Link>

                <div className="max-w-sm w-full">
                    <h1 className="text-2xl font-black text-pitlane mb-1">Welcome back</h1>
                    <p className="text-sm text-alloy mb-8">Sign in to your account to continue</p>

                    {status && (
                        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-8">
                        <FloatField
                            id="email"
                            label="Email address"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            error={errors.email}
                            autoComplete="email"
                        />

                        <div className="relative">
                            <FloatField
                                id="password"
                                label="Password"
                                type={showPw ? 'text' : 'password'}
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                error={errors.password}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(v => !v)}
                                tabIndex={-1}
                                className="absolute right-0 top-4 text-alloy hover:text-pitlane transition-colors"
                            >
                                {showPw ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between -mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-asphalt text-sector-500 focus:ring-sector-400"
                                />
                                <span className="text-xs text-alloy">Remember me</span>
                            </label>
                            <a href="/forgot-password" className="text-xs text-sector-600 hover:text-sector-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-sector-600 hover:bg-sector-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                        >
                            {processing ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-asphalt text-center">
                        <p className="text-sm text-alloy">
                            New to Performance Products?{' '}
                            <Link href="/register" className="text-sector-600 font-bold hover:text-sector-700">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
