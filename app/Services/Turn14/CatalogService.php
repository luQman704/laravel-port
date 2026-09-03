<?php
namespace App\Services\Turn14;

use App\Models\Turn14Product;
use App\Models\Turn14Brand;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CatalogService
{
    public function __construct(private readonly PricingService $pricing) {}

    /**
     * Paginated product listing for a category/subcategory.
     */
    public function listProducts(array $filters = [], int $perPage = 24): LengthAwarePaginator
    {
        $q = Turn14Product::with(['stock', 'brand'])
            ->where('sync_active', 1)
            ->where('discontinued', 0);

        if (!empty($filters['category'])) {
            $q->where('category', $filters['category']);
        }
        if (!empty($filters['subcategory'])) {
            $q->where('subcategory', $filters['subcategory']);
        }
        if (!empty($filters['brand_id'])) {
            $q->where('brand_id', $filters['brand_id']);
        }
        if (!empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $q->where(function ($q) use ($term) {
                $q->where('product_name', 'LIKE', $term)
                  ->orWhere('part_number', 'LIKE', $term)
                  ->orWhere('mfr_part_number', 'LIKE', $term);
            });
        }
        if (!empty($filters['in_stock'])) {
            $q->whereHas('stock', function ($sq) {
                $sq->where(function ($or) {
                    $or->where('quantity', '>', 0)
                       ->orWhere('mfr_quantity', '>', 0);
                });
            });
        }
        if (isset($filters['price_min']) && $filters['price_min'] !== '') {
            $usdMin = $this->pricing->zarToUsdApprox((float)$filters['price_min']);
            $q->where('usd_price', '>=', $usdMin);
        }
        if (isset($filters['price_max']) && $filters['price_max'] !== '') {
            $usdMax = $this->pricing->zarToUsdApprox((float)$filters['price_max']);
            $q->where('usd_price', '<=', $usdMax);
        }
        if (!empty($filters['vehicle_filter_id'])) {
            $q->join('new902_turn14_vehicle_product as tvp', 'tvp.part_number', '=', 'new902_turn14_product.part_number')
              ->where('tvp.id_vehicle_filter', $filters['vehicle_filter_id'])
              ->select('new902_turn14_product.*');
        }

        // Sorting
        $sort = $filters['sort'] ?? 'default';
        match($sort) {
            'price_asc'  => $q->orderBy('usd_price', 'asc'),
            'price_desc' => $q->orderBy('usd_price', 'desc'),
            'name_asc'   => $q->orderBy('product_name', 'asc'),
            'name_desc'  => $q->orderBy('product_name', 'desc'),
            default      => $q->orderBy('product_name', 'asc'),
        };

        return $q->paginate($perPage);
    }

    /**
     * Get a single product with stock, brand, and computed price.
     */
    public function getProduct(string $turn14Id): ?array
    {
        $product = Turn14Product::with(['stock', 'brand', 'media'])
            ->where('id', $turn14Id)
            ->first();

        if (!$product) return null;

        return $this->hydrateProduct($product);
    }

    public function getProductByPartNumber(string $partNumber): ?array
    {
        $product = Turn14Product::with(['stock', 'brand', 'media'])
            ->where('part_number', $partNumber)
            ->first();

        if (!$product) return null;

        return $this->hydrateProduct($product);
    }

    /**
     * All distinct categories with product counts.
     */
    public function getCategories(): Collection
    {
        return Turn14Product::where('sync_active', 1)
            ->where('discontinued', 0)
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();
    }

    /**
     * Subcategories for a given category, with counts.
     */
    public function getSubcategories(string $category): Collection
    {
        return Turn14Product::where('sync_active', 1)
            ->where('discontinued', 0)
            ->where('category', $category)
            ->selectRaw('subcategory, COUNT(*) as count')
            ->groupBy('subcategory')
            ->orderByDesc('count')
            ->get();
    }

    /**
     * Brands available in a category (for filters sidebar).
     */
    public function getBrandsForCategory(string $category): Collection
    {
        return Turn14Brand::join('new902_turn14_product as p', 'p.brand_id', '=', 'new902_turn14_brand.brand_id')
            ->where('p.category', $category)
            ->where('p.sync_active', 1)
            ->where('p.discontinued', 0)
            ->selectRaw('new902_turn14_brand.brand_id, new902_turn14_brand.name, COUNT(p.id_turn14_product) as count')
            ->groupBy('new902_turn14_brand.brand_id', 'new902_turn14_brand.name')
            ->orderByDesc('count')
            ->get();
    }

    /**
     * Full-text search across product_name, part_number, mfr_part_number.
     */
    public function search(string $term, int $perPage = 24, string $sort = 'default'): LengthAwarePaginator
    {
        $q = Turn14Product::with(['stock', 'brand'])
            ->where('sync_active', 1)
            ->where('discontinued', 0)
            ->where(function ($q) use ($term) {
                $like = '%' . $term . '%';
                $q->where('product_name', 'LIKE', $like)
                  ->orWhere('part_number', 'LIKE', $like)
                  ->orWhere('mfr_part_number', 'LIKE', $like)
                  ->orWhere('part_description', 'LIKE', $like);
            });

        match($sort) {
            'price_asc'  => $q->orderBy('usd_price', 'asc'),
            'price_desc' => $q->orderBy('usd_price', 'desc'),
            'name_asc'   => $q->orderBy('product_name', 'asc'),
            'name_desc'  => $q->orderBy('product_name', 'desc'),
            default      => $q->orderBy('product_name', 'asc'),
        };

        return $q->paginate($perPage);
    }

    /**
     * Quick search for overlay/autocomplete — returns lightweight results.
     */
    public function quickSearch(string $term, int $limit = 5): array
    {
        if (strlen($term) < 2) return ['results' => [], 'total' => 0];

        $likeTerm = '%' . $term . '%';
        $paginator = Turn14Product::with('brand')
            ->where('sync_active', 1)
            ->where('discontinued', 0)
            ->where(function ($q) use ($likeTerm) {
                $q->where('product_name', 'LIKE', $likeTerm)
                  ->orWhere('part_number', 'LIKE', $likeTerm)
                  ->orWhere('mfr_part_number', 'LIKE', $likeTerm);
            })
            ->select(['id', 'product_name', 'part_number', 'brand_id', 'thumbnail', 'category', 'usd_price'])
            ->paginate($limit);

        $results = $paginator->getCollection()->map(function ($p) {
            $priceExcl = $this->pricing->calcDisplayPrice($p->usd_price, $p->toArray());
            return [
                'id'           => $p->id,
                'product_name' => $p->product_name,
                'part_number'  => $p->part_number,
                'brand_name'   => $p->brand?->name ?? '',
                'category'     => $p->category,
                'thumbnail'    => $p->thumbnail,
                'price_incl'   => $this->pricing->inclTax($priceExcl),
            ];
        })->all();

        return ['results' => $results, 'total' => $paginator->total()];
    }

    /**
     * Stats for the homepage hero.
     */
    public function getStats(): array
    {
        return [
            'total_products' => Turn14Product::where('sync_active', 1)->where('discontinued', 0)->count(),
            'total_brands'   => Turn14Brand::where('sync_active', 1)->count(),
            'total_categories' => Turn14Product::where('sync_active', 1)->where('discontinued', 0)->distinct()->count('category'),
        ];
    }

    public function hydrateProduct(Turn14Product $product): array
    {
        $arr = $product->toArray();
        $arr['price_excl'] = $this->pricing->calcDisplayPrice($product->usd_price, $arr);
        $arr['price_incl'] = $this->pricing->inclTax($arr['price_excl']);
        $arr['price_formatted'] = $this->pricing->formatPrice($arr['price_excl']);

        // Build high-res images array from media table (L.JPG = large/full-quality)
        // Fall back to thumbnail if no media records exist
        if ($product->relationLoaded('media') && $product->media->isNotEmpty()) {
            $arr['images'] = $product->media->pluck('image_url')->values()->all();
        } elseif (!empty($arr['thumbnail'])) {
            $arr['images'] = [$arr['thumbnail']];
        } else {
            $arr['images'] = [];
        }

        // Detect kit from part_description
        $arr['is_kit'] = $this->detectKit($product->part_description ?? '');

        // Kit items
        if ($arr['is_kit']) {
            $arr['kit_items'] = \DB::table('new902_turn14_kit_items')
                ->where('turn14_product_id', $product->id)
                ->orderBy('sort_order')
                ->get()
                ->toArray();
        } else {
            $arr['kit_items'] = [];
        }

        return $arr;
    }

    private function detectKit(string $description): bool
    {
        return (bool) preg_match('/\bkit\b|\bpack\b|\bcombo\b/i', $description);
    }

    public function hydrateCollection($products): array
    {
        return $products->map(fn($p) => $this->hydrateProduct($p))->all();
    }
}
