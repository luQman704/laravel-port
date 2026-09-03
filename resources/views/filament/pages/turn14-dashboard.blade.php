<x-filament-panels::page>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        @php $stats = $this->getStats(); @endphp

        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-3xl font-bold text-gray-900">{{ number_format($stats['products']) }}</div>
            <div class="text-sm text-gray-500 mt-1">Active products</div>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-3xl font-bold text-gray-900">{{ number_format($stats['brands']) }}</div>
            <div class="text-sm text-gray-500 mt-1">Total brands</div>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="text-3xl font-bold text-primary-600">{{ number_format($stats['active_brands']) }}</div>
            <div class="text-sm text-gray-500 mt-1">Synced brands</div>
        </div>
        <div class="rounded-xl border border-red-100 bg-red-50 p-5 shadow-sm">
            <div class="text-3xl font-bold text-red-600">{{ number_format($stats['discontinued']) }}</div>
            <div class="text-sm text-gray-500 mt-1">Discontinued</div>
        </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 class="text-base font-semibold text-gray-900 mb-3">Background Sync Jobs</h3>
        <p class="text-sm text-gray-500 mb-4">
            All sync actions dispatch background queue jobs. Ensure <code class="bg-gray-100 px-1 rounded">php artisan queue:work</code>
            is running (or use <code class="bg-gray-100 px-1 rounded">ddev exec php artisan queue:work</code> in DDEV).
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-100 text-left text-gray-500">
                        <th class="pb-2 font-medium">Job</th>
                        <th class="pb-2 font-medium">Purpose</th>
                        <th class="pb-2 font-medium">Frequency (PS cron)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    @foreach([
                        ['Sync Brands',       'Pull latest brand list from Turn14 API',           'Weekly'],
                        ['Sync Products',     'Full product catalog import/update',               'Nightly'],
                        ['Sync Stock (Delta)','Incremental stock update — changed items only',    'Every 2–4 hrs'],
                        ['Full Stock Crawl',  'Paginated full stock refresh for all products',    'Weekly'],
                        ['Check Discontinued','Mark products no longer sold by Turn14',          'Nightly'],
                    ] as [$name, $purpose, $freq])
                    <tr>
                        <td class="py-2 font-medium text-gray-800">{{ $name }}</td>
                        <td class="py-2 text-gray-600">{{ $purpose }}</td>
                        <td class="py-2 text-gray-400">{{ $freq }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</x-filament-panels::page>
