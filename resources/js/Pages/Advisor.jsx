import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { formatZAR } from '@/utils/format';

function toHighRes(url) {
    if (!url) return url;
    return url.replace(/([A-Z0-9]+)[SM](\.jpe?g)$/i, '$1L$2');
}

const STAGE_COLORS = ['#6b7280', '#16a34a', '#2563eb', '#7c3aed', '#dc2626'];
const STAGE_BG     = ['#f3f4f6', '#f0fdf4', '#eff6ff', '#f5f3ff', '#fef2f2'];

function StageNode({ n, label, active, done }) {
    const color = STAGE_COLORS[n];
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all"
                style={{
                    background: done || active ? color : '#e5e7eb',
                    color: done || active ? '#fff' : '#9ca3af',
                    boxShadow: active ? `0 0 0 4px ${color}30` : 'none',
                    transform: active ? 'scale(1.2)' : 'scale(1)',
                }}
            >
                {done
                    ? <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    : n
                }
            </div>
            <span className="text-xs font-semibold" style={{ color: active ? color : '#6b7280' }}>{label}</span>
        </div>
    );
}

function ProductCard({ product }) {
    const thumb = toHighRes(product.images?.[0] ?? product.thumbnail ?? null);
    return (
        <a
            href={`/product/${product.id}`}
            className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-sector-300 hover:shadow-md transition-all duration-200"
        >
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {thumb
                    ? <img src={thumb} alt={product.product_name}
                           className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                           onError={e => { e.target.style.display = 'none'; }} />
                    : <span className="text-3xl text-gray-200">▣</span>
                }
            </div>
            <div className="flex flex-col flex-1 p-3 gap-1">
                {product.brand_name && (
                    <div className="text-[10px] font-semibold text-alloy uppercase tracking-wider">{product.brand_name}</div>
                )}
                <div className="text-sm font-semibold text-pitlane leading-snug line-clamp-2 flex-1">
                    {product.product_name}
                </div>
                <div className="font-mono text-[10px] text-alloy-light">#{product.part_number}</div>
                <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="font-mono font-bold text-sector-600 text-sm">
                        {product.price_incl > 0 ? formatZAR(product.price_incl) : <span className="text-alloy italic text-xs">POA</span>}
                    </div>
                    {product.in_stock
                        ? <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">In stock</span>
                        : <span className="text-[10px] font-semibold text-alloy bg-gray-100 px-2 py-0.5 rounded-full">Order</span>
                    }
                </div>
            </div>
        </a>
    );
}

export default function Advisor({ vehicle, products, current_stage, next_stage, stage_labels, stage_desc, makes }) {
    const [makeId,   setMakeId]   = useState('');
    const [year,     setYear]     = useState('');
    const [modelId,  setModelId]  = useState('');
    const [years,    setYears]    = useState([]);
    const [models,   setModels]   = useState([]);
    const [selStage, setSelStage] = useState(current_stage);
    const [loading,  setLoading]  = useState(false);

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

    function runAdvisor() {
        setLoading(true);
        const params = new URLSearchParams({ stage: selStage });
        if (modelId) params.set('vehicle_filter_id', modelId);
        router.get(`/advisor?${params}`);
    }

    const groupEntries = Object.entries(products ?? {});
    const nextColor    = STAGE_COLORS[next_stage] ?? '#16a34a';
    const nextBg       = STAGE_BG[next_stage] ?? '#f0fdf4';

    const sel = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-400 disabled:opacity-40 transition';

    return (
        <MainLayout>
            {/* ── Header banner ─────────────────────────────────────────── */}
            <div className="bg-pitlane border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
                        <div>
                            <div className="text-xs font-semibold text-sector-400 uppercase tracking-widest mb-2">Build Advisor</div>
                            <h1 className="text-3xl font-black text-white leading-tight">
                                {vehicle
                                    ? <>{vehicle.year} {vehicle.make} {vehicle.model}</>
                                    : 'Stage-by-stage recommendations'
                                }
                            </h1>
                            {vehicle && (
                                <p className="text-white/50 text-sm mt-1">
                                    Currently at <strong className="text-white/80">{stage_labels[current_stage]}</strong>
                                    {' '}→ upgrading to <strong style={{ color: nextColor }}>{stage_labels[next_stage]}</strong>
                                </p>
                            )}
                        </div>

                        {/* Stage progress bar */}
                        <div className="flex items-center gap-2">
                            {stage_labels.slice(0, 5).map((label, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <StageNode
                                        n={i}
                                        label={label}
                                        active={i === next_stage}
                                        done={i <= current_stage}
                                    />
                                    {i < 4 && (
                                        <div className="w-6 h-px mt-[-14px]"
                                             style={{ background: i < current_stage ? STAGE_COLORS[i] : '#374151' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── Sidebar ───────────────────────────────────────── */}
                    <aside className="lg:w-72 shrink-0 space-y-5">

                        {/* Next stage description */}
                        <div className="rounded-xl p-5 border" style={{ background: nextBg, borderColor: `${nextColor}30` }}>
                            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: nextColor }}>
                                {stage_labels[next_stage]}
                            </div>
                            <p className="text-sm text-pitlane leading-relaxed">{stage_desc}</p>
                        </div>

                        {/* Change vehicle / stage */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                            <div className="text-xs font-bold text-pitlane uppercase tracking-wider">Adjust your build</div>

                            {/* Stage picker */}
                            <div>
                                <label className="text-xs font-semibold text-alloy uppercase tracking-wider block mb-2">Current stage</label>
                                <div className="flex gap-1.5">
                                    {[0,1,2,3].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setSelStage(n)}
                                            className="flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all"
                                            style={selStage === n
                                                ? { background: STAGE_COLORS[n], color: '#fff', borderColor: STAGE_COLORS[n] }
                                                : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }
                                            }
                                        >
                                            {n === 0 ? 'Stock' : `S${n}`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-alloy uppercase tracking-wider block">Vehicle (optional)</label>
                                <select className={sel} value={makeId} onChange={onMakeChange}>
                                    <option value="">Any make</option>
                                    {makes?.map(m => <option key={m.id_make} value={m.id_make}>{m.make}</option>)}
                                </select>
                                <select className={sel} value={year} onChange={onYearChange} disabled={!makeId}>
                                    <option value="">Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <select className={sel} value={modelId} onChange={e => setModelId(e.target.value)} disabled={!year}>
                                    <option value="">Model</option>
                                    {models.map(m => <option key={m.id_vehicle_filter} value={m.id_vehicle_filter}>{m.model}</option>)}
                                </select>
                            </div>

                            <button
                                onClick={runAdvisor}
                                disabled={loading}
                                className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50"
                                style={{ background: '#16a34a' }}
                            >
                                {loading ? 'Loading…' : 'Update recommendations'}
                            </button>
                        </div>

                        {/* Browse all */}
                        <a href="/browse" className="block text-center text-sm font-semibold text-sector-600 hover:text-sector-700">
                            Browse full catalogue →
                        </a>
                    </aside>

                    {/* ── Main results ──────────────────────────────────── */}
                    <div className="flex-1 min-w-0">
                        {groupEntries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="text-5xl mb-4">🔧</div>
                                <h2 className="text-xl font-black text-pitlane mb-2">No fitment data yet</h2>
                                <p className="text-sm text-alloy max-w-sm">
                                    We don't have vehicle-specific fitment data for this combination yet.
                                    Try browsing the full catalogue and filtering by category.
                                </p>
                                <a href="/browse" className="mt-6 inline-block px-6 py-3 bg-sector-600 text-white text-sm font-bold rounded-xl hover:bg-sector-700 transition-colors">
                                    Browse all parts
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {groupEntries.map(([category, items]) => (
                                    <div key={category}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-black text-pitlane">{category}</h2>
                                            <a
                                                href={`/browse?category=${encodeURIComponent(category)}${vehicle ? `&vehicle_filter_id=${vehicle.id_vehicle_filter ?? ''}` : ''}`}
                                                className="text-xs font-semibold text-sector-600 hover:text-sector-700"
                                            >
                                                See all →
                                            </a>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {items.map(p => <ProductCard key={p.id ?? p.part_number} product={p} />)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
