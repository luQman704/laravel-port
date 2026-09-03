<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\Turn14\CatalogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrowseController extends Controller
{
    public function __construct(private readonly CatalogService $catalog) {}

    private function sortOptions(): array
    {
        return [
            ['value' => 'default',    'label' => 'Default'],
            ['value' => 'price_asc',  'label' => 'Price: Low to High'],
            ['value' => 'price_desc', 'label' => 'Price: High to Low'],
            ['value' => 'name_asc',   'label' => 'Name: A–Z'],
            ['value' => 'name_desc',  'label' => 'Name: Z–A'],
        ];
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['category', 'subcategory', 'brand_id', 'search', 'vehicle_filter_id', 'sort', 'in_stock', 'price_min', 'price_max']);

        $paginator = $this->catalog->listProducts($filters, 24);
        $items     = $this->catalog->hydrateCollection($paginator->getCollection());

        return Inertia::render('Browse', [
            'products'     => array_values($items),
            'pagination'   => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
                'per_page'     => $paginator->perPage(),
            ],
            'categories'   => $this->catalog->getCategories(),
            'filters'      => $filters,
            'sort_options' => $this->sortOptions(),
        ]);
    }
}
