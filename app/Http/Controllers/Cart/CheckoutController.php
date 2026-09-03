<?php
namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserAddress;
use App\Services\CartService;
use App\Services\ShipLogicService;
use App\Services\ShippingService;
use App\Services\YocoService;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService      $cart,
        private readonly YocoService      $yoco,
        private readonly ShippingService  $shipping,
        private readonly ShipLogicService $shipLogic,
    ) {}

    // ─── Show checkout page ────────────────────────────────────────────────
    public function index(): Response|\Illuminate\Http\RedirectResponse
    {
        $contents = $this->cart->getContents();

        if (empty($contents)) {
            return redirect('/cart');
        }

        $user        = auth()->user();
        $userAddress = null;
        $userProfile = null;

        if ($user) {
            $userAddress = UserAddress::where('user_id', $user->id)
                ->where('is_default', true)
                ->first();

            $nameParts   = explode(' ', $user->name, 2);
            $userProfile = [
                'name'       => $user->name,
                'first_name' => $nameParts[0] ?? '',
                'last_name'  => $nameParts[1] ?? '',
                'email'      => $user->email,
                'phone'      => $user->phone ?? '',
            ];
        }

        $weightKg = $this->shipping->cartWeightKg($contents);
        $parcels  = $this->shipping->cartParcels($contents);

        // Pre-load rates only when a saved address is available
        $shippingOptions = [];
        if ($userAddress) {
            $deliveryAddr = [
                'address_line1' => $userAddress->address_line1,
                'address_line2' => $userAddress->address_line2 ?? '',
                'city'          => $userAddress->city,
                'province'      => $userAddress->province,
                'postal_code'   => $userAddress->postal_code,
            ];

            try {
                $shippingOptions = $this->shipping->getOptions($parcels, $deliveryAddr);
            } catch (\Throwable) {
                $shippingOptions = [];
            }
        }

        return Inertia::render('Checkout', [
            'contents'                => $contents,
            'totals'                  => $this->cart->totals(),
            'user'                    => $userProfile,
            'user_address'            => $userAddress,
            'static_shipping_options' => $this->shipping->staticOptions(),
            'shipping_options'        => $shippingOptions, // pre-loaded TCG rates (empty if no saved address)
            'cart_weight_kg'          => round($weightKg, 2),
        ]);
    }

    // ─── AJAX: live rates for a given delivery address ────────────────────
    public function rates(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city'          => 'required|string|max:64',
            'province'      => 'required|string|max:64',
            'postal_code'   => 'required|string|max:20',
        ]);

        $contents = $this->cart->getContents();
        if (empty($contents)) {
            return response()->json(['error' => 'Cart is empty.'], 422);
        }

        $parcels = $this->shipping->cartParcels($contents);

        try {
            $options = $this->shipping->getOptions($parcels, $data);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 502);
        }

        return response()->json(['options' => $options]);
    }

    // ─── Process checkout: collect details, create pending order, go to Yoco ─
    public function process(Request $request): \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response
    {
        $contents = $this->cart->getContents();
        if (empty($contents)) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        $isLoggedIn      = auth()->check();
        $user            = auth()->user();
        $useSavedAddress = $request->boolean('use_saved_address');

        // ── Validate shipping selection ─────────────────────────────────
        $request->validate([
            'shipping_service' => 'required|string|max:60',
        ]);

        // ── Resolve address ─────────────────────────────────────────────
        if ($isLoggedIn && $useSavedAddress) {
            $addr = UserAddress::where('user_id', $user->id)
                ->where('is_default', true)
                ->first();

            if (!$addr) {
                return back()->withErrors(['address' => 'No default address found.']);
            }

            $deliveryAddress = [
                'address_line1' => $addr->address_line1,
                'address_line2' => $addr->address_line2 ?? '',
                'city'          => $addr->city,
                'province'      => $addr->province,
                'postal_code'   => $addr->postal_code,
            ];

            $shipping = [
                'name'        => trim($addr->first_name . ' ' . $addr->last_name),
                'address'     => $addr->address_line1 . ($addr->address_line2 ? ', ' . $addr->address_line2 : ''),
                'city'        => $addr->city,
                'province'    => $addr->province,
                'postal_code' => $addr->postal_code,
                'phone'       => $addr->phone ?? $user->phone ?? '',
                'email'       => $user->email,
            ];

        } else {
            $rules = [
                'first_name'    => 'required|string|max:100',
                'last_name'     => 'required|string|max:100',
                'phone'         => 'required|string|max:30',
                'address_line1' => 'required|string|max:255',
                'address_line2' => 'nullable|string|max:255',
                'city'          => 'required|string|max:64',
                'province'      => 'required|string|max:64',
                'postal_code'   => 'required|string|max:20',
            ];

            if (!$isLoggedIn) {
                $rules['email']                 = 'required|email|max:255';
                $rules['password']              = 'required|min:8|confirmed';
                $rules['password_confirmation'] = 'required';
            }

            $data = $request->validate($rules);

            // Register guest
            if (!$isLoggedIn) {
                if (User::where('email', $data['email'])->exists()) {
                    return back()->withErrors([
                        'email' => 'An account with this email already exists. Please sign in to continue.',
                    ]);
                }

                $user = User::create([
                    'name'     => trim($data['first_name'] . ' ' . $data['last_name']),
                    'email'    => $data['email'],
                    'phone'    => $data['phone'],
                    'password' => Hash::make($data['password']),
                ]);

                $oldSessionId = session()->getId();
                Auth::login($user);
                // Use the pre-login session ID — Auth::login() may internally migrate
                // the session, changing its ID; mergeSession() would then find nothing.
                CartItem::where('session_id', $oldSessionId)
                    ->whereNull('user_id')
                    ->update(['user_id' => $user->id]);
                $request->session()->regenerate();
                $contents = $this->cart->getContents();

                \Mail::to($user->email)->send(new \App\Mail\WelcomeEmail($user));
            }

            // Save address as default
            UserAddress::where('user_id', $user->id)->update(['is_default' => false]);
            UserAddress::create([
                'user_id'       => $user->id,
                'label'         => 'Delivery',
                'first_name'    => $data['first_name'],
                'last_name'     => $data['last_name'],
                'phone'         => $data['phone'],
                'address_line1' => $data['address_line1'],
                'address_line2' => $data['address_line2'] ?? null,
                'city'          => $data['city'],
                'province'      => $data['province'],
                'postal_code'   => $data['postal_code'],
                'country'       => 'South Africa',
                'is_default'    => true,
            ]);

            $deliveryAddress = [
                'address_line1' => $data['address_line1'],
                'address_line2' => $data['address_line2'] ?? '',
                'city'          => $data['city'],
                'province'      => $data['province'],
                'postal_code'   => $data['postal_code'],
            ];

            $shipping = [
                'name'        => trim($data['first_name'] . ' ' . $data['last_name']),
                'address'     => $data['address_line1'] . (isset($data['address_line2']) ? ', ' . $data['address_line2'] : ''),
                'city'        => $data['city'],
                'province'    => $data['province'],
                'postal_code' => $data['postal_code'],
                'phone'       => $data['phone'],
                'email'       => $user->email,
            ];
        }

        // ── Resolve shipping cost ────────────────────────────────────────
        $weightKg       = $this->shipping->cartWeightKg($contents);
        $parcels        = $this->shipping->cartParcels($contents);
        $serviceCode    = $request->shipping_service;
        $isStaticOption = in_array($serviceCode, ['COLLECT', 'OWN_COURIER']);

        if ($isStaticOption) {
            $staticOpts  = collect($this->shipping->staticOptions());
            $shippingOpt = $staticOpts->firstWhere('service_code', $serviceCode);
        } else {
            $shippingOpt = $this->shipping->getOption($parcels, $serviceCode, $deliveryAddress);
        }

        if (!$shippingOpt) {
            return back()->withErrors(['shipping_service' => 'Invalid shipping option. Please select again.']);
        }

        // ── Gift wrap ────────────────────────────────────────────────────
        $giftWrapped  = $request->boolean('gift_wrapped');
        $giftWrapCost = $giftWrapped ? 100.00 : 0.00;
        $orderNotes   = $request->input('order_notes', '');

        $totals       = $this->cart->totals();
        $shippingIncl = $shippingOpt['price_incl'];
        $grandTotal   = $totals['total_incl'] + $shippingIncl + $giftWrapCost;
        $amountCents  = (int) round($grandTotal * 100);

        // ── Create pending order ─────────────────────────────────────────
        $order = Order::create([
            'user_id'              => $user->id,
            'session_id'           => session()->getId(),
            'status'               => 'pending',
            'payment_method'       => 'yoco',
            'subtotal_excl'        => $totals['subtotal_excl'],
            'vat_amount'           => $totals['vat_amount'],
            'shipping_cost'        => $shippingIncl,
            'shipping_carrier'     => $shippingOpt['carrier'],
            'shipping_service'     => $shippingOpt['service_code'],
            'total_incl'           => $grandTotal,
            'shipping_name'        => $shipping['name'],
            'shipping_address'     => $shipping['address'],
            'shipping_city'        => $shipping['city'],
            'shipping_province'    => $shipping['province'],
            'shipping_postal_code' => $shipping['postal_code'],
            'shipping_phone'       => $shipping['phone'],
            'shipping_email'       => $shipping['email'],
            'cart_weight_kg'       => round($weightKg, 3),
            'order_notes'          => $orderNotes ?: null,
            'gift_wrapped'         => $giftWrapped,
            'gift_wrap_cost'       => $giftWrapCost,
        ]);

        foreach ($contents as $row) {
            $p = $row['product'];
            OrderItem::create([
                'order_id'          => $order->id,
                'turn14_product_id' => $p['id'],
                'product_name'      => $p['product_name'],
                'part_number'       => $p['part_number'],
                'brand_name'        => $p['brand']['name'] ?? null,
                'qty'               => $row['item']->qty,
                'unit_price_excl'   => $p['price_excl'],
                'unit_price_incl'   => $p['price_incl'],
                'line_total_incl'   => $row['line_total'],
            ]);
        }

        // ── Create Yoco checkout session → redirect ──────────────────────
        try {
            $baseUrl  = config('app.url');
            $yocoData = $this->yoco->createCheckout(
                $amountCents,
                "{$baseUrl}/checkout/success?order_id={$order->id}",
                "{$baseUrl}/checkout/cancel?order_id={$order->id}",
                "{$baseUrl}/checkout/failed?order_id={$order->id}",
                ['orderId' => (string) $order->id, 'userId' => (string) $user->id]
            );
        } catch (\Throwable $e) {
            $order->delete(); // Roll back pending order
            return back()->withErrors(['payment' => 'Could not connect to payment provider. Please try again.']);
        }

        // Store checkout ID on order
        $order->update([
            'yoco_checkout_id' => $yocoData['id'],
            'payment_ref'      => $yocoData['id'],
        ]);

        $this->cart->clear();

        // Inertia::location() forces a full browser redirect (not XHR) to the external Yoco URL
        return Inertia::location($yocoData['redirectUrl']);
    }

    // ─── Yoco returns here on success ──────────────────────────────────────
    public function success(Request $request): \Illuminate\Http\RedirectResponse|Response
    {
        $orderId = $request->query('order_id');
        $order   = Order::where('id', $orderId)
            ->where('user_id', auth()->id())
            ->first();

        if (!$order) {
            return redirect('/account/orders');
        }

        // Verify with Yoco — retry up to 3x with 2s delay (Yoco may redirect before confirming)
        if ($order->yoco_checkout_id && $order->status === 'pending') {
            $attempts = 3;
            while ($attempts-- > 0) {
                try {
                    $checkout = $this->yoco->getCheckout($order->yoco_checkout_id);
                    $yocoStatus = strtolower($checkout['status'] ?? '');

                    \Log::info('Yoco checkout status check', [
                        'order_id'    => $order->id,
                        'checkout_id' => $order->yoco_checkout_id,
                        'status'      => $yocoStatus,
                        'attempts_left' => $attempts,
                    ]);

                    if ($yocoStatus === 'paid') {
                        $order->update([
                            'status'         => 'paid',
                            'yoco_charge_id' => $checkout['id'] ?? null,
                        ]);
                        $order->refresh();

                        try {
                            \Mail::to($order->shipping_email)->send(new \App\Mail\OrderConfirmation($order));
                        } catch (\Throwable) {}

                        break;
                    }
                } catch (\Throwable $e) {
                    \Log::error('Yoco checkout verification error', ['error' => $e->getMessage()]);
                }

                if ($attempts > 0) sleep(2);
            }
        }

        // TCG shipment is handled automatically by OrderObserver when status → paid

        return redirect("/account/orders/{$order->id}")->with('order_placed', true);
    }

    // ─── Yoco returns here on cancel ──────────────────────────────────────
    public function cancel(Request $request): \Illuminate\Http\RedirectResponse
    {
        $orderId = $request->query('order_id');
        $order   = Order::where('id', $orderId)
            ->where('user_id', auth()->id())
            ->where('status', 'pending')
            ->first();

        if ($order) {
            $order->update(['status' => 'cancelled']);
        }

        return redirect('/cart')->with('info', 'Payment cancelled. Your cart has been restored.');
    }

    // ─── Yoco returns here on failure ─────────────────────────────────────
    public function failed(Request $request): \Illuminate\Http\RedirectResponse
    {
        $orderId = $request->query('order_id');
        $order   = Order::where('id', $orderId)
            ->where('user_id', auth()->id())
            ->where('status', 'pending')
            ->first();

        if ($order) {
            $order->update(['status' => 'cancelled']);
        }

        return redirect('/checkout')->with('error', 'Payment failed. Please try again.');
    }

    // ─── Yoco webhook — server-to-server payment confirmation ─────────────────
    public function webhook(Request $request): \Illuminate\Http\JsonResponse
    {
        $payload = $request->all();
        $type    = $payload['type'] ?? '';

        // Only handle successful payment events
        if (!in_array($type, ['payment.succeeded', 'checkout.complete', 'payment.created'])) {
            return response()->json(['ok' => true]);
        }

        // Extract checkout ID from various possible payload shapes
        $checkoutId = $payload['payload']['id']
            ?? $payload['payload']['checkoutId']
            ?? $payload['checkoutId']
            ?? $payload['id']
            ?? null;

        if (!$checkoutId) {
            return response()->json(['error' => 'No checkout ID'], 400);
        }

        $order = Order::where('yoco_checkout_id', $checkoutId)
            ->where('status', 'pending')
            ->first();

        if (!$order) {
            return response()->json(['ok' => true]); // already processed or not found
        }

        // Verify directly with Yoco (don't trust payload alone)
        try {
            $checkout = $this->yoco->getCheckout($checkoutId);
            if (strtolower($checkout['status'] ?? '') !== 'paid') {
                return response()->json(['ok' => true]);
            }
        } catch (\Throwable) {
            return response()->json(['error' => 'Could not verify with Yoco'], 502);
        }

        $order->update([
            'status'         => 'paid',
            'yoco_charge_id' => $checkoutId,
        ]);

        try {
            \Mail::to($order->shipping_email)->send(new \App\Mail\OrderConfirmation($order));
        } catch (\Throwable) {}

        // TCG shipment handled by OrderObserver

        return response()->json(['ok' => true]);
    }
}
