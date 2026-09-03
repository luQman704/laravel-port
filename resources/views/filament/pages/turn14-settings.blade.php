<x-filament-panels::page>
<form wire:submit.prevent="save" class="space-y-0">

{{-- ── Turn14 API Credentials ───────────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <svg class="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>
        </svg>
        <div>
            <h2 class="text-sm font-bold text-gray-900">Turn14 API Credentials</h2>
            <p class="text-xs text-gray-500">OAuth2 credentials for the Turn14 Distribution catalog API.</p>
        </div>
    </div>

    @foreach([
        ['key'=>'api_url',       'label'=>'API Base URL',    'req'=>true,  'type'=>'text',     'ph'=>'https://api.turn14.com/v1/', 'hint'=>''],
        ['key'=>'client_id',     'label'=>'Client ID',       'req'=>true,  'type'=>'text',     'ph'=>'',                           'hint'=>''],
        ['key'=>'client_secret', 'label'=>'Client Secret',   'req'=>true,  'type'=>'password', 'ph'=>'',                           'hint'=>'Keep this secret.'],
    ] as $f)
    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                @if($f['req'])<span class="text-red-500 mr-0.5">*</span>@endif{{ $f['label'] }}
            </label>
        </div>
        <div class="flex-1">
            <input wire:model="data.turn14.{{ $f['key'] }}" type="{{ $f['type'] }}" autocomplete="off"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition {{ $f['type']==='password' ? 'font-mono' : '' }}"
                placeholder="{{ $f['ph'] }}" />
            @if($f['hint'])<p class="mt-1 text-xs text-gray-400">{{ $f['hint'] }}</p>@endif
        </div>
    </div>
    @endforeach
</div>

{{-- ── Pricing Engine ───────────────────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <svg class="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
            <h2 class="text-sm font-bold text-gray-900">Pricing Engine</h2>
            <p class="text-xs text-gray-500">Controls the USD → ZAR pricing formula applied to all products.</p>
        </div>
    </div>

    @foreach([
        ['key'=>'exchange_rate',  'label'=>'Exchange Rate (USD → ZAR)', 'req'=>true,  'step'=>'0.01', 'hint'=>'e.g. 17.50'],
        ['key'=>'markup_rate',    'label'=>'Markup Rate',                'req'=>true,  'step'=>'0.01', 'hint'=>'e.g. 0.7 = 70% of cost as markup'],
        ['key'=>'customs_duty',   'label'=>'Customs Duty (%)',           'req'=>true,  'step'=>'0.1',  'hint'=>'Applied to USD cost before markup'],
        ['key'=>'tax_rate',       'label'=>'VAT / Tax Rate (%)',         'req'=>true,  'step'=>'0.1',  'hint'=>'South Africa: 15%'],
        ['key'=>'price_rounding', 'label'=>'Price Rounding (ZAR)',       'req'=>false, 'step'=>'1',    'hint'=>'Round to nearest e.g. 5'],
    ] as $f)
    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                @if($f['req'])<span class="text-red-500 mr-0.5">*</span>@endif{{ $f['label'] }}
            </label>
        </div>
        <div class="flex-1">
            <input wire:model="data.turn14.{{ $f['key'] }}" type="number" step="{{ $f['step'] }}"
                class="w-40 rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
            @if($f['hint'])<p class="mt-1 text-xs text-gray-400">{{ $f['hint'] }}</p>@endif
        </div>
    </div>
    @endforeach
</div>

{{-- ── Shipping & Freight ───────────────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <svg class="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
        </svg>
        <div>
            <h2 class="text-sm font-bold text-gray-900">Shipping &amp; Freight</h2>
            <p class="text-xs text-gray-500">Global freight parameters used in the landed cost calculation.</p>
        </div>
    </div>

    @foreach([
        ['key'=>'freight_discount',   'label'=>'Freight Discount (%)',       'req'=>true,  'step'=>'0.1', 'hint'=>'Discount on freight invoice (default: 50)'],
        ['key'=>'fuel_surcharge',     'label'=>'Fuel Surcharge (%)',         'req'=>true,  'step'=>'0.1', 'hint'=>'Applied after discount (default: 48)'],
        ['key'=>'disbursement_rate',  'label'=>'Disbursement Fee Rate (%)',  'req'=>false, 'step'=>'0.1', 'hint'=>'% of product cost (default: 4)'],
        ['key'=>'disbursement_min',   'label'=>'Disbursement Fee Min (ZAR)', 'req'=>false, 'step'=>'1',   'hint'=>'Minimum disbursement fee (default: R105)'],
        ['key'=>'ltl_shipping_cost',  'label'=>'LTL Shipping Cost (ZAR)',   'req'=>false, 'step'=>'1',   'hint'=>'Flat surcharge for LTL products (default: R1000)'],
        ['key'=>'weight_inflation',   'label'=>'Weight Inflation (%)',       'req'=>false, 'step'=>'1',   'hint'=>'Applied to billable weight (default: 10)'],
    ] as $f)
    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                @if($f['req'])<span class="text-red-500 mr-0.5">*</span>@endif{{ $f['label'] }}
            </label>
        </div>
        <div class="flex-1">
            <input wire:model="data.turn14.{{ $f['key'] }}" type="number" step="{{ $f['step'] }}"
                class="w-40 rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
            @if($f['hint'])<p class="mt-1 text-xs text-gray-400">{{ $f['hint'] }}</p>@endif
        </div>
    </div>
    @endforeach
</div>

{{-- ── Yoco Payment Gateway ─────────────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <svg class="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
        </svg>
        <div>
            <h2 class="text-sm font-bold text-gray-900">Yoco Payment Gateway</h2>
            <p class="text-xs text-gray-500">Keys from your Yoco dashboard. Use <code class="bg-gray-100 px-1 rounded">sk_test_</code> for staging.</p>
        </div>
    </div>

    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700"><span class="text-red-500 mr-0.5">*</span>Public Key</label>
        </div>
        <div class="flex-1">
            <input wire:model="data.yoco.public_key" type="text" autocomplete="off"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="pk_live_..." />
        </div>
    </div>
    <div class="flex items-start gap-4 px-6 py-4">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700"><span class="text-red-500 mr-0.5">*</span>Secret Key</label>
        </div>
        <div class="flex-1">
            <input wire:model="data.yoco.secret_key" type="password" autocomplete="off"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="sk_live_..." />
        </div>
    </div>
</div>


</form>
</x-filament-panels::page>
