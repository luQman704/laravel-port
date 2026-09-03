<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\Turn14\CatalogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
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

    public function __invoke(Request $request): Response
    {
        $term = $request->query('q', '');
        $sort = $request->query('sort', 'default');
        $products = [];
        $pagination = null;

        if (strlen($term) >= 2) {
            $paginator = $this->catalog->search($term, 24, $sort);
            $items     = $this->catalog->hydrateCollection($paginator->getCollection());
            $products  = array_values($items);
            $pagination = [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
                'per_page'     => $paginator->perPage(),
            ];
        }

        return Inertia::render('Search', [
            'term'        => $term,
            'products'    => $products,
            'pagination'  => $pagination,
            'current_sort' => $sort,
            'sort_options' => $this->sortOptions(),
        ]);
    }

    public function quick(Request $request)
    {
        $term = $request->query('q', '');
        return response()->json($this->catalog->quickSearch($term, 5));
    }
}
