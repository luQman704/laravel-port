<?php
namespace App\Services;

use App\Models\Turn14VehicleFilter;
use App\Models\Turn14VehicleMake;
use App\Models\Turn14EngineFilter;
use App\Models\Turn14Product;
use App\Models\Turn14Stock;
use App\Services\Turn14\PricingService;
use Illuminate\Support\Collection;

class VehicleFilterService
{
    public function __construct(private readonly PricingService $pricing) {}

    // ── Cascade API ──────────────────────────────────────────────────────────

    public function getMakes(): Collection
    {
        return Turn14VehicleFilter::where('active', 1)
            ->selectRaw('id_make, make')
            ->groupBy('id_make', 'make')
            ->orderBy('make')
            ->get();
    }

    public function getYearsForMake(int $idMake): Collection
    {
        return Turn14VehicleFilter::where('active', 1)
            ->where('id_make', $idMake)
            ->selectRaw('year')
            ->groupBy('year')
            ->orderByDesc('year')
            ->get()
            ->pluck('year');
    }

    public function getModelsForMakeYear(int $idMake, string $year): Collection
    {
        return Turn14VehicleFilter::where('active', 1)
            ->where('id_make', $idMake)
            ->where('year', $year)
            ->selectRaw('id_vehicle_filter, id_model, model, image')
            ->orderBy('model')
            ->get();
    }

    // ── Vehicles Index (grouped make → model → year variants) ────────────────

    /**
     * Returns all vehicle filters grouped by make → model, with year variants and
     * product counts. Used by the /vehicles index page.
     */
    public function getVehiclesGrouped(): array
    {
        $vehicles = Turn14VehicleFilter::where('active', 1)
            ->selectRaw('
                new902_turn14_vehicle_filter.*,
                COUNT(DISTINCT p.id_turn14_product) as product_count
            ')
            ->leftJoin('new902_turn14_vehicle_product as vp', 'vp.id_vehicle_filter', '=', 'new902_turn14_vehicle_filter.id_vehicle_filter')
            ->leftJoin('new902_turn14_product as p', \DB::raw('LOWER(p.part_number)'), '=', \DB::raw('LOWER(vp.part_number)'))
            ->where(function($q) { $q->whereNull('p.id_turn14_product')->orWhere(function($q2) { $q2->where('p.sync_active', 1)->where('p.discontinued', 0); }); })
            ->groupBy('new902_turn14_vehicle_filter.id_vehicle_filter')
            ->orderBy('make')
            ->orderBy('model')
            ->orderByDesc('year')
            ->get();

        $makeMetaMap = Turn14VehicleMake::where('active', 1)
            ->get()
            ->keyBy('id_make');

        $grouped  = [];
        $makeMeta = [];

        foreach ($vehicles as $vf) {
            $make  = $vf->make;
            $model = $vf->model;

            if (!isset($makeMeta[$make])) {
                $makeRecord      = $makeMetaMap[$vf->id_make] ?? null;
                $makeMeta[$make] = [
                    'image'   => $makeRecord?->image ?? '',
                    'id_make' => $vf->id_make,
                ];
            }

            if (!isset($grouped[$make][$model])) {
                $grouped[$make][$model] = [
                    'image'          => $vf->image ?? '',
                    'total_products' => 0,
                    'variants'       => [],
                ];
            }

            $grouped[$make][$model]['total_products'] += (int)$vf->product_count;
            $grouped[$make][$model]['variants'][] = [
                'id_vehicle_filter' => $vf->id_vehicle_filter,
                'year'              => $vf->year,
                'product_count'     => (int)$vf->product_count,
            ];
        }

        ksort($grouped);

        return ['grouped' => $grouped, 'make_meta' => $makeMeta];
    }

    // ── Vehicle Detail ────────────────────────────────────────────────────────

    public function getVehicle(int $idVehicleFilter): ?Turn14VehicleFilter
    {
        return Turn14VehicleFilter::find($idVehicleFilter);
    }

    /**
     * Get all products for a vehicle filter, with price and stock,
     * filtered by stage system.
     *
     * Stage rules (ported from PS vehicle.php::shouldShow()):
     *   garageStage 0 → show stage 0 + stage 1
     *   garageStage N → show stage N+1 (next upgrade)
     *   showCompleted → also show stages 0..N
     */
    public function getProductsForVehicle(int $idVehicleFilter, int $garageStage = 0, bool $showCompleted = false): array
    {
        $rows = \DB::table('new902_turn14_vehicle_product as vp')
            ->join('new902_turn14_product as p', \DB::raw('LOWER(p.part_number)'), '=', \DB::raw('LOWER(vp.part_number)'))
            ->leftJoin('new902_turn14_stock as s', 's.turn14_product_id', '=', 'p.id')
            ->leftJoin('new902_turn14_brand as b', 'b.brand_id', '=', 'p.brand_id')
            ->where('vp.id_vehicle_filter', $idVehicleFilter)
            ->where('p.sync_active', 1)
            ->where('p.discontinued', 0)
            ->select([
                'p.*',
                'vp.stage',
                's.quantity', 's.mfr_quantity', 's.warehouse_stock', 's.mfr_esd',
                'b.name as brand_name',
            ])
            ->get();

        $products = [];
        foreach ($rows as $row) {
            $productStage = max(0, (int)$row->stage);
            if (!$this->shouldShow($productStage, $garageStage, $showCompleted)) {
                continue;
            }

            $arr      = (array)$row;
            $priceExcl = $this->pricing->calcDisplayPrice((float)$row->usd_price, $arr);
            $priceIncl = $this->pricing->inclTax($priceExcl);

            $products[] = array_merge($arr, [
                'price_excl'      => $priceExcl,
                'price_incl'      => $priceIncl,
                'price_formatted' => $this->pricing->formatPrice($priceExcl),
                'in_stock'        => max(0, (int)$row->quantity) > 0,
            ]);
        }

        return $products;
    }

    // ── Engines Index ────────────────────────────────────────────────────────

    public function getEnginesGrouped(): array
    {
        $engines = Turn14EngineFilter::where('new902_turn14_engine_filter.active', 1)
            ->selectRaw('
                new902_turn14_engine_filter.*,
                vm.name as make_name,
                vm.image as make_image,
                COUNT(DISTINCT p.id_turn14_product) as product_count
            ')
            ->leftJoin('new902_turn14_vehicle_make as vm', 'vm.id_make', '=', 'new902_turn14_engine_filter.id_make')
            ->leftJoin('new902_turn14_engine_product as ep', 'ep.id_engine_filter', '=', 'new902_turn14_engine_filter.id_engine_filter')
            ->leftJoin('new902_turn14_product as p', function ($join) {
                $join->on(\DB::raw('LOWER(p.part_number)'), '=', \DB::raw('LOWER(ep.part_number)'))
                     ->where('p.sync_active', 1)
                     ->where('p.discontinued', 0);
            })
            ->groupBy('new902_turn14_engine_filter.id_engine_filter')
            ->orderBy('new902_turn14_engine_filter.make')
            ->orderBy('new902_turn14_engine_filter.engine')
            ->get();

        $grouped  = [];
        $makeMeta = [];

        foreach ($engines as $ef) {
            $idMake = $ef->id_make;

            if (!isset($makeMeta[$idMake])) {
                $makeMeta[$idMake] = [
                    'name'    => $ef->make_name ?: $ef->make,
                    'image'   => $ef->make_image ?? '',
                    'id_make' => $idMake,
                ];
            }

            $grouped[$idMake][] = [
                'id_engine_filter' => $ef->id_engine_filter,
                'engine'           => $ef->engine,
                'image'            => $ef->image ?? '',
                'product_count'    => (int)$ef->product_count,
            ];
        }

        // Sort makes by name
        uasort($makeMeta, fn($a, $b) => strcmp($a['name'], $b['name']));
        $sortedGroups = [];
        foreach ($makeMeta as $idMake => $meta) {
            $sortedGroups[$idMake] = $grouped[$idMake] ?? [];
        }

        return ['groups' => $sortedGroups, 'make_meta' => $makeMeta];
    }

    // ── Engine Detail ────────────────────────────────────────────────────────

    public function getEngine(int $idEngineFilter): ?Turn14EngineFilter
    {
        return Turn14EngineFilter::find($idEngineFilter);
    }

    public function getProductsForEngine(int $idEngineFilter): array
    {
        $rows = \DB::table('new902_turn14_engine_product as ep')
            ->join('new902_turn14_product as p', \DB::raw('LOWER(p.part_number)'), '=', \DB::raw('LOWER(ep.part_number)'))
            ->leftJoin('new902_turn14_stock as s', 's.turn14_product_id', '=', 'p.id')
            ->leftJoin('new902_turn14_brand as b', 'b.brand_id', '=', 'p.brand_id')
            ->where('ep.id_engine_filter', $idEngineFilter)
            ->where('p.sync_active', 1)
            ->where('p.discontinued', 0)
            ->select([
                'p.*',
                's.quantity', 's.mfr_quantity', 's.warehouse_stock', 's.mfr_esd',
                'b.name as brand_name',
            ])
            ->get();

        $products = [];
        foreach ($rows as $row) {
            $arr       = (array)$row;
            $priceExcl = $this->pricing->calcDisplayPrice((float)$row->usd_price, $arr);
            $priceIncl = $this->pricing->inclTax($priceExcl);

            $products[] = array_merge($arr, [
                'price_excl'      => $priceExcl,
                'price_incl'      => $priceIncl,
                'price_formatted' => $this->pricing->formatPrice($priceExcl),
                'in_stock'        => max(0, (int)$row->quantity) > 0,
            ]);
        }

        return $products;
    }

    // ── Stage helper ─────────────────────────────────────────────────────────

    private function shouldShow(int $productStage, int $garageStage, bool $showCompleted): bool
    {
        if ($garageStage === 0) {
            return $productStage === 0 || $productStage === 1;
        }
        if ($productStage === $garageStage + 1) {
            return true;
        }
        if ($showCompleted && $productStage <= $garageStage) {
            return true;
        }
        return false;
    }

    // ── Engine cascade (for homepage selector) ───────────────────────────────

    public function getEnginesForMake(int $idMake): Collection
    {
        return Turn14EngineFilter::where('active', 1)
            ->where('id_make', $idMake)
            ->orderBy('engine')
            ->get();
    }
}
