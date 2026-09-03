<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    /**
     * GET /api/products/{turn14Id}/reviews — paginated published reviews
     */
    public function index(string $turn14Id)
    {
        $reviews = ProductReview::where('turn14_product_id', $turn14Id)
            ->where('status', 'published')
            ->orderByDesc('created_at')
            ->paginate(10);

        $avg = ProductReview::where('turn14_product_id', $turn14Id)
            ->where('status', 'published')
            ->avg('rating');

        $count = ProductReview::where('turn14_product_id', $turn14Id)
            ->where('status', 'published')
            ->count();

        return response()->json([
            'reviews'    => $reviews,
            'avg_rating' => round($avg ?? 0, 1),
            'total'      => $count,
        ]);
    }

    /**
     * POST /reviews — submit a review (authenticated users only)
     */
    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'You must be signed in to leave a review.'], 401);
        }

        $user = auth()->user();

        $request->validate([
            'turn14_product_id' => 'required|string|max:64',
            'rating'            => 'required|integer|min:1|max:5',
            'body'              => 'required|string|min:10|max:2000',
            'title'             => 'nullable|string|max:100',
        ]);

        // Prevent duplicate review from same user for same product
        $existing = ProductReview::where('turn14_product_id', $request->turn14_product_id)
            ->where('user_id', $user->id)
            ->exists();

        if ($existing) {
            return response()->json(['message' => 'You have already reviewed this product.'], 422);
        }

        // Spam protection: 60 seconds between reviews
        $recentExists = ProductReview::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subSeconds(60))
            ->exists();

        if ($recentExists) {
            return response()->json(['message' => 'Please wait before submitting another review.'], 429);
        }

        // Verified purchase: user has a paid/delivered order containing this product
        $verifiedPurchase = Order::where('user_id', $user->id)
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
            ->whereHas('items', fn ($q) => $q->where('turn14_product_id', $request->turn14_product_id))
            ->exists();

        $review = ProductReview::create([
            'turn14_product_id' => $request->turn14_product_id,
            'user_id'           => $user->id,
            'reviewer_name'     => $user->name,
            'reviewer_email'    => $user->email,
            'title'             => $request->title,
            'body'              => $request->body,
            'rating'            => $request->rating,
            'status'            => 'published',
            'verified_purchase' => $verifiedPurchase,
        ]);

        return response()->json(['review' => $review, 'message' => 'Review submitted!']);
    }
}
