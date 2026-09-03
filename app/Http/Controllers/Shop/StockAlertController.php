<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Turn14StockAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StockAlertController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'turn14_product_id' => 'required|string|max:8',
            'email'             => 'nullable|email|max:255',
            'watch_local'       => 'boolean',
            'watch_usa'         => 'boolean',
            'watch_mfr'         => 'boolean',
        ]);

        // Logged-in users always use their account email — ignore submitted email
        $email = auth()->check()
            ? auth()->user()->email
            : ($data['email'] ?? null);

        if (!$email) {
            return response()->json(['message' => 'Email address is required.'], 422);
        }

        // Prevent duplicate subscriptions
        $exists = Turn14StockAlert::where('turn14_product_id', $data['turn14_product_id'])
            ->where('email', $email)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already subscribed for this product.'], 200);
        }

        Turn14StockAlert::create([
            'turn14_product_id' => $data['turn14_product_id'],
            'ps_product_id'     => 0,
            'email'             => $email,
            'watch_local'       => $data['watch_local'] ?? 1,
            'watch_usa'         => $data['watch_usa'] ?? 1,
            'watch_mfr'         => $data['watch_mfr'] ?? 1,
            'token'             => Str::random(32),
            'date_add'          => now(),
        ]);

        return response()->json(['message' => 'You will be notified when this product is back in stock.'], 201);
    }

    public function unsubscribe(string $token): \Illuminate\Http\RedirectResponse
    {
        Turn14StockAlert::where('token', $token)->delete();

        return redirect('/')->with('status', 'You have been unsubscribed from stock alerts.');
    }

    public function myAlerts(): \Inertia\Response
    {
        $alerts = Turn14StockAlert::where('email', auth()->user()->email)
            ->orderByDesc('date_add')
            ->get()
            ->map(function ($alert) {
                $product = \App\Models\Turn14Product::where('id', $alert->turn14_product_id)->first();
                return array_merge($alert->toArray(), [
                    'product_name' => $product?->product_name ?? 'Unknown product',
                    'part_number'  => $product?->part_number ?? '',
                    'product_url'  => $product ? '/product/' . $product->id_turn14_product : null,
                ]);
            });

        return Inertia::render('Account/Alerts', ['alerts' => $alerts]);
    }

    public function deleteAlert(int $id): \Illuminate\Http\RedirectResponse
    {
        Turn14StockAlert::where('id_alert', $id)
            ->where('email', auth()->user()->email)
            ->delete();

        return back();
    }
}
