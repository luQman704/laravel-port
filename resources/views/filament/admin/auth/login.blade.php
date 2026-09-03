<x-filament-panels::page.simple>
{{-- ── Force the Filament simple-layout to go full-bleed ───────────────── --}}
<style>
    .fi-simple-layout {
        display: block !important;
        padding: 0 !important;
        min-height: 100vh !important;
    }
    .fi-simple-main-ctn {
        display: block !important;
        padding: 0 !important;
    }
    .fi-simple-main {
        all: unset !important;
        display: block !important;
        width: 100% !important;
        min-height: 100vh !important;
    }
    .fi-simple-page {
        all: unset !important;
        display: block !important;
        width: 100% !important;
        min-height: 100vh !important;
    }

    /* ── Two-panel layout ── */
    .ppsa-wrap { display: flex; min-height: 100vh; width: 100%; background: #fff; }

    .ppsa-left {
        display: none;
        width: 42%;
        flex-shrink: 0;
        flex-direction: column;
        justify-content: space-between;
        padding: 3rem;
        position: relative;
        overflow: hidden;
        background: #0E1A10;
    }
    @media (min-width: 1024px) { .ppsa-left { display: flex; } }

    .ppsa-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
        background: #fff;
    }
    @media (min-width: 640px)  { .ppsa-right { padding: 2rem 4rem; } }
    @media (min-width: 1024px) { .ppsa-right { padding: 2rem 5rem; } }

    .ppsa-inner { max-width: 22rem; width: 100%; }

    /* ── Form field underline style ── */
    .ppsa-right .fi-input-wrp {
        background: transparent !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
        border-bottom: 2px solid #E4E8E9 !important;
        padding: 1.25rem 0 0.5rem !important;
        transition: border-color 150ms !important;
    }
    .ppsa-right .fi-input-wrp:focus-within {
        border-bottom-color: #16a34a !important;
    }
    .ppsa-right .fi-input {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        padding: 0 !important;
        font-size: 0.875rem !important;
        color: #0D1F35 !important;
    }
    .ppsa-right .fi-fo-field-wrp-label .fi-label {
        font-size: 0.625rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        color: #6E7F96 !important;
    }
    .ppsa-right .fi-fo-field-wrp { margin-bottom: 1.5rem; }
    /* Submit button */
    .ppsa-right .fi-btn-color-primary {
        width: 100% !important;
        justify-content: center !important;
        background: #16a34a !important;
        border-color: #16a34a !important;
        border-radius: 0.75rem !important;
        padding: 0.875rem 1.5rem !important;
        font-weight: 700 !important;
        font-size: 0.875rem !important;
        color: #fff !important;
    }
    .ppsa-right .fi-btn-color-primary:hover { background: #15803d !important; }
    /* Checkbox label */
    .ppsa-right .fi-checkbox-label { font-size: 0.75rem !important; color: #6E7F96 !important; }
</style>

<div class="ppsa-wrap">

    {{-- ── Left panel ── --}}
    <div class="ppsa-left">
        {{-- Car-trace watermark --}}
        <div style="position:absolute;inset:0;pointer-events:none;opacity:0.07" aria-hidden="true">
            <img src="/images/car-trace.webp" alt="" draggable="false"
                 style="position:absolute;bottom:0;right:0;width:100%;height:auto;object-fit:contain;object-position:right bottom">
        </div>

        {{-- Logo --}}
        <a href="/" style="display:flex;align-items:center;gap:0.75rem;position:relative;z-index:10;text-decoration:none">
            <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:#16a34a;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <span style="color:#fff;font-weight:900;letter-spacing:-0.025em;font-size:0.875rem">PP</span>
            </div>
            <div>
                <div style="color:#fff;font-weight:900;font-size:0.9375rem;letter-spacing:-0.015em;line-height:1.2">Performance Products</div>
                <div style="color:#4ade80;font-size:0.6875rem;text-transform:uppercase;letter-spacing:0.1em;font-weight:700">South Africa</div>
            </div>
        </a>

        {{-- Copy --}}
        <div style="position:relative;z-index:10">
            <h2 style="color:#fff;font-weight:900;font-size:2.25rem;line-height:1.1;margin:0 0 1rem">
                Admin panel.<br>
                <span style="color:#4ade80">Stay in control.</span>
            </h2>
            <p style="color:#9ca3af;font-size:0.875rem;line-height:1.6;margin:0 0 2.5rem;max-width:18rem">
                Manage orders, products, pricing, integrations and vehicle fitment for the PPSA store.
            </p>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.75rem">
                @foreach(['Orders & customer management','Turn14 catalogue & pricing','Vehicle fitment & alerts','Shipping & payment settings'] as $item)
                <li style="display:flex;align-items:flex-start;gap:0.75rem">
                    <div style="width:1rem;height:1rem;min-width:1rem;border-radius:9999px;background:#16a34a;display:flex;align-items:center;justify-content:center;margin-top:0.125rem">
                        <svg width="10" height="10" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                        </svg>
                    </div>
                    <span style="color:#9ca3af;font-size:0.875rem">{{ $item }}</span>
                </li>
                @endforeach
            </ul>
        </div>

        <p style="color:#4b5563;font-size:0.6875rem;position:relative;z-index:10">
            Admin access only. Unauthorised access is prohibited.
        </p>
    </div>

    {{-- ── Right panel ── --}}
    <div class="ppsa-right">

        {{-- Mobile logo --}}
        <a href="/" class="ppsa-mobile-logo" style="display:flex;align-items:center;gap:0.75rem;margin-bottom:2.5rem;text-decoration:none">
            <div style="width:2.25rem;height:2.25rem;border-radius:0.5rem;background:#16a34a;display:flex;align-items:center;justify-content:center">
                <span style="color:#fff;font-weight:900;font-size:0.875rem">PP</span>
            </div>
            <div style="font-weight:900;font-size:0.9375rem;color:#0D1F35">Performance Products SA</div>
        </a>
        <style>@media(min-width:1024px){.ppsa-mobile-logo{display:none!important}}</style>

        <div class="ppsa-inner">
            {{-- Heading --}}
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.25rem">
                <div style="width:2rem;height:2rem;border-radius:0.5rem;background:#f0fdf4;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <svg width="16" height="16" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                    </svg>
                </div>
                <h1 style="font-size:1.5rem;font-weight:900;color:#0D1F35;margin:0;line-height:1">Admin sign in</h1>
            </div>
            <p style="font-size:0.875rem;color:#6E7F96;margin:0 0 2rem">
                Admin accounts only. Customer accounts cannot access this area.
            </p>

            <form wire:submit="authenticate">
                {{ $this->form }}
                <x-filament-panels::form.actions
                    :actions="$this->getCachedFormActions()"
                    :full-width="true"
                />
            </form>

            <div style="margin-top:2rem;padding-top:2rem;border-top:1px solid #E4E8E9;text-align:center">
                <a href="/" style="font-size:0.875rem;font-weight:600;color:#6E7F96;text-decoration:none">
                    ← Back to store
                </a>
            </div>
        </div>
    </div>

</div>
</x-filament-panels::page.simple>
