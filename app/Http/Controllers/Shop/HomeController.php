<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\BlogArticle;
use App\Models\HomeDeal;
use App\Models\HomeFeaturedProduct;
use App\Models\Testimonial;
use App\Models\Turn14Brand;
use App\Services\Turn14\CatalogService;
use App\Services\VehicleFilterService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalog,
        private readonly VehicleFilterService $vehicles,
    ) {}

    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'stats'      => $this->catalog->getStats(),
            'categories' => $this->catalog->getCategories()->take(12),
            'makes'      => $this->vehicles->getMakes(),
            'deals'      => $this->getDeals(),
            'featuredBrands' => $this->getFeaturedBrands(),
            'trending'   => $this->getFeaturedProducts('trending', 8),
            'popular'    => $this->getPopularProducts(),
            'testimonials' => $this->getTestimonials(),
            'articles'   => $this->getArticles(),
        ]);
    }

    private function getDeals(): array
    {
        $rows = HomeDeal::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>', now());
            })
            ->with(['product.stock', 'product.brand'])
            ->orderBy('sort_order')
            ->limit(6)
            ->get();

        return $rows->map(function ($deal) {
            if (!$deal->product) return null;
            $hydrated = $this->catalog->hydrateProduct($deal->product);
            $hydrated['deal_price_incl'] = $deal->deal_price_incl ?? $hydrated['price_incl'];
            $hydrated['deal_price_excl'] = $deal->deal_price_excl ?? $hydrated['price_excl'];
            $hydrated['ends_at']         = $deal->ends_at?->toISOString();
            return $hydrated;
        })->filter()->values()->all();
    }

    private function getFeaturedBrands(): array
    {
        return Turn14Brand::where('is_featured', true)
            ->orderBy('name')
            ->get(['brand_id', 'name', 'logo', 'logo_url'])
            ->toArray();
    }

    private function getFeaturedProducts(string $section, int $limit = 8): array
    {
        $rows = HomeFeaturedProduct::where('section', $section)
            ->where('is_active', true)
            ->with(['product.stock', 'product.brand'])
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();

        return $rows->map(fn ($r) => $r->product
            ? $this->catalog->hydrateProduct($r->product)
            : null
        )->filter()->values()->all();
    }

    private function getPopularProducts(): array
    {
        $rows = HomeFeaturedProduct::where('section', 'popular')
            ->where('is_active', true)
            ->with(['product.stock', 'product.brand'])
            ->orderBy('sort_order')
            ->get();

        $grouped = [];
        foreach ($rows as $row) {
            if (!$row->product) continue;
            $tab = $row->category_tab ?? 'All';
            $grouped[$tab][] = $this->catalog->hydrateProduct($row->product);
        }

        // Return as [{tab, products}] array
        return collect($grouped)->map(fn ($products, $tab) => [
            'tab'      => $tab,
            'products' => array_slice($products, 0, 8),
        ])->values()->all();
    }

    private function getTestimonials(): array
    {
        return Testimonial::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['customer_name', 'customer_location', 'vehicle', 'body', 'rating'])
            ->toArray();
    }

    private function getArticles(): array
    {
        return BlogArticle::where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'category', 'cover_image', 'excerpt', 'read_minutes', 'published_at'])
            ->toArray();
    }
}
