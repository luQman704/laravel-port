<x-filament-panels::page>
<form wire:submit.prevent="save" class="space-y-0">

{{-- ── Account / API ─────────────────────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <svg class="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
        </svg>
        <div>
            <h2 class="text-sm font-bold text-gray-900">Account</h2>
            <p class="text-xs text-gray-500">ShipLogic API credentials for The Courier Guy integration.</p>
        </div>
    </div>

    {{-- API Key --}}
    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                <span class="text-red-500 mr-0.5">*</span>API Key
            </label>
            <p class="text-xs text-gray-400 mt-0.5">ShipLogic API token</p>
        </div>
        <div class="flex-1">
            <input wire:model="data.tcg.api_key" type="password" autocomplete="off"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="327a6624b3714257a4ccb3874b19b7cb" />
            <p class="mt-1 text-xs text-gray-400">Get your API key from the ShipLogic / The Courier Guy dashboard.</p>
        </div>
    </div>

    {{-- Email --}}
    <div class="flex items-start gap-4 px-6 py-4">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                <span class="text-red-500 mr-0.5">*</span>Email
            </label>
            <p class="text-xs text-gray-400 mt-0.5">Account / contact email</p>
        </div>
        <div class="flex-1">
            <input wire:model="data.tcg.email" type="email"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="shipping@performanceproducts.co.za" />
        </div>
    </div>
</div>

{{-- ── Shipping Originating Settings ────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <svg class="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <div>
            <h2 class="text-sm font-bold text-gray-900">Shipping Originating Settings</h2>
            <p class="text-xs text-gray-500">The warehouse / dispatch address that The Courier Guy will collect from.</p>
        </div>
    </div>

    @php
    $addressRows = [
        ['key' => 'company_name',   'label' => 'Company Name',    'required' => true,  'placeholder' => 'Performance Products SA', 'hint' => ''],
        ['key' => 'address_line1',  'label' => 'Address Line 1',  'required' => true,  'placeholder' => '4 Hills Street',          'hint' => ''],
        ['key' => 'address_line2',  'label' => 'Address Line 2',  'required' => false, 'placeholder' => 'Rynfield',                 'hint' => ''],
        ['key' => 'city',           'label' => 'Town',            'required' => true,  'placeholder' => 'Benoni',                   'hint' => ''],
        ['key' => 'postal_code',    'label' => 'Postal Code',     'required' => true,  'placeholder' => '1501',                     'hint' => ''],
    ];
    @endphp

    @foreach($addressRows as $row)
    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                @if($row['required'])<span class="text-red-500 mr-0.5">*</span>@endif
                {{ $row['label'] }}
            </label>
        </div>
        <div class="flex-1">
            <input wire:model="data.tcg.{{ $row['key'] }}" type="text"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="{{ $row['placeholder'] }}" />
        </div>
    </div>
    @endforeach

    {{-- Province select --}}
    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                <span class="text-red-500 mr-0.5">*</span>Province
            </label>
            <p class="text-xs text-gray-400 mt-0.5">Select store address province.</p>
        </div>
        <div class="flex-1">
            <select wire:model="data.tcg.province"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white">
                <option value="">Select province…</option>
                @foreach(['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape'] as $p)
                    <option value="{{ $p }}">{{ $p }}</option>
                @endforeach
            </select>
        </div>
    </div>

    {{-- Contact person --}}
    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                <span class="text-red-500 mr-0.5">*</span>Contact Person
            </label>
        </div>
        <div class="flex-1">
            <input wire:model="data.tcg.contact_person" type="text"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="Jennifer Taute" />
        </div>
    </div>

    {{-- Contact phone --}}
    <div class="flex items-start gap-4 px-6 py-4">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                <span class="text-red-500 mr-0.5">*</span>Contact Person Phone
            </label>
        </div>
        <div class="flex-1">
            <input wire:model="data.tcg.contact_phone" type="text"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="011 849 1183" />
        </div>
    </div>
</div>


</form>
</x-filament-panels::page>
