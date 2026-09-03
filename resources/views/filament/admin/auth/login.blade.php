<x-filament-panels::layout.base :livewire="$livewire">
<style>
    html, body { margin: 0; padding: 0; min-height: 100vh; }
    .ppsa-login { display: flex; min-height: 100vh; width: 100%; }

    /* ── Left panel ── */
    .ppsa-login__left {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 42%;
        flex-shrink: 0;
        padding: 3rem;
        position: relative;
        overflow: hidden;
        background: #0E1A10;
    }
    @media (min-width: 1024px) { .ppsa-login__left { display: flex; } }

    .ppsa-login__car {
        position: absolute; inset: 0;
        pointer-events: none; opacity: 0.07;
    }
    .ppsa-login__car img {
        position: absolute; bottom: 0; right: 0;
        width: 100%; height: auto;
        object-fit: contain; object-position: right bottom;
    }

    /* ── Right panel ── */
    .ppsa-login__right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem 2rem;
        background: #fff;
    }
    @media (min-width: 640px)  { .ppsa-login__right { padding: 2rem 4rem; } }
    @media (min-width: 1024px) { .ppsa-login__right { padding: 2rem 5rem; } }

    .ppsa-form-inner { max-width: 22rem; width: 100%; }

    /* Strip Filament's default input chrome and apply our underline style */
    .ppsa-login__right .fi-input-wrp {
        background: transparent !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
        ring: none !important;
        outline: none !important;
        border-bottom: 2px solid #E4E8E9 !important;
        padding: 1.25rem 0 0.5rem !important;
        transition: border-color 150ms !important;
    }
    .ppsa-login__right .fi-input-wrp:focus-within {
        border-bottom-color: #16a34a !important;
    }
    .ppsa-login__right .fi-input {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        font-size: 0.875rem !important;
        color: #0D1F35 !important;
        outline: none !important;
        ring: 0 !important;
    }
    .ppsa-login__right .fi-fo-field-wrp-label .fi-label {
        font-size: 0.75rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        color: #6E7F96 !important;
    }
    .ppsa-login__right .fi-btn-color-primary {
        width: 100% !important;
        justify-content: center !important;
        background: #16a34a !important;
        border-color: #16a34a !important;
        border-radius: 0.75rem !important;
        padding: 0.875rem 1.5rem !important;
        font-weight: 700 !important;
        font-size: 0.875rem !important;
    }
    .ppsa-login__right .fi-btn-color-primary:hover {
        background: #15803d !important;
    }
    /* Hide "Remember me" checkbox label styling */
    .ppsa-login__right .fi-checkbox-label { font-size: 0.75rem !important; color: #6E7F96 !important; }
    /* Section spacing */
    .ppsa-login__right .fi-fo-field-wrp { margin-bottom: 1.5rem; }
    /* Error messages */
    .ppsa-login__right .fi-fo-field-wrp-validation-messages p { font-size: 0.75rem !important; }
</style>

<div class="ppsa-login">

    {{-- ── Left panel ─────────────────────────────────────────────────── --}}
    <div class="ppsa-login__left">
        <div class="ppsa-login__car" aria-hidden="true">
            <img src="/images/car-trace.webp" alt="" draggable="false">
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
            <h2 class="text-white font-black leading-tight mb-4" style="font-size:2.25rem">
                Admin panel.<br>
                <span style="color:#4ade80">Stay in control.</span>
            </h2>
            <p class="text-sm leading-relaxed mb-10 max-w-xs" style="color:#9ca3af">
                Manage orders, products, pricing, integrations and vehicle fitment for the PPSA store.
            </p>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.75rem">
                @foreach(['Orders & customer management', 'Turn14 catalogue & pricing', 'Vehicle fitment & alerts', 'Shipping & payment settings'] as $item)
                <li style="display:flex;align-items:flex-start;gap:0.75rem">
                    <div style="width:1rem;height:1rem;border-radius:9999px;background:#16a34a;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:0.125rem">
                        <svg width="10" height="10" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                        </svg>
                    </div>
                    <span style="color:#9ca3af;font-size:0.875rem">{{ $item }}</span>
                </li>
                @endforeach
            </ul>
        </div>

        <p style="color:#4b5563;font-size:0.75rem;position:relative;z-index:10">
            Admin access only. Unauthorised access is prohibited.
        </p>
    </div>

    {{-- ── Right panel ─────────────────────────────────────────────────── --}}
    <div class="ppsa-login__right">

        {{-- Mobile logo --}}
        <a href="/" class="flex items-center gap-3 mb-10" style="display:flex;align-items:center;gap:0.75rem;margin-bottom:2.5rem" id="mobile-logo">
            <div style="width:2.25rem;height:2.25rem;border-radius:0.5rem;background:#16a34a;display:flex;align-items:center;justify-content:center">
                <span style="color:white;font-weight:900;font-size:0.875rem">PP</span>
            </div>
            <div style="font-weight:900;font-size:0.875rem;color:#0D1F35">Performance Products SA</div>
        </a>
        <style>@media(min-width:1024px){#mobile-logo{display:none!important}}</style>

        <div class="ppsa-form-inner">

            {{-- Heading --}}
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.25rem">
                <div style="width:2rem;height:2rem;border-radius:0.5rem;background:#f0fdf4;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <svg width="16" height="16" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                    </svg>
                </div>
                <h1 style="font-size:1.5rem;font-weight:900;color:#0D1F35;margin:0">Admin sign in</h1>
            </div>
            <p style="font-size:0.875rem;color:#6E7F96;margin:0 0 2rem">
                Admin accounts only. Customer accounts cannot access this area.
            </p>

            {{-- Filament's form (handles auth, CSRF, Livewire) --}}
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
</x-filament-panels::layout.base>
