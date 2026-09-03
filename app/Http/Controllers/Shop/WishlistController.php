<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Turn14Product;
use App\Services\Turn14\CatalogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function __construct(private CatalogService $catalog) {}

    /**
     * GET /wishlist — show wishlist page (auth required)
     */
    public function index()
    {
        $this->requireAuth();

        $ids = Wishlist::where('user_id', auth()->id())->pluck('turn14_product_id');

        $products = Turn14Product::with(['stock', 'brand', 'media'])
            ->whereIn('id', $ids)
            ->get()
            ->map(fn($p) => $this->catalog->hydrateProduct($p))
            ->values();

        return Inertia::render('Wishlist', ['products' => $products]);
    }

    /**
     * POST /wishlist/toggle — add or remove
     * Returns {in_wishlist: bool, count: int}
     */
    public function toggle(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['redirect' => '/login'], 401);
        }

        $id = $request->input('turn14_product_id');

        $existing = Wishlist::where('user_id', auth()->id())
            ->where('turn14_product_id', $id)
            ->first();

        if ($existing) {
            $existing->delete();
            $inWishlist = false;
        } else {
            Wishlist::create(['user_id' => auth()->id(), 'turn14_product_id' => $id]);
            $inWishlist = true;
        }

        $count = Wishlist::where('user_id', auth()->id())->count();

        return response()->json(['in_wishlist' => $inWishlist, 'count' => $count]);
    }

    /**
     * GET /api/wishlist/ids — returns array of turn14_product_ids for current user
     */
    public function ids()
    {
        if (!auth()->check()) {
            return response()->json(['ids' => []]);
        }

        return response()->json([
            'ids' => Wishlist::where('user_id', auth()->id())->pluck('turn14_product_id'),
        ]);
    }

    private function requireAuth(): void
    {
        if (!auth()->check()) {
            abort(redirect('/login'));
        }
    }
}
