import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Garage({ vehicles = [], makes = [] }) {
    const [makeId, setMakeId] = useState('');
    const [year, setYear] = useState('');
    const [modelId, setModelId] = useState('');
    const [years, setYears] = useState([]);
    const [models, setModels] = useState([]);

    async function handleMakeChange(e) {
        const id = e.target.value;
        setMakeId(id); setYear(''); setModelId(''); setModels([]);
        if (!id) { setYears([]); return; }
        const res = await fetch(`/api/vehicles/years?make_id=${id}`);
        setYears(await res.json());
    }

    async function handleYearChange(e) {
        const y = e.target.value;
        setYear(y); setModelId('');
        if (!y) { setModels([]); return; }
        const res = await fetch(`/api/vehicles/models?make_id=${makeId}&year=${y}`);
        setModels(await res.json());
    }

    function addVehicle() {
        if (!modelId) return;
        router.post('/account/garage/add', { id_vehicle_filter: modelId }, { preserveScroll: true });
    }

    function removeVehicle(id) {
        router.delete(`/account/garage/${id}`, {}, { preserveScroll: true });
    }

    const sel = "flex-1 px-3 py-2.5 text-pitlane border border-asphalt-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sector-500 disabled:opacity-40";

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="t-h1 text-pitlane mb-8">My Garage</h1>

                {/* Add vehicle */}
                <div className="bg-white border border-asphalt rounded-xl p-6 mb-8">
                    <h2 className="t-h3 text-pitlane mb-4">Add a Vehicle</h2>
                    <div className="flex flex-wrap gap-3">
                        <select className={sel} value={makeId} onChange={handleMakeChange}>
                            <option value="">Make</option>
                            {makes.map(m => <option key={m.id_make} value={m.id_make}>{m.make}</option>)}
                        </select>
                        <select className={sel} value={year} onChange={handleYearChange} disabled={!makeId}>
                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select className={sel} value={modelId} onChange={e => setModelId(e.target.value)} disabled={!year}>
                            <option value="">Model</option>
                            {models.map(m => <option key={m.id_vehicle_filter} value={m.id_vehicle_filter}>{m.model}</option>)}
                        </select>
                        <button onClick={addVehicle} disabled={!modelId}
                            className="btn btn-primary px-5 py-2.5 disabled:opacity-40">
                            Add
                        </button>
                    </div>
                </div>

                {/* Vehicle list */}
                {vehicles.length === 0 ? (
                    <p className="text-alloy text-center py-10">No vehicles in your garage yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vehicles.map(v => (
                            <div key={v.id} className="bg-white border border-asphalt rounded-xl overflow-hidden hover:border-sector-300 transition-all">
                                <a href={`/browse?vehicle_filter_id=${v.id_vehicle_filter}`}
                                    onClick={() => {
                                        try {
                                            localStorage.setItem('ppsa_active_vehicle', JSON.stringify({
                                                id_vehicle_filter: v.id_vehicle_filter,
                                                make: v.make, year: v.year, model: v.model,
                                            }));
                                        } catch {}
                                    }}>
                                    {v.image && <img src={`/img/vehicles/${v.image}`}
                                        className="w-full h-40 object-cover" alt={v.model}
                                        onError={e => e.target.style.display = 'none'} />}
                                    <div className="p-4">
                                        <div className="font-black text-pitlane">{v.year} {v.make} {v.model}</div>
                                        <div className="text-xs text-sector-600 mt-1">Browse parts &rarr;</div>
                                    </div>
                                </a>
                                <div className="px-4 pb-4">
                                    <button onClick={() => removeVehicle(v.id)}
                                        className="text-xs text-red-400 hover:text-red-600">Remove from garage</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
