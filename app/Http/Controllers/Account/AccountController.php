<?php
namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        return Inertia::render('Account/Dashboard', [
            'user'          => auth()->user(),
            'order_count'   => Order::where('user_id', auth()->id())->count(),
            'recent_orders' => Order::where('user_id', auth()->id())
                ->latest()->take(3)->get(),
        ]);
    }

    public function orders()
    {
        return Inertia::render('Account/Orders', [
            'orders' => Order::where('user_id', auth()->id())
                ->latest()->paginate(10),
        ]);
    }

    public function orderDetail(int $id)
    {
        $order = Order::where('user_id', auth()->id())
            ->with('items')
            ->findOrFail($id);

        return Inertia::render('Account/OrderDetail', [
            'order' => $order,
        ]);
    }

    public function orderReceipt(int $id)
    {
        $order = Order::where('user_id', auth()->id())
            ->with('items')
            ->findOrFail($id);

        return view('orders.receipt', ['order' => $order]);
    }
}
