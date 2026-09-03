import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

function FloatField({ id, label, type = 'text', value, onChange, error, autoComplete, required }) {
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
                required={required}
                className={`peer w-full bg-transparent border rounded-xl px-4 pt-5 pb-2 text-pitlane text-sm outline-none transition-all
                    ${error
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-asphalt focus:border-sector-500'
                    }`}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 pointer-events-none text-sm transition-all duration-150
                    ${lifted
                        ? 'top-1.5 text-[10px] font-semibold tracking-wider uppercase'
                        : 'top-3.5 text-sm'
                    }
                    ${error ? 'text-red-400' : focused ? 'text-sector-600' : 'text-alloy'}`}
            >
                {label}
            </label>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function SelectField({ id, label, value, onChange, children, error }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`peer w-full bg-white border rounded-xl px-4 pt-5 pb-2 text-pitlane text-sm outline-none appearance-none transition-all
                    ${error ? 'border-red-400' : 'border-asphalt focus:border-sector-500'}`}
            >
                {children}
            </select>
            <label
                htmlFor={id}
                className={`absolute left-4 pointer-events-none text-[10px] font-semibold tracking-wider uppercase top-1.5 transition-colors
                    ${error ? 'text-red-400' : focused ? 'text-sector-600' : 'text-alloy'}`}
            >
                {label}
            </label>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-alloy">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                </svg>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function Toggle({ checked, onChange, label, description }) {
    return (
        <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-sector-500' : 'bg-asphalt'}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <div>
                <div className="text-sm font-semibold text-pitlane">{label}</div>
                {description && <div className="text-xs text-alloy mt-0.5">{description}</div>}
            </div>
        </label>
    );
}

function SectionCard({ title, subtitle, children }) {
    return (
        <div className="bg-white border border-asphalt rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-asphalt">
                <h2 className="font-bold text-pitlane text-base">{title}</h2>
                {subtitle && <p className="text-xs text-alloy mt-0.5">{subtitle}</p>}
            </div>
            <div className="px-6 py-6">{children}</div>
        </div>
    );
}

function Alert({ type, message, onClose }) {
    if (!message) return null;
    const styles = type === 'success'
        ? 'bg-green-50 border-green-200 text-green-800'
        : 'bg-red-50 border-red-200 text-red-800';
    return (
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm ${styles}`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 opacity-60 hover:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    );
}

export default function Profile({ user, errors: serverErrors = {} }) {
    const [profileData, setProfileData] = useState({
        title: user.title ?? '',
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        birthdate: user.birthdate ?? '',
        newsletter_subscribed: !!user.newsletter_subscribed,
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [profileAlert, setProfileAlert] = useState(null);
    const [passwordAlert, setPasswordAlert] = useState(null);
    const [profileErrors, setProfileErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    function setProfile(key, val) {
        setProfileData(d => ({ ...d, [key]: val }));
    }
    function setPassword(key, val) {
        setPasswordData(d => ({ ...d, [key]: val }));
    }

    function submitProfile(e) {
        e.preventDefault();
        setSaving(true);
        setProfileAlert(null);
        setProfileErrors({});
        router.put('/account/profile', profileData, {
            preserveScroll: true,
            onSuccess: () => {
                setProfileAlert({ type: 'success', message: 'Profile updated successfully.' });
                setSaving(false);
            },
            onError: (errs) => {
                setProfileErrors(errs);
                setSaving(false);
            },
        });
    }

    function submitPassword(e) {
        e.preventDefault();
        setSavingPw(true);
        setPasswordAlert(null);
        setPasswordErrors({});
        router.put('/account/profile/password', passwordData, {
            preserveScroll: true,
            onSuccess: () => {
                setPasswordAlert({ type: 'success', message: 'Password changed successfully.' });
                setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
                setSavingPw(false);
            },
            onError: (errs) => {
                setPasswordErrors(errs);
                setSavingPw(false);
            },
        });
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <a href="/account" className="hover:text-sector-600">Your Account</a>
                    <span>/</span>
                    <span className="text-pitlane">Personal Information</span>
                </nav>

                <h1 className="t-h1 text-pitlane mb-8">Personal Information</h1>

                <div className="space-y-6">

                    {/* Profile Section */}
                    <SectionCard title="Your Details" subtitle="Name, contact details and preferences">
                        <form onSubmit={submitProfile} className="space-y-5">

                            <Alert
                                type={profileAlert?.type}
                                message={profileAlert?.message}
                                onClose={() => setProfileAlert(null)}
                            />

                            {/* Title */}
                            <div>
                                <div className="text-[10px] font-semibold text-alloy uppercase tracking-wider mb-2">Title</div>
                                <div className="flex gap-3">
                                    {['Mr.', 'Mrs.', 'Ms.', 'Dr.'].map(t => (
                                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${profileData.title === t ? 'border-sector-500' : 'border-asphalt'}`}
                                                onClick={() => setProfile('title', t)}
                                            >
                                                {profileData.title === t && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-sector-500" />
                                                )}
                                            </div>
                                            <span className="text-sm text-pitlane select-none" onClick={() => setProfile('title', t)}>{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Name row */}
                            <div className="grid grid-cols-2 gap-4">
                                <FloatField
                                    id="first_name"
                                    label="First Name"
                                    value={profileData.first_name}
                                    onChange={e => setProfile('first_name', e.target.value)}
                                    error={profileErrors.first_name}
                                    autoComplete="given-name"
                                    required
                                />
                                <FloatField
                                    id="last_name"
                                    label="Last Name"
                                    value={profileData.last_name}
                                    onChange={e => setProfile('last_name', e.target.value)}
                                    error={profileErrors.last_name}
                                    autoComplete="family-name"
                                    required
                                />
                            </div>

                            <FloatField
                                id="email"
                                label="Email Address"
                                type="email"
                                value={profileData.email}
                                onChange={e => setProfile('email', e.target.value)}
                                error={profileErrors.email}
                                autoComplete="email"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FloatField
                                    id="phone"
                                    label="Phone Number"
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={e => setProfile('phone', e.target.value)}
                                    error={profileErrors.phone}
                                    autoComplete="tel"
                                />
                                <FloatField
                                    id="birthdate"
                                    label="Date of Birth"
                                    type="date"
                                    value={profileData.birthdate}
                                    onChange={e => setProfile('birthdate', e.target.value)}
                                    error={profileErrors.birthdate}
                                />
                            </div>

                            {/* Newsletter toggle */}
                            <div className="pt-1">
                                <Toggle
                                    checked={profileData.newsletter_subscribed}
                                    onChange={e => setProfile('newsletter_subscribed', e.target.checked)}
                                    label="Newsletter Subscription"
                                    description="Receive exclusive deals, product launches and motorsport news"
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn btn-primary px-7 py-2.5 text-sm font-semibold disabled:opacity-50"
                                >
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </SectionCard>

                    {/* Password Section */}
                    <SectionCard title="Change Password" subtitle="Leave blank if you don't want to change your password">
                        <form onSubmit={submitPassword} className="space-y-5">

                            <Alert
                                type={passwordAlert?.type}
                                message={passwordAlert?.message}
                                onClose={() => setPasswordAlert(null)}
                            />

                            {/* Current password */}
                            <div className="relative">
                                <FloatField
                                    id="current_password"
                                    label="Current Password"
                                    type={showCurrent ? 'text' : 'password'}
                                    value={passwordData.current_password}
                                    onChange={e => setPassword('current_password', e.target.value)}
                                    error={passwordErrors.current_password}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(v => !v)}
                                    className="absolute right-3 top-3.5 text-alloy hover:text-pitlane transition-colors"
                                >
                                    {showCurrent ? (
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

                            {/* New password */}
                            <div className="relative">
                                <FloatField
                                    id="new_password"
                                    label="New Password"
                                    type={showNew ? 'text' : 'password'}
                                    value={passwordData.new_password}
                                    onChange={e => setPassword('new_password', e.target.value)}
                                    error={passwordErrors.new_password}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(v => !v)}
                                    className="absolute right-3 top-3.5 text-alloy hover:text-pitlane transition-colors"
                                >
                                    {showNew ? (
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

                            <FloatField
                                id="new_password_confirmation"
                                label="Confirm New Password"
                                type="password"
                                value={passwordData.new_password_confirmation}
                                onChange={e => setPassword('new_password_confirmation', e.target.value)}
                                error={passwordErrors.new_password_confirmation}
                                autoComplete="new-password"
                            />

                            {/* Password strength hint */}
                            {passwordData.new_password && (
                                <div className="space-y-1.5">
                                    <div className="flex gap-1">
                                        {[8, 12, 16].map((len, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors ${
                                                    passwordData.new_password.length >= len
                                                        ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-yellow-400' : 'bg-green-500'
                                                        : 'bg-asphalt'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-alloy">
                                        {passwordData.new_password.length < 8 ? 'Too short' :
                                         passwordData.new_password.length < 12 ? 'Weak — try a longer password' :
                                         passwordData.new_password.length < 16 ? 'Good' : 'Strong'}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={savingPw || !passwordData.current_password || !passwordData.new_password}
                                    className="btn btn-primary px-7 py-2.5 text-sm font-semibold disabled:opacity-50"
                                >
                                    {savingPw ? 'Updating…' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </SectionCard>

                    {/* Danger Zone */}
                    <SectionCard title="Privacy & Data">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold text-pitlane">Download My Data</div>
                                <div className="text-xs text-alloy mt-0.5">Export all personal data we hold about you (POPIA)</div>
                            </div>
                            <a href="/account/privacy" className="text-sm text-sector-600 hover:underline font-medium">Manage →</a>
                        </div>
                    </SectionCard>

                </div>
            </div>
        </MainLayout>
    );
}
