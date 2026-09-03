import MainLayout from '@/Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { formatZAR } from '@/utils/format';

const PROVINCES = [
    'Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape',
    'Limpopo','Mpumalanga','North West','Free State','Northern Cape',
];

const GIFT_WRAP_COST = 100;

// ─── Floating label input ─────────────────────────────────────────────────────
function FloatField({ id, label, type = 'text', value, onChange, error, autoComplete, required, className = '' }) {
    const [focused, setFocused] = useState(false);
    const lifted = focused || value;
    return (
        <div className={`relative ${className}`}>
            <input
                id={id} type={type} value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete={autoComplete} required={required}
                className={`w-full bg-transparent border rounded-xl px-4 pt-5 pb-2 text-pitlane text-sm outline-none transition-all
                    ${error ? 'border-red-400 focus:border-red-500' : 'border-asphalt focus:border-sector-500'}`}
            />
            <label htmlFor={id}
                className={`absolute left-4 pointer-events-none text-sm transition-all duration-150
                    ${lifted ? 'top-1.5 text-[10px] font-semibold tracking-wider uppercase' : 'top-3.5'}
                    ${error ? 'text-red-400' : focused ? 'text-sector-600' : 'text-alloy'}`}>
                {label}
            </label>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function FloatSelect({ id, label, value, onChange, error, children }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="relative">
            <select id={id} value={value} onChange={onChange}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                className={`w-full bg-white border rounded-xl px-4 pt-5 pb-2 text-pitlane text-sm outline-none appearance-none transition-all
                    ${error ? 'border-red-400' : 'border-asphalt focus:border-sector-500'}`}>
                {children}
            </select>
            <label htmlFor={id}
                className={`absolute left-4 pointer-events-none text-[10px] font-semibold tracking-wider uppercase top-1.5 transition-colors
                    ${error ? 'text-red-400' : focused ? 'text-sector-600' : 'text-alloy'}`}>
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

function PasswordField({ id, label, value, onChange, error, autoComplete }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <FloatField id={id} label={label} type={show ? 'text' : 'password'}
                value={value} onChange={onChange} error={error} autoComplete={autoComplete} required />
            <button type="button" onClick={() => setShow(v => !v)} tabIndex={-1}
                className="absolute right-3 top-3.5 text-alloy hover:text-pitlane transition-colors">
                {show
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                }
            </button>
        </div>
    );
}

// ─── Section card ──────────────────────────────────────────────────────────────
function SectionCard({ step, title, subtitle, children, completed }) {
    return (
        <div className="bg-white border border-asphalt rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-asphalt flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0 ${completed ? 'bg-green-500' : 'bg-sector-600'}`}>
                    {completed
                        ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                        : step
                    }
                </div>
                <div>
                    <h2 className="font-bold text-pitlane text-sm">{title}</h2>
                    {subtitle && <p className="text-xs text-alloy">{subtitle}</p>}
                </div>
            </div>
            <div className="px-6 py-5">{children}</div>
        </div>
    );
}

// ─── Saved address display ──────────────────────────────────────────────────────
function SavedAddressCard({ address, onChange }) {
    const line1 = [address.address_line1, address.address_line2].filter(Boolean).join(', ');
    const line2 = [address.city, address.province, address.postal_code].filter(Boolean).join(', ');
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sector-50 flex items-center justify-center shrink-0 text-sector-600 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                </div>
                <div>
                    <div className="text-sm font-semibold text-pitlane">{address.first_name} {address.last_name}</div>
                    <div className="text-xs text-alloy leading-relaxed mt-0.5">{line1}<br/>{line2}<br/>South Africa</div>
                    {address.phone && <div className="text-xs text-alloy mt-0.5">{address.phone}</div>}
                </div>
            </div>
            <button type="button" onClick={onChange}
                className="text-xs font-semibold text-sector-600 hover:text-sector-700 shrink-0 mt-0.5">
                Change
            </button>
        </div>
    );
}

// ─── Address form ──────────────────────────────────────────────────────────────
function AddressForm({ data, setData, errors }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FloatField id="first_name" label="First Name" value={data.first_name}
                    onChange={e => setData('first_name', e.target.value)} error={errors.first_name} required />
                <FloatField id="last_name" label="Last Name" value={data.last_name}
                    onChange={e => setData('last_name', e.target.value)} error={errors.last_name} required />
            </div>
            <FloatField id="phone" label="Phone Number" type="tel" value={data.phone}
                onChange={e => setData('phone', e.target.value)} error={errors.phone} required />
            <FloatField id="address_line1" label="Street Address" value={data.address_line1}
                onChange={e => setData('address_line1', e.target.value)} error={errors.address_line1} required />
            <FloatField id="address_line2" label="Apartment / Unit (optional)" value={data.address_line2}
                onChange={e => setData('address_line2', e.target.value)} error={errors.address_line2} />
            <div className="grid grid-cols-2 gap-4">
                <FloatField id="city" label="City" value={data.city}
                    onChange={e => setData('city', e.target.value)} error={errors.city} required />
                <FloatField id="postal_code" label="Postal Code" value={data.postal_code}
                    onChange={e => setData('postal_code', e.target.value)} error={errors.postal_code} required />
            </div>
            <FloatSelect id="province" label="Province" value={data.province}
                onChange={e => setData('province', e.target.value)} error={errors.province}>
                <option value="">Select province…</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </FloatSelect>
        </div>
    );
}

// ─── Shipping option card ──────────────────────────────────────────────────────
function ShippingOption({ option, selected, onSelect }) {
    const isStatic = option.is_static;
    return (
        <label className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-all
            ${selected ? 'border-sector-500 bg-sector-50' : 'border-asphalt hover:border-sector-300'}`}>
            <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                    ${selected ? 'border-sector-500' : 'border-asphalt'}`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-sector-500" />}
                </div>
                <div>
                    <input type="radio" name="shipping_service" value={option.service_code}
                        checked={selected} onChange={() => onSelect(option.service_code)}
                        className="sr-only" />
                    <div className="text-sm font-semibold text-pitlane">{option.service_name}</div>
                    <div className="text-xs text-alloy">
                        {isStatic ? option.carrier : 'The Courier Guy'}
                    </div>
                    {option.description && (
                        <div className="text-xs text-alloy mt-0.5 max-w-xs">{option.description}</div>
                    )}
                </div>
            </div>
            <div className="text-right shrink-0">
                {option.price_incl === 0
                    ? <div className="text-sm font-bold text-green-600">Free</div>
                    : <>
                        <div className="text-sm font-bold text-pitlane">{formatZAR(option.price_incl)}</div>
                        <div className="text-[10px] text-alloy">incl. VAT</div>
                      </>
                }
            </div>
        </label>
    );
}

// ─── Order summary sidebar ──────────────────────────────────────────────────────
function OrderSummary({ contents, totals, selectedShipping, giftWrapped, processing }) {
    const shipping  = selectedShipping?.price_incl ?? 0;
    const giftWrap  = giftWrapped ? GIFT_WRAP_COST : 0;
    const grand     = (totals?.total_incl ?? 0) + shipping + giftWrap;

    return (
        <div className="bg-white border border-asphalt rounded-2xl overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-asphalt">
                <h2 className="font-bold text-pitlane text-sm">Order Summary</h2>
                <p className="text-xs text-alloy mt-0.5">{contents.length} item{contents.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-52 overflow-y-auto">
                {contents.map((row, i) => (
                    <div key={i} className="flex gap-3 items-start">
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-pitlane leading-snug line-clamp-2">
                                {row.item?.qty > 1 && <span className="text-alloy">{row.item.qty}× </span>}
                                {row.product?.product_name}
                            </div>
                            <div className="text-[10px] text-alloy font-mono mt-0.5">#{row.product?.part_number}</div>
                        </div>
                        <div className="text-xs font-semibold text-pitlane shrink-0">{formatZAR(row.line_total ?? 0)}</div>
                    </div>
                ))}
            </div>

            <div className="px-5 py-4 border-t border-asphalt space-y-2">
                <div className="flex justify-between text-xs text-alloy">
                    <span>Subtotal excl. VAT</span>
                    <span>{formatZAR(totals?.subtotal_excl ?? 0)}</span>
                </div>
                <div className="flex justify-between text-xs text-alloy">
                    <span>VAT (15%)</span>
                    <span>{formatZAR(totals?.vat_amount ?? 0)}</span>
                </div>
                <div className="flex justify-between text-xs text-alloy">
                    <span>Shipping</span>
                    <span>{selectedShipping
                        ? (shipping === 0 ? <span className="text-green-600 font-semibold">Free</span> : formatZAR(shipping))
                        : <span className="italic">Select above</span>
                    }</span>
                </div>
                {giftWrapped && (
                    <div className="flex justify-between text-xs text-alloy">
                        <span>Gift Wrapping</span>
                        <span>{formatZAR(GIFT_WRAP_COST)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm font-bold text-pitlane pt-2 border-t border-asphalt">
                    <span>Total</span>
                    <span className="text-sector-600">{formatZAR(grand)}</span>
                </div>
            </div>

            <div className="px-5 pb-5">
                <button type="submit" disabled={processing || !selectedShipping}
                    className="w-full bg-sector-600 hover:bg-sector-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    {processing ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Redirecting to payment…
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                            </svg>
                            {selectedShipping ? `Pay ${formatZAR(grand)} via Yoco` : 'Select shipping to continue'}
                        </>
                    )}
                </button>
                {selectedShipping && (
                    <p className="text-center text-[10px] text-alloy mt-2 flex items-center justify-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                        </svg>
                        Secured by Yoco · You'll be redirected to pay
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Checkout({ contents = [], totals, user, user_address, static_shipping_options = [], shipping_options = [], cart_weight_kg = 0 }) {
    const isLoggedIn = !!user;
    const hasAddress = !!user_address;

    const [useSavedAddress, setUseSavedAddress] = useState(isLoggedIn && hasAddress);

    // TCG live rates (separate from static options)
    const [tcgOptions,    setTcgOptions]    = useState(shipping_options ?? []);
    const [ratesLoading,  setRatesLoading]  = useState(false);
    const [ratesError,    setRatesError]    = useState(null);
    const [ratesFetched,  setRatesFetched]  = useState((shipping_options ?? []).length > 0);

    // Combined options: statics always first, then TCG live rates
    const liveOptions = [...static_shipping_options, ...tcgOptions];

    const { data, setData, post, processing, errors } = useForm({
        // Guest account
        email:                 '',
        password:              '',
        password_confirmation: '',
        // Address
        first_name:    user?.first_name ?? '',
        last_name:     user?.last_name  ?? '',
        phone:         user?.phone ?? '',
        address_line1: '',
        address_line2: '',
        city:          '',
        province:      '',
        postal_code:   '',
        // Flags
        use_saved_address: isLoggedIn && hasAddress,
        // Shipping
        shipping_service: '',
        // Extras
        order_notes:  '',
        gift_wrapped: false,
    });

    const selectedShipping = liveOptions.find(o => o.service_code === data.shipping_service) ?? null;

    // ─── Fetch live TCG rates ─────────────────────────────────────────────
    async function fetchRates(addressData) {
        if (!addressData.address_line1 || !addressData.city || !addressData.province || !addressData.postal_code) return;
        setRatesLoading(true);
        setRatesError(null);
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
            const res  = await fetch('/api/checkout/rates', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
                body:    JSON.stringify(addressData),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to fetch rates');
            setTcgOptions(json.options ?? []);
            setRatesFetched(true);
            // Clear courier selection if it was a TCG option
            if (data.shipping_service && !static_shipping_options.find(o => o.service_code === data.shipping_service)) {
                setData('shipping_service', '');
            }
        } catch (e) {
            setRatesError(e.message);
            setTcgOptions([]);
        } finally {
            setRatesLoading(false);
        }
    }

    // Auto-fetch rates on load when using a saved address and no pre-loaded options
    useEffect(() => {
        if (useSavedAddress && user_address && (shipping_options ?? []).length === 0) {
            fetchRates({
                address_line1: user_address.address_line1,
                address_line2: user_address.address_line2 ?? '',
                city:          user_address.city,
                province:      user_address.province,
                postal_code:   user_address.postal_code,
            });
        }
    }, []);

    function toggleSaved() {
        const next = !useSavedAddress;
        setUseSavedAddress(next);
        setData('use_saved_address', next);
        // Reset TCG rates when switching address mode; static options remain
        setTcgOptions([]);
        setRatesFetched(false);
        setRatesError(null);
        // Only clear shipping if it was a TCG option
        if (data.shipping_service && !static_shipping_options.find(o => o.service_code === data.shipping_service)) {
            setData('shipping_service', '');
        }
    }

    function submit(e) {
        e.preventDefault();
        post('/checkout/process');
    }

    const guestStep = isLoggedIn ? 0 : 1;

    // ─── Current address for rate lookups ─────────────────────────────────
    function currentAddressData() {
        if (useSavedAddress && user_address) {
            return {
                address_line1: user_address.address_line1,
                address_line2: user_address.address_line2 ?? '',
                city:          user_address.city,
                province:      user_address.province,
                postal_code:   user_address.postal_code,
            };
        }
        return {
            address_line1: data.address_line1,
            address_line2: data.address_line2,
            city:          data.city,
            province:      data.province,
            postal_code:   data.postal_code,
        };
    }

    // ─── TCG courier rates sub-section ────────────────────────────────────
    function CourierRatesSection() {
        if (ratesLoading) {
            return (
                <div className="flex items-center gap-3 py-4 text-alloy">
                    <svg className="w-4 h-4 animate-spin text-sector-600 shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span className="text-sm text-alloy">Fetching courier rates…</span>
                </div>
            );
        }

        if (ratesError) {
            return (
                <div className="space-y-2">
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                        </svg>
                        <span className="text-xs text-red-700">{ratesError}</span>
                    </div>
                    <button type="button" onClick={() => fetchRates(currentAddressData())}
                        className="text-xs font-semibold text-sector-600 hover:text-sector-700">
                        Try again
                    </button>
                </div>
            );
        }

        if (tcgOptions.length > 0) {
            return (
                <div className="space-y-3">
                    {tcgOptions.map(opt => (
                        <ShippingOption key={opt.service_code} option={opt}
                            selected={data.shipping_service === opt.service_code}
                            onSelect={code => setData('shipping_service', code)} />
                    ))}
                    <button type="button" onClick={() => fetchRates(currentAddressData())}
                        className="text-xs font-semibold text-sector-600 hover:text-sector-700 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                        </svg>
                        Refresh Rates
                    </button>
                </div>
            );
        }

        // Not yet fetched — show calculate button
        return (
            <div className="space-y-2">
                <p className="text-xs text-alloy">
                    {ratesFetched
                        ? 'No courier rates available for this address.'
                        : 'Click below to get live courier rates for your address.'}
                </p>
                {!ratesFetched && (
                    <button type="button" onClick={() => fetchRates(currentAddressData())}
                        className="inline-flex items-center gap-2 rounded-xl bg-sector-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sector-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                        </svg>
                        Get Courier Rates
                    </button>
                )}
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-6 py-10">
                <nav className="text-sm text-pitlane-60 mb-3 flex gap-2">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <a href="/cart" className="hover:text-sector-600">Cart</a>
                    <span>/</span>
                    <span className="text-pitlane">Checkout</span>
                </nav>
                <h1 className="t-h1 text-pitlane mb-8">Checkout</h1>

                <form onSubmit={submit}>
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* ── Left column ───────────────────────────────── */}
                        <div className="flex-1 space-y-5 min-w-0">

                            {/* Step 1 (guest only): Create account */}
                            {!isLoggedIn && (
                                <SectionCard step="1" title="Create Your Account"
                                    subtitle="Required to place your order and track delivery">
                                    <div className="mb-4 p-3 bg-sector-50 border border-sector-200 rounded-xl flex items-start gap-2">
                                        <svg className="w-4 h-4 text-sector-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                                        </svg>
                                        <p className="text-xs text-sector-700">
                                            Already have an account? <a href="/login" className="font-bold underline">Sign in first</a>
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <FloatField id="email" label="Email Address" type="email"
                                            value={data.email} onChange={e => setData('email', e.target.value)}
                                            error={errors.email} required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <PasswordField id="password" label="Password" value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                error={errors.password} autoComplete="new-password" />
                                            <PasswordField id="password_confirmation" label="Confirm Password"
                                                value={data.password_confirmation}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                error={errors.password_confirmation} autoComplete="new-password" />
                                        </div>
                                    </div>
                                </SectionCard>
                            )}

                            {/* Step: Delivery address */}
                            <SectionCard step={guestStep + 1} title="Delivery Address"
                                subtitle={isLoggedIn && hasAddress && useSavedAddress ? 'Using your saved default address' : 'Where should we deliver?'}
                                completed={isLoggedIn && hasAddress && useSavedAddress}>
                                {isLoggedIn && hasAddress && useSavedAddress ? (
                                    <SavedAddressCard address={user_address} onChange={toggleSaved} />
                                ) : (
                                    <>
                                        {isLoggedIn && hasAddress && (
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-asphalt">
                                                <span className="text-xs text-alloy">Enter a different address</span>
                                                <button type="button" onClick={toggleSaved}
                                                    className="text-xs font-semibold text-sector-600">← Use saved address</button>
                                            </div>
                                        )}
                                        <AddressForm data={data} setData={setData} errors={errors} />
                                    </>
                                )}
                                {errors.address && <p className="mt-3 text-xs text-red-500">{errors.address}</p>}
                            </SectionCard>

                            {/* Step: Shipping method */}
                            <SectionCard step={guestStep + 2} title="Shipping Method"
                                subtitle={`${cart_weight_kg} kg estimated · Select how you'd like to receive your order`}>

                                {/* Static options — always visible */}
                                {static_shipping_options.length > 0 && (
                                    <div className="space-y-3 mb-5">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-alloy">Pick-up &amp; Self-Arranged</p>
                                        {static_shipping_options.map(opt => (
                                            <ShippingOption key={opt.service_code} option={opt}
                                                selected={data.shipping_service === opt.service_code}
                                                onSelect={code => setData('shipping_service', code)} />
                                        ))}
                                    </div>
                                )}

                                {/* TCG courier rates */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-alloy">Courier Delivery</p>
                                    <CourierRatesSection />
                                </div>

                                {errors.shipping_service && (
                                    <p className="mt-3 text-xs text-red-500">{errors.shipping_service}</p>
                                )}
                            </SectionCard>

                            {/* Step: Order extras (notes + gift wrap) */}
                            <SectionCard step={guestStep + 3} title="Order Options"
                                subtitle="Gift wrapping and special instructions">

                                {/* Gift wrap */}
                                <label className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-all mb-4
                                    ${data.gift_wrapped ? 'border-sector-500 bg-sector-50' : 'border-asphalt hover:border-sector-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0
                                            ${data.gift_wrapped ? 'border-sector-500 bg-sector-500' : 'border-asphalt'}`}>
                                            {data.gift_wrapped && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <input type="checkbox" checked={data.gift_wrapped}
                                                onChange={e => setData('gift_wrapped', e.target.checked)}
                                                className="sr-only" />
                                            <div className="text-sm font-semibold text-pitlane">Gift Wrapping</div>
                                            <div className="text-xs text-alloy">Beautifully wrapped with a ribbon — perfect for gifting</div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-sm font-bold text-pitlane">{formatZAR(GIFT_WRAP_COST)}</div>
                                        <div className="text-[10px] text-alloy">incl. VAT</div>
                                    </div>
                                </label>

                                {/* Order notes */}
                                <div className="relative">
                                    <label htmlFor="order_notes"
                                        className="block text-[10px] font-semibold uppercase tracking-widest text-alloy mb-2">
                                        Order Notes <span className="normal-case font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        id="order_notes"
                                        rows={3}
                                        value={data.order_notes}
                                        onChange={e => setData('order_notes', e.target.value)}
                                        placeholder="Any special instructions for your order or delivery…"
                                        className="w-full bg-transparent border border-asphalt focus:border-sector-500 rounded-xl px-4 py-3 text-pitlane text-sm outline-none resize-none transition-all placeholder:text-alloy"
                                    />
                                </div>
                            </SectionCard>

                            {/* Step: Payment */}
                            <SectionCard step={guestStep + 4} title="Payment"
                                subtitle="You'll be redirected to Yoco's secure payment page">
                                <div className="flex items-center gap-3 p-4 bg-asphalt rounded-xl">
                                    <svg className="w-5 h-5 text-sector-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
                                    </svg>
                                    <div>
                                        <div className="text-sm font-semibold text-pitlane">Credit / Debit Card via Yoco</div>
                                        <div className="text-xs text-alloy">After clicking pay, you'll be taken to Yoco's secure page to complete payment</div>
                                    </div>
                                </div>
                                {errors.payment && (
                                    <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                        <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                                        </svg>
                                        <span className="text-sm text-red-700">{errors.payment}</span>
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* ── Right: order summary ─────────────────────── */}
                        <div className="w-full lg:w-80 shrink-0">
                            <OrderSummary contents={contents} totals={totals}
                                selectedShipping={selectedShipping}
                                giftWrapped={data.gift_wrapped}
                                processing={processing} />
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
