<?php
namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cart) {}

    public function index(): Response
    {
        return Inertia::render('Cart', [
            'contents' => $this->cart->getContents(),
            'totals'   => $this->cart->totals(),
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'turn14_product_id' => 'required|string',
            'qty'               => 'integer|min:1|max:99',
        ]);
        $this->cart->add($request->turn14_product_id, $request->integer('qty', 1));
        return back()->with('cart_added', true);
    }

    public function update(Request $request)
    {
        $request->validate([
            'turn14_product_id' => 'required|string',
            'qty'               => 'required|integer|min:0|max:99',
        ]);
        $this->cart->update($request->turn14_product_id, $request->integer('qty'));
        return back();
    }

    public function remove(Request $request)
    {
        $request->validate(['turn14_product_id' => 'required|string']);
        $this->cart->remove($request->turn14_product_id);
        return back();
    }

    public function clear()
    {
        $this->cart->clear();
        return back();
    }

    /** JSON endpoint for the cart dropdown — GET /api/cart */
    public function api(): JsonResponse
    {
        $contents = $this->cart->getContents();
        $totals   = $this->cart->totals();

        $items = collect($contents)->map(fn ($row) => [
            'id'           => $row['item']->turn14_product_id,
            'product_name' => $row['product']['product_name'] ?? '',
            'part_number'  => $row['product']['part_number']  ?? '',
            'thumbnail'    => $row['product']['thumbnail']    ?? null,
            'qty'          => $row['item']->qty,
            'price_incl'   => $row['product']['price_incl']   ?? 0,
            'subtotal'     => $row['line_total'],
        ])->values()->all();

        return response()->json([
            'items' => $items,
            'total' => $totals['total_incl'],
            'count' => $totals['item_count'],
        ]);
    }
}
