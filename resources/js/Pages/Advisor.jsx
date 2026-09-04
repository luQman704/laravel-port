import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { useState } from 'react';
import { router } from '@inertiajs/react';

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

    const sel = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-400 disabled:opacity-40 transition';

    return (
        <MainLayout>

            {/* ── Page header — light, matches rest of site ──────────────── */}
            <div className="bg-white border-b border-asphalt">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <h1 className="t-h1 text-pitlane">
                        {vehicle
                            ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                            : 'Build Advisor'
                        }
                    </h1>
                    <p className="text-sm text-alloy mt-1">
                        {vehicle
                            ? <>Currently at <strong className="text-pitlane">{stage_labels[current_stage]}</strong> — recommendations for <strong className="text-sector-600">{stage_labels[next_stage]}</strong></>
                            : stage_desc
                        }
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── Sidebar ───────────────────────────────────────── */}
                    <aside className="lg:w-64 shrink-0 space-y-5">

                        {/* Next stage context */}
                        <div className="rounded-xl p-4 bg-sector-50 border border-sector-200">
                            <div className="text-sm font-bold text-sector-700 mb-1">{stage_labels[next_stage]}</div>
                            <p className="text-xs text-sector-800 leading-relaxed">{stage_desc}</p>
                        </div>

                        {/* Advisor controls */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
                            <div className="text-sm font-bold text-pitlane">Adjust your build</div>

                            {/* Stage picker — the single stage control */}
                            <div>
                                <label className="text-xs font-semibold text-alloy block mb-2">Current stage</label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {[
                                        { n: 0, label: 'Stock' },
                                        { n: 1, label: 'Stage 1' },
                                        { n: 2, label: 'Stage 2' },
                                        { n: 3, label: 'Stage 3' },
                                    ].map(({ n, label }) => (
                                        <button
                                            key={n}
                                            onClick={() => setSelStage(n)}
                                            className="py-1.5 rounded-lg text-xs font-bold border transition-all"
                                            style={selStage === n
                                                ? { background: '#16a34a', color: '#fff', borderColor: '#16a34a' }
                                                : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }
                                            }
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-alloy block">Vehicle (optional)</label>
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
                                className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-sector-600 hover:bg-sector-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Loading…' : 'Update recommendations'}
                            </button>
                        </div>

                        <a href="/browse" className="block text-center text-sm font-semibold text-sector-600 hover:text-sector-700">
                            Browse full catalogue
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
                                                href={`/browse?category=${encodeURIComponent(category)}${vehicle?.id_vehicle_filter ? `&vehicle_filter_id=${vehicle.id_vehicle_filter}` : ''}`}
                                                className="text-sm font-semibold text-sector-600 hover:text-sector-700"
                                            >
                                                View all
                                            </a>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {items.map(p => (
                                                <ProductCard key={p.id ?? p.part_number} product={p} />
                                            ))}
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
