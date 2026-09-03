<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\Turn14\CatalogService;
use App\Services\Turn14\Turn14ImageService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        private readonly CatalogService    $catalog,
        private readonly Turn14ImageService $images,
    ) {}

    public function show(string $id): Response
    {
        $product = $this->catalog->getProduct($id);

        abort_if($product === null, 404);

        $turn14Id = $product['id'] ?? $id;

        $reviewStats = \App\Models\ProductReview::where('turn14_product_id', $turn14Id)
            ->where('status', 'published')
            ->selectRaw('COUNT(*) as total, AVG(rating) as avg_rating,
                SUM(rating=5) as five, SUM(rating=4) as four, SUM(rating=3) as three,
                SUM(rating=2) as two, SUM(rating=1) as one')
            ->first();

        $hasAlert = false;
        if (auth()->check()) {
            $hasAlert = \App\Models\Turn14StockAlert::where('turn14_product_id', $turn14Id)
                ->where('email', auth()->user()->email)
                ->exists();
        }

        return Inertia::render('Product', [
            'product'      => $product,
            'has_alert'    => $hasAlert,
            'review_stats' => [
                'total'      => (int) ($reviewStats->total ?? 0),
                'avg_rating' => round((float) ($reviewStats->avg_rating ?? 0), 1),
                'breakdown'  => [
                    5 => (int) ($reviewStats->five ?? 0),
                    4 => (int) ($reviewStats->four ?? 0),
                    3 => (int) ($reviewStats->three ?? 0),
                    2 => (int) ($reviewStats->two ?? 0),
                    1 => (int) ($reviewStats->one ?? 0),
                ],
            ],
        ]);
    }

    /**
     * AJAX endpoint — lazy image loader.
     * Called by the Product page on mount.
     * Returns high-res image URLs, fetching from Turn14 API + caching if needed.
     */
    public function images(string $turn14Id): JsonResponse
    {
        $images = $this->images->getImages($turn14Id);
        return response()->json(['images' => $images]);
    }
}
