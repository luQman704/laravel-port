# PPSA — Performance Products SA (Laravel Rebuild)

This is the Laravel 11 rebuild of the Performance Products SA PrestaShop store.
It replaces PrestaShop 9.0.2 with a purpose-built Laravel application.

## Project Overview

**Goal:** Full PrestaShop replacement — same Turn14 ghost product system, vehicle
filtering, pricing engine, and stock sync — with a modern React frontend.

**Live PS system (reference for porting):** `/Users/lukmonawoyemi/Documents/prestashop`
**This project:** `/Users/lukmonawoyemi/Documents/laravel-proposal/app`

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Laravel 11 | PHP 8.2+ |
| Frontend bridge | Inertia.js v3 | No separate API — controllers return props to React |
| Frontend UI | **React** (NOT Vue) | JSX files in `resources/js/` |
| Admin panel | Filament 3 | Blade + Alpine.js — replaces all 16 PS admin tabs |
| CSS | Tailwind CSS v4 | PPSA Design System tokens in `resources/css/app.css` |
| Search | Laravel Scout | MySQL driver now; Meilisearch later |
| Queue | Laravel Horizon | Redis-backed; replaces raw cron PHP scripts |
| Auth | Laravel Breeze | + Socialite for social login |
| Database | MySQL 8 | Same DB as PS installation — Turn14 tables shared during transition |
| Caching | Redis | Cart, sessions, query cache |

---

## Directory Structure

```
app/
├── app/
│   ├── Http/Controllers/
│   │   ├── Shop/               # Storefront: Home, Category, Product, Search
│   │   ├── Cart/               # Cart + Checkout
│   │   └── Account/            # Auth, Garage, Orders, Alerts
│   ├── Services/
│   │   ├── Turn14/
│   │   │   ├── CatalogService.php      # Ghost product queries
│   │   │   ├── PricingService.php      # USD→ZAR pricing formula
│   │   │   ├── StockService.php        # Stock reads + alert triggers
│   │   │   ├── ApiClient.php           # Turn14 REST API wrapper
│   │   │   └── SyncEngine.php          # Sync logic
│   │   ├── VehicleFilterService.php    # Make/Model/Year/Engine
│   │   ├── CartService.php             # Session/DB cart
│   │   └── ShippingService.php         # Courier Guy (ShipLogic)
│   ├── Models/
│   │   ├── Turn14Product.php           # new902_turn14_product
│   │   ├── Turn14Stock.php             # new902_turn14_stock
│   │   ├── Turn14Brand.php             # new902_turn14_brand
│   │   ├── Turn14VehicleFilter.php     # new902_turn14_vehicle_filter
│   │   ├── Turn14EngineFilter.php      # new902_turn14_engine_filter
│   │   ├── Turn14CustomerGarage.php    # new902_turn14_customer_garage
│   │   ├── Turn14StockAlert.php        # new902_turn14_stock_alerts
│   │   ├── Turn14DutyOverride.php      # new902_turn14_duty_override
│   │   └── Turn14WeightRange.php       # new902_turn14_weight_range
│   ├── Jobs/
│   │   ├── SyncBrandsJob.php
│   │   ├── SyncProductsJob.php
│   │   ├── SyncStockDeltaJob.php
│   │   ├── SyncStockFullJob.php
│   │   ├── SyncDiscontinueJob.php
│   │   └── SendStockAlertJob.php
│   └── Filament/Resources/     # Admin panel (one resource per section)
├── resources/
│   ├── js/
│   │   ├── app.jsx             # Inertia + React bootstrap
│   │   ├── Pages/              # One .jsx per route
│   │   │   ├── Home.jsx
│   │   │   ├── Browse.jsx
│   │   │   ├── Category.jsx
│   │   │   ├── Product.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Vehicles.jsx
│   │   │   ├── VehicleDetail.jsx
│   │   │   ├── Engines.jsx
│   │   │   ├── EngineDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Auth/Login.jsx
│   │   │   ├── Auth/Register.jsx
│   │   │   └── Account/Dashboard.jsx, Garage.jsx, Orders.jsx, OrderDetail.jsx
│   │   ├── Components/         # Reusable React components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductListRow.jsx
│   │   │   ├── ViewControls.jsx
│   │   │   ├── SearchOverlay.jsx
│   │   │   └── ...
│   │   └── Layouts/
│   │       ├── MainLayout.jsx  # Nav + footer for all shop pages
│   │       └── AccountLayout.jsx
│   ├── css/app.css             # Tailwind v4 + PPSA Design System tokens
│   └── views/app.blade.php     # Root Inertia HTML shell (Google Fonts loaded here)
├── routes/web.php              # Shop routes (Inertia)
└── config/turn14.php           # Turn14 API + pricing config
```

---

## PPSA Design System

**This is the authoritative design spec. Always follow it exactly.**

### Fonts

Loaded in `resources/views/app.blade.php` via Google Fonts:
`Inter:wght@400;500;600 + Space+Grotesk:wght@500;600;700 + JetBrains+Mono:wght@400;600`

| Token | Font | Use |
|-------|------|-----|
| `--font-sans` | Space Grotesk | Headings, display (`t-h1`, `t-h2`, `t-h3`, `t-display`) |
| `--font-body` | Inter | All body copy, labels, UI text (default via `body {}`) |
| `--font-mono` | JetBrains Mono | Prices (`t-price`), part numbers (`t-partno`) |

### Type Scale Classes

Use these classes from `resources/css/app.css`:

```
.t-display  Space Grotesk 700  3.5rem   letter-spacing -0.03em
.t-h1       Space Grotesk 700  2.25rem  letter-spacing -0.025em
.t-h2       Space Grotesk 600  1.625rem letter-spacing -0.02em
.t-h3       Space Grotesk 600  1.125rem letter-spacing -0.01em
.t-body     Inter         400  1rem
.t-small    Inter         400  0.875rem
.t-label    Inter         500  0.75rem  (NO uppercase — never add text-transform)
.t-partno   JetBrains     400  0.8125rem
.t-price    JetBrains     600  1.125rem letter-spacing -0.02em
```

### Color Tokens

All defined in `@theme {}` in `resources/css/app.css`:

```
sector-600    #16a34a   Primary brand green — buttons, active states, prices
sector-50/100/200/300/400/500/700/800/900  — tints
pitlane       #0D1F35   Primary text (headings, strong UI elements)
pitlane-80    #243a55
pitlane-60    #3d5577   Body copy, secondary text
pitlane-30    #8ca3bc
pitlane-10    #e8edf3
alloy         #6E7F96   Metadata, counts, labels, helper text
alloy-light   #BCC8D8   Faint text, placeholders, part numbers on cards
alloy-faint   #EDF0F4
asphalt       #E4E8E9   Default borders, dividers
asphalt-dark  #C8CDD0   Focused/hover borders on inputs
grid          #F6F7F5   Warm off-white — default page background
cloud         #F0F1F5   Cool light grey — alternate section background
forest        #1A2B1D   Dark charcoal-green footer
titanium      #C8973A   Premium accent (use sparingly)
```

`brand-*` is a legacy alias for `sector-*`. Always use `sector-*` in new code.

### Text Color Hierarchy (apply strictly)

1. `text-pitlane` — page headings, primary UI labels
2. `text-pitlane-60` — body copy paragraphs
3. `text-alloy` — metadata, counts, brand names, helper text
4. `text-alloy-light` — placeholder text, part numbers on cards, empty icons

### Section Background Alternation

Three backgrounds alternate for visual rhythm — **never use dark sections on storefront**:
- `bg-grid` (#F6F7F5 warm) — hero, Why PPSA sections
- `bg-white` — brand strip, category, product lists
- `bg-cloud` (#F0F1F5 cool) — stage system, alternate content sections

### Card & Hover Rules

- **Default border:** `border-asphalt`
- **Hover:** `hover:border-sector-300 transition-all duration-200` — border color shift ONLY
- **Never** `hover:shadow-md` or any shadow lift on cards
- **Radius:** `rounded-xl` for cards, `rounded-lg` for inner elements

### Design Anti-Patterns (never do these)

- ALL-CAPS labels — `.t-label` has no `text-transform`; don't add it
- Arrow-suffixed prose links — "Browse →" → just "Browse". SVG chevrons OK on nav rows.
- Middle-dot separators in body copy
- Numbered markers unless content is genuinely sequential
- Dark background (`bg-pitlane`) sections on storefront — rejected as "AI content" look
- Identical rounded cards with the same shadow for every section — vary by content hierarchy
- `hover:shadow-md` on any card/row

### Input Fields

```jsx
className="border border-asphalt-dark focus:ring-sector-500 focus:border-sector-500 rounded-lg"
```

### Active / Selected States

- Active tab: `bg-sector-600 text-white`
- Active filter badge: `bg-sector-50 text-sector-700`
- Status badge (neutral): `bg-asphalt text-pitlane-60`

---

## Footer

```jsx
<footer style={{ background: '#1A2B1D', borderTop: '1px solid #243828' }} className="text-gray-400">
```
Logo badge: `bg-sector-600` solid green. Link hover: `hover:text-sector-400`.

---

## Database — Shared with PrestaShop

During development, this app reads the **existing PS MySQL database**.
The Turn14 tables are shared — no migration required for them.

```env
DB_PREFIX=new902_
DB_DATABASE=<same as PS>
```

All Eloquent models set `protected $table = 'new902_turn14_product'` etc.
PS `new902_` prefixed tables are read-only. New Laravel tables use no prefix.

---

## Pricing Formula (port exactly from Turn14PriceEngine.php in the PS project)

```
USD cost
  × exchange rate            (config turn14.exchange_rate)
  × (1 + customs duty %)    (per-brand override via Turn14DutyOverride model)
  × (1 + markup %)          (config turn14.markup_rate)
  + shipping cost            (Turn14WeightRange lookup by product weight kg)
  × (1 + fuel surcharge %)  (config turn14.fuel_surcharge)
  + disbursement fee         (max of % or minimum ZAR)
  × (1 + VAT %)             (config turn14.tax_rate — 15%)
= Display price (ZAR, tax-inclusive)
```

---

## Inertia Pattern

```php
// Controller
return Inertia::render('Product', [
    'product' => $product,
    'price'   => $price,
]);
```

```jsx
// resources/js/Pages/Product.jsx
export default function Product({ product, price }) {
    return <MainLayout>...</MainLayout>;
}
```

Never return JSON from shop controllers — Inertia handles serialisation.
Use `router.visit()` for navigation, `useForm()` for forms.

---

## Admin — Filament 3

Mounted at `/admin`. Scaffold resources with:
```sh
php artisan make:filament-resource Turn14Product --generate
```

---

## Background Jobs — Horizon

```php
// routes/console.php
Schedule::job(new SyncStockDeltaJob)->everyTwoHours();
Schedule::job(new SyncProductsJob)->dailyAt('01:00');
Schedule::job(new SyncBrandsJob)->weekly();
```

Monitor at `/horizon` (admin-gated).

---

## Coding Conventions

- PHP: PSR-12, full type hints, no raw SQL — use Eloquent or Query Builder
- React: functional components only, no class components
- File names: PascalCase React (`ProductCard.jsx`), snake_case PHP
- Tailwind: use design tokens (`sector-600`), never hardcoded hex colours in className
- No `api.php` routes for Inertia pages — only for third-party webhooks and `/api/search/quick`
- Do **not** use Bootstrap classes. Do **not** use jQuery.

---

## Phase 1 Scope (current focus)

1. Eloquent models for all Turn14 tables
2. `Turn14CatalogService` — product listing, search, categories
3. `Turn14PricingService` — port of Turn14PriceEngine.php
4. `VehicleFilterService` — Make/Model/Year cascading
5. React pages: Home, Browse, Category, Product, Search
6. `MainLayout.jsx` — nav, vehicle selector, garage icon, cart icon
7. Session cart + add-to-cart
8. Checkout + Yoco payment
9. Order placement + confirmation email
10. Laravel Scheduler for sync jobs

Phase 2+ (garage, alerts, PayPal, Courier Guy, Filament admin) starts after Phase 1 ships.
