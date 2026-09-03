import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';

function FloatField({ id, label, type = 'text', value, onChange, error, autoComplete, className = '' }) {
    const [focused, setFocused] = useState(false);
    const lifted = focused || value;
    return (
        <div className={`relative ${className}`}>
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

function StepDot({ n, current }) {
    const done    = current > n;
    const active  = current === n;
    return (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
            ${done ? 'bg-sector-600 text-white' : active ? 'bg-sector-100 text-sector-700 ring-2 ring-sector-500' : 'bg-asphalt text-alloy'}`}>
            {done ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
            ) : n}
        </div>
    );
}

const STEP_LABELS = ['Account', 'About you', 'Password'];

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        birthdate: '',
        password: '',
        password_confirmation: '',
        newsletter_subscribed: false,
    });

    const [step, setStep] = useState(1);
    const [showPw, setShowPw] = useState(false);
    const [showPwC, setShowPwC] = useState(false);

    function next(e) {
        e.preventDefault();
        setStep(s => s + 1);
    }
    function back() { setStep(s => s - 1); }

    function submit(e) {
        e.preventDefault();
        post('/register');
    }

    return (
        <div className="min-h-screen flex">

            {/* ── Left panel ────────────────────────────────────────────── */}
            <div
                className="hidden lg:flex flex-col justify-between w-[46%] shrink-0 p-12 relative overflow-hidden"
                style={{ background: '#0E1A10' }}
            >
                <div className="absolute inset-0 pointer-events-none opacity-[0.07]" aria-hidden>
                    <img src="/images/car-trace.webp" alt="" className="absolute bottom-0 right-0 w-full h-auto object-contain object-right-bottom" draggable={false} />
                </div>

                <Link href="/" className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-sector-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-black tracking-tight">PP</span>
                    </div>
                    <div>
                        <div className="text-white font-black text-base tracking-tight leading-tight">Performance Products</div>
                        <div className="text-sector-400 text-xs uppercase tracking-widest font-semibold">South Africa</div>
                    </div>
                </Link>

                <div className="relative z-10">
                    <h2 className="text-white font-black text-4xl leading-tight mb-4">
                        Join the build.<br/>
                        <span className="text-sector-400">Find your stage.</span>
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs">
                        Create an account to save your vehicles, track orders, set up stock alerts and get matched parts for your build stage.
                    </p>

                    {/* Benefits */}
                    <ul className="space-y-3">
                        {[
                            'Parts matched to your exact vehicle',
                            'Stage-by-stage upgrade path',
                            'Back-in-stock alerts',
                            'Order tracking & history',
                        ].map(b => (
                            <li key={b} className="flex items-start gap-3">
                                <div className="w-4 h-4 rounded-full bg-sector-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                    </svg>
                                </div>
                                <span className="text-gray-400 text-sm">{b}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-gray-600 text-xs relative z-10">
                    Free to join. No spam. Unsubscribe anytime.
                </p>
            </div>

            {/* ── Right panel ───────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white relative">

                {/* Mobile logo */}
                <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
                    <div className="w-9 h-9 rounded-lg bg-sector-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm">PP</span>
                    </div>
                    <div className="font-black text-pitlane text-base">Performance Products SA</div>
                </Link>

                <div className="max-w-sm w-full">

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-8">
                        {STEP_LABELS.map((label, i) => {
                            const n = i + 1;
                            return (
                                <div key={n} className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <StepDot n={n} current={step} />
                                        <span className={`text-xs font-semibold ${step === n ? 'text-pitlane' : 'text-alloy'}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {i < STEP_LABELS.length - 1 && (
                                        <div className={`h-px flex-1 w-6 ${step > n ? 'bg-sector-500' : 'bg-asphalt'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Step 1: Account ── */}
                    {step === 1 && (
                        <form onSubmit={next} className="space-y-8">
                            <div>
                                <h1 className="text-2xl font-black text-pitlane mb-1">Create your account</h1>
                                <p className="text-sm text-alloy">Start with your email address</p>
                            </div>

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
                                    autoComplete="new-password"
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                                    className="absolute right-0 top-4 text-alloy hover:text-pitlane transition-colors">
                                    {showPw
                                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    }
                                </button>
                            </div>

                            <div className="relative">
                                <FloatField
                                    id="password_confirmation"
                                    label="Confirm password"
                                    type={showPwC ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                    autoComplete="new-password"
                                />
                                <button type="button" onClick={() => setShowPwC(v => !v)} tabIndex={-1}
                                    className="absolute right-0 top-4 text-alloy hover:text-pitlane transition-colors">
                                    {showPwC
                                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    }
                                </button>
                            </div>

                            {/* Password strength */}
                            {data.password && (
                                <div className="-mt-4 space-y-1">
                                    <div className="flex gap-1">
                                        {[8, 12, 16].map((len, i) => (
                                            <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${
                                                data.password.length >= len
                                                    ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-yellow-400' : 'bg-green-500'
                                                    : 'bg-asphalt'
                                            }`} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-alloy">
                                        {data.password.length < 8 ? 'Too short' : data.password.length < 12 ? 'Weak' : data.password.length < 16 ? 'Good' : 'Strong'}
                                    </p>
                                </div>
                            )}

                            <button type="submit"
                                disabled={!data.email || !data.password || data.password.length < 8}
                                className="w-full bg-sector-600 hover:bg-sector-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                                Continue
                            </button>
                        </form>
                    )}

                    {/* ── Step 2: About you ── */}
                    {step === 2 && (
                        <form onSubmit={next} className="space-y-8">
                            <div>
                                <h1 className="text-2xl font-black text-pitlane mb-1">About you</h1>
                                <p className="text-sm text-alloy">Help us personalise your experience</p>
                            </div>

                            {/* Title */}
                            <div>
                                <div className="text-[10px] font-semibold text-alloy uppercase tracking-wider mb-3">Title</div>
                                <div className="flex gap-4">
                                    {['Mr.', 'Mrs.', 'Ms.', 'Dr.'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setData('title', t)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                                data.title === t
                                                    ? 'border-sector-500 bg-sector-50 text-sector-700'
                                                    : 'border-asphalt text-alloy hover:border-pitlane-60 hover:text-pitlane'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                                <FloatField
                                    id="first_name"
                                    label="First name"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                    error={errors.first_name}
                                    autoComplete="given-name"
                                />
                                <FloatField
                                    id="last_name"
                                    label="Last name"
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                    error={errors.last_name}
                                    autoComplete="family-name"
                                />
                            </div>

                            <FloatField
                                id="phone"
                                label="Phone number (optional)"
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                error={errors.phone}
                                autoComplete="tel"
                            />

                            <FloatField
                                id="birthdate"
                                label="Date of birth (optional)"
                                type="date"
                                value={data.birthdate}
                                onChange={e => setData('birthdate', e.target.value)}
                                error={errors.birthdate}
                            />

                            <div className="flex gap-3">
                                <button type="button" onClick={back}
                                    className="flex-none px-5 py-3.5 border border-asphalt rounded-xl text-sm font-semibold text-pitlane hover:bg-asphalt transition-colors">
                                    Back
                                </button>
                                <button type="submit"
                                    disabled={!data.first_name || !data.last_name}
                                    className="flex-1 bg-sector-600 hover:bg-sector-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                                    Continue
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 3: Password + submit ── */}
                    {step === 3 && (
                        <form onSubmit={submit} className="space-y-8">
                            <div>
                                <h1 className="text-2xl font-black text-pitlane mb-1">Almost done</h1>
                                <p className="text-sm text-alloy">Just a couple more preferences</p>
                            </div>

                            {/* Newsletter */}
                            <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl border border-asphalt hover:border-sector-300 transition-colors">
                                <div className="relative mt-0.5 flex-shrink-0">
                                    <input type="checkbox" className="sr-only"
                                        checked={data.newsletter_subscribed}
                                        onChange={e => setData('newsletter_subscribed', e.target.checked)} />
                                    <div className={`w-10 h-5 rounded-full transition-colors ${data.newsletter_subscribed ? 'bg-sector-500' : 'bg-asphalt'}`} />
                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${data.newsletter_subscribed ? 'translate-x-5' : ''}`} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-pitlane">Newsletter</div>
                                    <div className="text-xs text-alloy mt-0.5">Exclusive deals, new arrivals and motorsport news</div>
                                </div>
                            </label>

                            {/* Summary card */}
                            <div className="bg-asphalt rounded-xl p-4 space-y-1.5">
                                <div className="text-[10px] font-semibold text-alloy uppercase tracking-wider mb-2">Account summary</div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-alloy">Name</span>
                                    <span className="text-pitlane font-medium">{[data.title, data.first_name, data.last_name].filter(Boolean).join(' ') || '—'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-alloy">Email</span>
                                    <span className="text-pitlane font-medium truncate max-w-[180px]">{data.email}</span>
                                </div>
                                {data.phone && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-alloy">Phone</span>
                                        <span className="text-pitlane font-medium">{data.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={back}
                                    className="flex-none px-5 py-3.5 border border-asphalt rounded-xl text-sm font-semibold text-pitlane hover:bg-asphalt transition-colors">
                                    Back
                                </button>
                                <button type="submit" disabled={processing}
                                    className="flex-1 bg-sector-600 hover:bg-sector-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                                    {processing ? 'Creating account…' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 pt-8 border-t border-asphalt text-center">
                        <p className="text-sm text-alloy">
                            Already have an account?{' '}
                            <Link href="/login" className="text-sector-600 font-bold hover:text-sector-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
