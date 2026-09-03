import { useState } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

// ─── Floating-label field ────────────────────────────────────────────────────
function FloatField({ id, label, type = 'text', value, onChange, error, autoComplete, required, className = '' }) {
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
                required={required}
                className={`w-full bg-transparent border rounded-xl px-4 pt-5 pb-2 text-pitlane text-sm outline-none transition-all
                    ${error ? 'border-red-400 focus:border-red-500' : 'border-asphalt focus:border-sector-500'}`}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 pointer-events-none text-sm transition-all duration-150
                    ${lifted ? 'top-1.5 text-[10px] font-semibold tracking-wider uppercase' : 'top-3.5 text-sm'}
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
                className={`w-full bg-white border rounded-xl px-4 pt-5 pb-2 text-pitlane text-sm outline-none appearance-none transition-all
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

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ onAdd }) {
    return (
        <div className="text-center py-20 bg-white border border-asphalt rounded-2xl">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-asphalt flex items-center justify-center mb-5 text-alloy">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
            </div>
            <h2 className="t-h3 text-pitlane mb-2">No addresses saved</h2>
            <p className="text-alloy text-sm mb-6">Add a delivery address to speed up checkout</p>
            <button onClick={onAdd} className="btn btn-primary px-6 py-2.5 text-sm">
                Add Your First Address
            </button>
        </div>
    );
}

// ─── Address card ─────────────────────────────────────────────────────────────
function AddressCard({ address, onEdit, onDelete, onSetDefault, deleting }) {
    const line1 = [address.address_line1, address.address_line2].filter(Boolean).join(', ');
    const line2 = [address.city, address.province, address.postal_code].filter(Boolean).join(', ');

    return (
        <div className={`relative bg-white border rounded-2xl p-5 transition-all ${address.is_default ? 'border-sector-400 shadow-sm' : 'border-asphalt'}`}>
            {address.is_default && (
                <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sector-600 bg-sector-50 px-2.5 py-1 rounded-full">
                        Default
                    </span>
                </div>
            )}

            <div className="mb-1 font-bold text-pitlane text-sm">{address.label || 'Delivery Address'}</div>

            <div className="text-sm text-pitlane leading-relaxed">
                {address.first_name} {address.last_name}
            </div>
            {address.company && <div className="text-sm text-alloy">{address.company}</div>}
            <div className="text-sm text-alloy mt-1">{line1}</div>
            <div className="text-sm text-alloy">{line2}</div>
            <div className="text-sm text-alloy">{address.country}</div>
            {address.phone && <div className="text-sm text-alloy mt-1">{address.phone}</div>}

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-asphalt">
                <button
                    onClick={() => onEdit(address)}
                    className="text-xs font-semibold text-sector-600 hover:text-sector-700 transition-colors"
                >
                    Edit
                </button>
                {!address.is_default && (
                    <button
                        onClick={() => onSetDefault(address.id)}
                        className="text-xs font-semibold text-alloy hover:text-pitlane transition-colors"
                    >
                        Set as default
                    </button>
                )}
                <button
                    onClick={() => onDelete(address.id)}
                    disabled={deleting === address.id}
                    className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                    {deleting === address.id ? 'Deleting…' : 'Delete'}
                </button>
            </div>
        </div>
    );
}

// ─── Address modal ─────────────────────────────────────────────────────────────
const EMPTY_FORM = {
    label: '',
    first_name: '',
    last_name: '',
    company: '',
    address_line1: '',
    address_line2: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'South Africa',
    phone: '',
    is_default: false,
};

const ZA_PROVINCES = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
    'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
];

function AddressModal({ address, onClose, onSaved }) {
    const isEdit = !!address?.id;
    const [form, setForm] = useState(address ? { ...address } : { ...EMPTY_FORM });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    function set(key, val) {
        setForm(f => ({ ...f, [key]: val }));
    }

    function submit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        const method = isEdit ? router.put : router.post;
        const url = isEdit ? `/account/addresses/${address.id}` : '/account/addresses';
        router.visit(url, {
            method: isEdit ? 'put' : 'post',
            data: form,
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                onSaved();
            },
            onError: errs => {
                setErrors(errs);
                setSaving(false);
            },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pitlane/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-asphalt sticky top-0 bg-white rounded-t-2xl z-10">
                    <h2 className="font-bold text-pitlane">{isEdit ? 'Edit Address' : 'Add New Address'}</h2>
                    <button onClick={onClose} className="text-alloy hover:text-pitlane transition-colors p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className="px-6 py-6 space-y-4">
                    <FloatField
                        id="label"
                        label="Address Label (e.g. Home, Work)"
                        value={form.label}
                        onChange={e => set('label', e.target.value)}
                        error={errors.label}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FloatField
                            id="first_name"
                            label="First Name"
                            value={form.first_name}
                            onChange={e => set('first_name', e.target.value)}
                            error={errors.first_name}
                            required
                        />
                        <FloatField
                            id="last_name"
                            label="Last Name"
                            value={form.last_name}
                            onChange={e => set('last_name', e.target.value)}
                            error={errors.last_name}
                            required
                        />
                    </div>

                    <FloatField
                        id="company"
                        label="Company (optional)"
                        value={form.company}
                        onChange={e => set('company', e.target.value)}
                        error={errors.company}
                    />

                    <FloatField
                        id="address_line1"
                        label="Street Address"
                        value={form.address_line1}
                        onChange={e => set('address_line1', e.target.value)}
                        error={errors.address_line1}
                        autoComplete="address-line1"
                        required
                    />

                    <FloatField
                        id="address_line2"
                        label="Apartment, Suite, Unit (optional)"
                        value={form.address_line2}
                        onChange={e => set('address_line2', e.target.value)}
                        error={errors.address_line2}
                        autoComplete="address-line2"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FloatField
                            id="city"
                            label="City"
                            value={form.city}
                            onChange={e => set('city', e.target.value)}
                            error={errors.city}
                            autoComplete="address-level2"
                            required
                        />
                        <FloatField
                            id="postal_code"
                            label="Postal Code"
                            value={form.postal_code}
                            onChange={e => set('postal_code', e.target.value)}
                            error={errors.postal_code}
                            autoComplete="postal-code"
                            required
                        />
                    </div>

                    <SelectField
                        id="province"
                        label="Province"
                        value={form.province}
                        onChange={e => set('province', e.target.value)}
                        error={errors.province}
                    >
                        <option value="">Select province…</option>
                        {ZA_PROVINCES.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </SelectField>

                    <FloatField
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        error={errors.phone}
                        autoComplete="tel"
                    />

                    {/* Default toggle */}
                    <label className="flex items-center gap-3 cursor-pointer pt-1">
                        <div className="relative flex-shrink-0">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={form.is_default}
                                onChange={e => set('is_default', e.target.checked)}
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${form.is_default ? 'bg-sector-500' : 'bg-asphalt'}`} />
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_default ? 'translate-x-5' : ''}`} />
                        </div>
                        <span className="text-sm text-pitlane font-medium">Set as default delivery address</span>
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 btn btn-ghost py-2.5 text-sm font-semibold">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="flex-1 btn btn-primary py-2.5 text-sm font-semibold disabled:opacity-50">
                            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Delete confirm modal ──────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pitlane/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                    </svg>
                </div>
                <h3 className="font-bold text-pitlane mb-1">Delete address?</h3>
                <p className="text-sm text-alloy mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 btn btn-ghost py-2.5 text-sm font-semibold">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Addresses({ addresses = [] }) {
    const [modal, setModal] = useState(null); // null | { mode: 'add' | 'edit', address?: obj }
    const [confirmDelete, setConfirmDelete] = useState(null); // address id
    const [deleting, setDeleting] = useState(null);

    function openAdd() { setModal({ mode: 'add' }); }
    function openEdit(address) { setModal({ mode: 'edit', address }); }
    function closeModal() { setModal(null); }

    function handleSaved() {
        setModal(null);
        router.reload({ only: ['addresses'] });
    }

    function handleDelete(id) {
        setConfirmDelete(id);
    }

    function confirmDeleteAddress() {
        const id = confirmDelete;
        setConfirmDelete(null);
        setDeleting(id);
        router.delete(`/account/addresses/${id}`, {
            preserveScroll: true,
            onFinish: () => setDeleting(null),
        });
    }

    function handleSetDefault(id) {
        router.post(`/account/addresses/${id}/default`, {}, {
            preserveScroll: true,
        });
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <a href="/account" className="hover:text-sector-600">Your Account</a>
                    <span>/</span>
                    <span className="text-pitlane">My Addresses</span>
                </nav>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="t-h1 text-pitlane">My Addresses</h1>
                        <p className="text-sm text-alloy mt-1">
                            {addresses.length > 0
                                ? `${addresses.length} saved address${addresses.length !== 1 ? 'es' : ''}`
                                : 'No delivery addresses saved'}
                        </p>
                    </div>
                    {addresses.length > 0 && (
                        <button onClick={openAdd} className="btn btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                            </svg>
                            Add Address
                        </button>
                    )}
                </div>

                {addresses.length === 0 ? (
                    <EmptyState onAdd={openAdd} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                            <AddressCard
                                key={addr.id}
                                address={addr}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                                deleting={deleting}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Address modal */}
            {modal && (
                <AddressModal
                    address={modal.mode === 'edit' ? modal.address : null}
                    onClose={closeModal}
                    onSaved={handleSaved}
                />
            )}

            {/* Delete confirm */}
            {confirmDelete && (
                <DeleteConfirm
                    onConfirm={confirmDeleteAddress}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </MainLayout>
    );
}
