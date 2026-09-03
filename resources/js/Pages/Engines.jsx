import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';

export default function Engines({ groups = {}, make_meta = {} }) {
    const makeIds = Object.keys(groups);
    const [openMake, setOpenMake] = useState(makeIds[0] ?? null);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <span className="text-pitlane font-medium">Find Parts by Engine</span>
                </nav>

                <h1 className="t-h1 text-pitlane mb-2">Find Parts by Engine</h1>
                <p className="text-pitlane-60 mb-8">Select your engine to find compatible performance upgrades.</p>

                {/* Make tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {makeIds.map(id => {
                        const meta = make_meta[id] ?? {};
                        return (
                            <button
                                key={id}
                                onClick={() => setOpenMake(id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${openMake === id ? 'bg-sector-600 text-white border-sector-600' : 'bg-white text-pitlane border-asphalt-dark hover:border-sector-300'}`}
                            >
                                {meta.image && (
                                    <img src={`/img/makes/${meta.image}`} alt={meta.name}
                                        className="w-5 h-5 object-contain"
                                        onError={e => e.target.style.display = 'none'} />
                                )}
                                {meta.name}
                            </button>
                        );
                    })}
                </div>

                {/* Engine list for selected make */}
                {openMake && groups[openMake] && (
                    <div>
                        <h2 className="t-h2 text-pitlane mb-4">
                            {make_meta[openMake]?.name} Engines
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {groups[openMake].map(engine => (
                                <a
                                    key={engine.id_engine_filter}
                                    href={`/engines/${engine.id_engine_filter}`}
                                    className="group flex items-center gap-4 bg-white border border-asphalt rounded-xl p-4 hover:border-sector-300 transition-all"
                                >
                                    {engine.image ? (
                                        <img src={`/img/engines/${engine.image}`} alt={engine.engine}
                                            className="w-16 h-16 object-contain rounded-lg bg-asphalt p-1"
                                            onError={e => { e.target.parentElement.children[0].style.display = 'none'; }} />
                                    ) : (
                                        <div className="w-16 h-16 bg-asphalt rounded-lg flex items-center justify-center text-2xl text-alloy shrink-0">
                                            ⚙️
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-pitlane text-sm leading-snug group-hover:text-sector-600 transition-colors">
                                            {engine.engine}
                                        </div>
                                        <div className="text-xs text-alloy mt-1">
                                            {engine.product_count} compatible parts
                                        </div>
                                    </div>
                                    <span className="text-alloy-light group-hover:text-sector-400 transition-colors">›</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {makeIds.length === 0 && (
                    <div className="text-center py-20 text-alloy">No engines available yet.</div>
                )}
            </div>
        </MainLayout>
    );
}
