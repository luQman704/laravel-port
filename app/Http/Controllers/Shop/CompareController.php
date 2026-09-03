<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Turn14Product;
use App\Services\Turn14\CatalogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompareController extends Controller
{
    public function __construct(private CatalogService $catalog) {}

    /**
     * GET /compare?ids=1,2,3,4
     * Accepts up to 4 comma-separated turn14_product_ids.
     */
    public function index(Request $request)
    {
        $ids = array_filter(
            array_slice(explode(',', $request->query('ids', '')), 0, 4)
        );

        $products = [];

        if (!empty($ids)) {
            $products = Turn14Product::with(['stock', 'brand', 'media'])
                ->whereIn('id', $ids)
                ->get()
                ->map(fn($p) => $this->catalog->hydrateProduct($p))
                ->values()
                ->all();
        }

        return Inertia::render('Compare', ['products' => $products]);
    }
}
