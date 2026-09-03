import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';

function MakeLogo({ image, name }) {
    if (image) {
        return (
            <img
                src={`/img/makes/${image}`}
                alt={name}
                className="w-12 h-12 object-contain"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
        );
    }
    return null;
}

function MakeInitials({ name }) {
    return (
        <div className="w-12 h-12 bg-sector-100 rounded-full flex items-center justify-center text-sector-600 font-black text-lg">
            {name.slice(0, 2).toUpperCase()}
        </div>
    );
}

export default function Vehicles({ grouped = {}, make_meta = {} }) {
    const [openMake, setOpenMake] = useState(Object.keys(grouped)[0] ?? null);

    const makes = Object.keys(grouped);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Breadcrumb */}
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <span className="text-pitlane font-medium">Find Parts by Vehicle</span>
                </nav>

                <h1 className="t-h1 text-pitlane mb-2">Find Parts by Vehicle</h1>
                <p className="text-pitlane-60 mb-8">Select your vehicle to see compatible performance parts.</p>

                {/* Make tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {makes.map(make => {
                        const meta = make_meta[make] ?? {};
                        return (
                            <button
                                key={make}
                                onClick={() => setOpenMake(make)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${openMake === make ? 'bg-sector-600 text-white border-sector-600' : 'bg-white text-pitlane border-asphalt-dark hover:border-sector-300'}`}
                            >
                                {meta.image && (
                                    <img src={`/img/makes/${meta.image}`} alt={make}
                                        className="w-5 h-5 object-contain"
                                        onError={e => e.target.style.display = 'none'} />
                                )}
                                {make}
                            </button>
                        );
                    })}
                </div>

                {/* Model grid for selected make */}
                {openMake && grouped[openMake] && (
                    <div>
                        <h2 className="t-h2 text-pitlane mb-4">{openMake} Models</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Object.entries(grouped[openMake]).map(([model, data]) => (
                                <ModelCard key={model} make={openMake} model={model} data={data} />
                            ))}
                        </div>
                    </div>
                )}

                {makes.length === 0 && (
                    <div className="text-center py-20 text-alloy">No vehicles available yet.</div>
                )}
            </div>
        </MainLayout>
    );
}

function ModelCard({ make, model, data }) {
    const [showVariants, setShowVariants] = useState(false);

    // If only one variant, link directly
    if (data.variants.length === 1) {
        const v = data.variants[0];
        return (
            <a href={`/vehicles/${v.id_vehicle_filter}`}
                className="group bg-white border border-asphalt rounded-2xl overflow-hidden hover:border-sector-300 transition-all">
                <div className="aspect-video bg-asphalt overflow-hidden">
                    {data.image
                        ? <img src={`/img/models/${data.image}`} alt={model}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={e => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl text-alloy-light">🚗</div>'; }} />
                        : <div className="w-full h-full flex items-center justify-center text-4xl text-alloy-light">🚗</div>
                    }
                </div>
                <div className="p-3">
                    <div className="font-bold text-pitlane text-sm">{model}</div>
                    <div className="text-xs text-alloy mt-0.5">{v.year}</div>
                    <div className="text-xs text-sector-600 font-semibold mt-1">{data.total_products} parts</div>
                </div>
            </a>
        );
    }

    // Multiple year variants — show picker
    return (
        <div className="bg-white border border-asphalt rounded-2xl overflow-hidden hover:border-sector-300 transition-all">
            <button className="w-full text-left" onClick={() => setShowVariants(!showVariants)}>
                <div className="aspect-video bg-asphalt overflow-hidden">
                    {data.image
                        ? <img src={`/img/models/${data.image}`} alt={model}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl text-alloy-light">🚗</div>'; }} />
                        : <div className="w-full h-full flex items-center justify-center text-4xl text-alloy-light">🚗</div>
                    }
                </div>
                <div className="p-3">
                    <div className="font-bold text-pitlane text-sm">{model}</div>
                    <div className="text-xs text-alloy mt-0.5">{data.variants.length} year ranges</div>
                    <div className="text-xs text-sector-600 font-semibold mt-1">
                        {data.total_products} parts {showVariants ? '▲' : '▼'}
                    </div>
                </div>
            </button>

            {showVariants && (
                <div className="border-t border-asphalt divide-y divide-asphalt">
                    {data.variants.map(v => (
                        <a key={v.id_vehicle_filter} href={`/vehicles/${v.id_vehicle_filter}`}
                            className="flex items-center justify-between px-3 py-2 hover:bg-sector-50 text-sm">
                            <span className="font-medium text-pitlane-60">{v.year}</span>
                            <span className="text-xs text-alloy">{v.product_count} parts</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
