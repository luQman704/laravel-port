<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\Turn14\CatalogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
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

    public function show(Request $request, string $category): Response
    {
        $subcategory = $request->query('sub');
        $brandId     = $request->query('brand_id');
        $sort        = $request->query('sort', 'default');

        $filters = ['category' => $category, 'sort' => $sort];
        if ($subcategory) $filters['subcategory'] = $subcategory;
        if ($brandId)     $filters['brand_id']     = $brandId;

        $paginator = $this->catalog->listProducts($filters, 24);
        $items     = $this->catalog->hydrateCollection($paginator->getCollection());

        return Inertia::render('Category', [
            'category'     => $category,
            'subcategory'  => $subcategory,
            'products'     => array_values($items),
            'pagination'   => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
                'per_page'     => $paginator->perPage(),
            ],
            'subcategories' => $this->catalog->getSubcategories($category),
            'brands'        => $this->catalog->getBrandsForCategory($category),
            'activeFilters' => $filters,
            'sort_options'  => $this->sortOptions(),
        ]);
    }
}
