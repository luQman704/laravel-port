<x-filament-panels::page.simple>
{{-- ───────────────────────────────────────────────────────────────────────
     PPSA Admin Login — matches the storefront login visual language
     ─────────────────────────────────────────────────────────────────────── --}}
<style>
    /* Override Filament's simple-page centering wrapper so we can go full-bleed */
    .fi-simple-main {
        padding: 0 !important;
        max-width: 100vw !important;
        width: 100vw !important;
        min-height: 100vh !important;
        display: flex !important;
        align-items: stretch !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
    }
    .fi-simple-layout {
        background: #fff !important;
        padding: 0 !important;
        min-height: 100vh !important;
        align-items: stretch !important;
    }
    /* Float-label inputs */
    .ppsa-float { position: relative; }
    .ppsa-float input {
        width: 100%;
        background: transparent;
        border: none;
        border-bottom: 2px solid #E4E8E9;
        border-radius: 0;
        padding: 1.25rem 0 0.5rem;
        font-size: 0.875rem;
        color: #0D1F35;
        outline: none;
        transition: border-color 150ms;
        box-shadow: none !important;
        ring: none !important;
    }
    .ppsa-float input:focus { border-bottom-color: #16a34a; }
    .ppsa-float input.has-error { border-bottom-color: #f87171; }
    .ppsa-float label {
        position: absolute;
        left: 0;
        font-size: 0.875rem;
        color: #6E7F96;
        pointer-events: none;
        transition: all 150ms;
        top: 1rem;
    }
    .ppsa-float input:focus ~ label,
    .ppsa-float input:not(:placeholder-shown) ~ label {
        top: 0;
        font-size: 0.625rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #16a34a;
    }
    .ppsa-float input:focus ~ label { color: #16a34a; }
    .ppsa-float input.has-error ~ label { color: #f87171!important; }
    .ppsa-error { margin-top: 0.375rem; font-size: 0.75rem; color: #ef4444; }
    /* Hide Filament's default form chrome */
    .fi-simple-main > * { width: 100% !important; }
</style>

<div class="flex min-h-screen w-full">

    {{-- ── Left panel ──────────────────────────────────────────────────── --}}
    <div class="hidden lg:flex flex-col justify-between w-[42%] shrink-0 p-12 relative overflow-hidden"
         style="background:#0E1A10">

        {{-- Car trace watermark --}}
        <div class="absolute inset-0 pointer-events-none opacity-[0.07]" aria-hidden="true">
            <img src="/images/car-trace.webp" alt=""
                 class="absolute bottom-0 right-0 w-full h-auto object-contain object-right-bottom"
                 draggable="false">
        </div>

        {{-- Logo --}}
        <a href="/" class="flex items-center gap-3 relative z-10">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                 style="background:#16a34a">
                <span class="text-white font-black tracking-tight text-sm">PP</span>
            </div>
            <div>
                <div class="text-white font-black text-base tracking-tight leading-tight">Performance Products</div>
                <div class="text-xs uppercase tracking-widest font-semibold" style="color:#4ade80">South Africa</div>
            </div>
        </a>

        {{-- Body --}}
        <div class="relative z-10">
            <h2 class="text-white font-black text-4xl leading-tight mb-4">
                Admin panel.<br>
                <span style="color:#4ade80">Stay in control.</span>
            </h2>
            <p class="text-sm leading-relaxed mb-10 max-w-xs" style="color:#9ca3af">
                Manage orders, products, pricing, integrations and vehicle fitment for the PPSA store.
            </p>

            <ul class="space-y-3">
                @foreach(['Orders & customer management', 'Turn14 catalogue & pricing', 'Vehicle fitment & alerts', 'Shipping &amp; payment settings'] as $item)
                <li class="flex items-start gap-3">
                    <div class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                         style="background:#16a34a">
                        <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor"
                             stroke-width="3" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                        </svg>
                    </div>
                    <span class="text-sm" style="color:#9ca3af">{!! $item !!}</span>
                </li>
                @endforeach
            </ul>
        </div>

        <p class="text-xs relative z-10" style="color:#4b5563">Admin access only. Unauthorised access is prohibited.</p>
    </div>

    {{-- ── Right panel (form) ──────────────────────────────────────────── --}}
    <div class="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white">

        {{-- Mobile logo --}}
        <a href="/" class="flex items-center gap-3 mb-12 lg:hidden">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background:#16a34a">
                <span class="text-white font-black text-sm">PP</span>
            </div>
            <div class="font-black text-sm" style="color:#0D1F35">Performance Products SA</div>
        </a>

        <div class="max-w-sm w-full">
            {{-- Shield icon + heading --}}
            <div class="flex items-center gap-3 mb-1">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                     style="background:#f0fdf4">
                    <svg class="w-4 h-4" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                    </svg>
                </div>
                <h1 class="text-2xl font-black" style="color:#0D1F35">Admin sign in</h1>
            </div>
            <p class="text-sm mb-8" style="color:#6E7F96">Admin accounts only. Regular customer accounts cannot access this area.</p>

            {{-- Filament form errors --}}
            @if ($errors->any())
            <div class="mb-6 px-4 py-3 rounded-xl border text-sm"
                 style="background:#fef2f2;border-color:#fecaca;color:#dc2626">
                @foreach ($errors->all() as $error)
                    <p>{{ $error }}</p>
                @endforeach
            </div>
            @endif

            {{-- Filament's actual login form (handles wire:submit, CSRF, etc.) --}}
            <form wire:submit="authenticate" class="space-y-8">
                {{ $this->form }}

                <button
                    type="submit"
                    wire:loading.attr="disabled"
                    class="w-full text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                    style="background:#16a34a"
                    onmouseover="this.style.background='#15803d'"
                    onmouseout="this.style.background='#16a34a'"
                >
                    <span wire:loading.remove>Sign in to Admin</span>
                    <span wire:loading>Signing in…</span>
                </button>
            </form>

            {{-- Back to store --}}
            <div class="mt-8 pt-8 text-center" style="border-top:1px solid #E4E8E9">
                <a href="/" class="text-sm font-semibold" style="color:#6E7F96">
                    ← Back to store
                </a>
            </div>
        </div>
    </div>

</div>
</x-filament-panels::page.simple>
