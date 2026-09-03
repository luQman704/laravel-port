import { useState } from 'react';

const STORAGE_KEY = 'ppsa_view_mode';

export function useViewMode(defaultMode = 'grid') {
    const [mode, setModeState] = useState(() => {
        try { return localStorage.getItem(STORAGE_KEY) || defaultMode; } catch { return defaultMode; }
    });
    function setMode(v) {
        setModeState(v);
        try { localStorage.setItem(STORAGE_KEY, v); } catch {}
    }
    return [mode, setMode];
}

export default function ViewControls({ mode, onMode, sort, onSort, total, sortOptions = [] }) {
    const defaultOpts = [
        { value: 'default',    label: 'Default' },
        { value: 'price_asc',  label: 'Price: Low → High' },
        { value: 'price_desc', label: 'Price: High → Low' },
        { value: 'name_asc',   label: 'Name: A–Z' },
        { value: 'name_desc',  label: 'Name: Z–A' },
    ];
    const opts = sortOptions.length ? sortOptions : defaultOpts;

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Sort */}
            <div className="flex items-center gap-2">
                <label className="t-label text-alloy whitespace-nowrap">Sort by</label>
                <select
                    value={sort ?? 'default'}
                    onChange={e => onSort(e.target.value)}
                    className="text-sm border border-asphalt-dark rounded-lg px-3 py-1.5 text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-500 bg-white"
                >
                    {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center border border-asphalt-dark rounded-lg overflow-hidden">
                <button
                    onClick={() => onMode('grid')}
                    title="Grid view"
                    className={`p-2 transition-colors ${mode === 'grid' ? 'bg-sector-600 text-white' : 'bg-white text-alloy hover:text-sector-600'}`}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <rect x="1" y="1" width="6" height="6" rx="1"/>
                        <rect x="9" y="1" width="6" height="6" rx="1"/>
                        <rect x="1" y="9" width="6" height="6" rx="1"/>
                        <rect x="9" y="9" width="6" height="6" rx="1"/>
                    </svg>
                </button>
                <button
                    onClick={() => onMode('list')}
                    title="List view"
                    className={`p-2 transition-colors ${mode === 'list' ? 'bg-sector-600 text-white' : 'bg-white text-alloy hover:text-sector-600'}`}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <rect x="1" y="1" width="14" height="3" rx="1"/>
                        <rect x="1" y="6.5" width="14" height="3" rx="1"/>
                        <rect x="1" y="12" width="14" height="3" rx="1"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
