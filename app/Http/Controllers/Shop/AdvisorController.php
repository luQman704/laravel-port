<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\VehicleFilterService;
use App\Services\Turn14\CatalogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdvisorController extends Controller
{
    // Which categories are most relevant per next-stage
    const STAGE_CATEGORIES = [
        1 => ['Air Intake Systems', 'Exhaust, Mufflers & Tips', 'Suspension', 'Brakes, Rotors & Pads', 'Wheels'],
        2 => ['Forced Induction', 'Fuel Delivery', 'Engine Components', 'Exhaust, Mufflers & Tips', 'Suspension'],
        3 => ['Brakes, Rotors & Pads', 'Wheels', 'Exterior Styling', 'Suspension', 'Fabrication'],
        4 => ['Engine Components', 'Drivetrain', 'Forced Induction', 'Fabrication', 'Lights'],
    ];

    const STAGE_LABELS = ['Stock', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'];

    const STAGE_DESCRIPTIONS = [
        1 => 'First bolt-ons — direct-fit upgrades with no engine work. Intake, exhaust, suspension and brake improvements.',
        2 => 'Power-supporting mods — the parts that let you tune properly. Forced induction, fuel system and headers.',
        3 => 'Track-ready — full braking overhaul, forged wheels, aero and suspension for sustained high-load use.',
        4 => 'Full build — engine internals, standalone ECU, safety equipment. Maximum performance.',
    ];

    public function __construct(
        private readonly VehicleFilterService $vehicles,
        private readonly CatalogService $catalog,
    ) {}

    public function show(Request $request): Response
    {
        $vehicleFilterId = (int) $request->query('vehicle_filter_id', 0);
        $currentStage    = max(0, min(3, (int) $request->query('stage', 0)));
        $nextStage       = $currentStage + 1;

        $vehicle  = null;
        $products = [];

        if ($vehicleFilterId) {
            $vehicle = $this->vehicles->getVehicle($vehicleFilterId);

            if ($vehicle) {
                $raw = $this->vehicles->getProductsForVehicle($vehicleFilterId, $currentStage);

                // Hydrate pricing / images then group by category
                foreach ($raw as $item) {
                    $cat = $item['category'] ?? $item['subcategory'] ?? 'Other';
                    $products[$cat][] = $item;
                }

                // Sort groups: priority categories first, then alpha
                $priority = self::STAGE_CATEGORIES[$nextStage] ?? [];
                uksort($products, function ($a, $b) use ($priority) {
                    $ai = array_search($a, $priority);
                    $bi = array_search($b, $priority);
                    if ($ai === false && $bi === false) return strcmp($a, $b);
                    if ($ai === false) return 1;
                    if ($bi === false) return -1;
                    return $ai - $bi;
                });

                // Limit each group to 6 products, sorted by in_stock then price
                $products = array_map(function ($group) {
                    usort($group, fn($a, $b) =>
                        ($b['in_stock'] <=> $a['in_stock']) ?: ($a['price_incl'] <=> $b['price_incl'])
                    );
                    return array_slice($group, 0, 6);
                }, $products);
            }
        } else {
            // No vehicle — generic next-stage browse by category
            $priorityCats = self::STAGE_CATEGORIES[$nextStage] ?? [];
            foreach ($priorityCats as $cat) {
                $paginator  = $this->catalog->listProducts(['category' => $cat, 'sort' => 'default'], 6);
                $items      = $this->catalog->hydrateCollection($paginator->getCollection());
                if (!empty($items)) {
                    $products[$cat] = array_values($items);
                }
            }
        }

        return Inertia::render('Advisor', [
            'vehicle'       => $vehicle,
            'products'      => $products,   // ['Category' => [...products]]
            'current_stage' => $currentStage,
            'next_stage'    => $nextStage,
            'stage_labels'  => self::STAGE_LABELS,
            'stage_desc'    => self::STAGE_DESCRIPTIONS[$nextStage] ?? '',
            'makes'         => $this->vehicles->getMakes(),
        ]);
    }
}
