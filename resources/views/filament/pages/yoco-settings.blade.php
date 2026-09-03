<x-filament-panels::page>
<form wire:submit.prevent="save" class="space-y-0">

{{-- ── Yoco Payment Gateway ──────────────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <svg class="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
        </svg>
        <div>
            <h2 class="text-sm font-bold text-gray-900">Yoco Payment Gateway</h2>
            <p class="text-xs text-gray-500">API keys from your Yoco business dashboard. Use <code class="bg-gray-100 px-1 rounded">sk_test_</code> / <code class="bg-gray-100 px-1 rounded">pk_test_</code> for staging.</p>
        </div>
    </div>

    {{-- Public Key --}}
    <div class="flex items-start gap-4 px-6 py-4 border-b border-gray-100">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                <span class="text-red-500 mr-0.5">*</span>Public Key
            </label>
            <p class="text-xs text-gray-400 mt-0.5">Used client-side (safe to expose)</p>
        </div>
        <div class="flex-1">
            <input wire:model="data.yoco.public_key" type="text" autocomplete="off"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="pk_live_..." />
        </div>
    </div>

    {{-- Secret Key --}}
    <div class="flex items-start gap-4 px-6 py-4">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">
                <span class="text-red-500 mr-0.5">*</span>Secret Key
            </label>
            <p class="text-xs text-gray-400 mt-0.5">Keep secret — server-side only</p>
        </div>
        <div class="flex-1">
            <input wire:model="data.yoco.secret_key" type="password" autocomplete="off"
                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="sk_live_..." />
            <p class="mt-1 text-xs text-gray-400">Never expose this key in frontend code or version control.</p>
        </div>
    </div>
</div>

{{-- ── Webhook URL ────────────────────────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <svg class="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
        </svg>
        <div>
            <h2 class="text-sm font-bold text-gray-900">Webhook Configuration</h2>
            <p class="text-xs text-gray-500">Configure this URL in your Yoco dashboard under Developers → Webhooks so Yoco can confirm payments server-to-server.</p>
        </div>
    </div>
    <div class="flex items-start gap-4 px-6 py-4">
        <div class="w-56 shrink-0 pt-1 text-right">
            <label class="text-sm font-medium text-gray-700">Webhook URL</label>
            <p class="text-xs text-gray-400 mt-0.5">Copy into Yoco dashboard</p>
        </div>
        <div class="flex-1">
            <div class="flex items-center gap-2">
                @php $webhookUrl = config('app.url') . '/checkout/webhook/yoco'; @endphp
                <code class="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-800 select-all">
                    {{ $webhookUrl }}
                </code>
                <button type="button" onclick="navigator.clipboard.writeText('{{ $webhookUrl }}')"
                    class="shrink-0 px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Copy
                </button>
            </div>
            <p class="mt-1 text-xs text-gray-400">In Yoco, select events: <strong>payment.succeeded</strong> and <strong>checkout.complete</strong>.</p>
        </div>
    </div>
</div>

{{-- ── Info box ──────────────────────────────────────────────────────────── --}}
<div class="flex items-start gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl mb-6 text-sm text-blue-800">
    <svg class="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
    </svg>
    <p>The store uses Yoco's <strong>hosted checkout redirect flow</strong> — customers are taken to Yoco's secure page to pay and returned on success or failure. No Yoco JS SDK is required.</p>
</div>

{{-- ── Save button ────────────────────────────────────────────────────────── --}}
<div class="flex justify-end py-2">
    <button type="submit"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
        </svg>
        Save
    </button>
</div>

</form>
</x-filament-panels::page>
