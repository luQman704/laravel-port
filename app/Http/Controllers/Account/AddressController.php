<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function index()
    {
        return Inertia::render('Account/Addresses', [
            'addresses' => UserAddress::where('user_id', auth()->id())
                ->orderByDesc('is_default')
                ->orderBy('label')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label'         => 'nullable|string|max:50',
            'first_name'    => 'required|string|max:100',
            'last_name'     => 'required|string|max:100',
            'phone'         => 'nullable|string|max:30',
            'company'       => 'nullable|string|max:100',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city'          => 'required|string|max:100',
            'province'      => 'nullable|string|max:100',
            'postal_code'   => 'required|string|max:20',
            'country'       => 'required|string|max:100',
            'is_default'    => 'boolean',
        ]);

        $data['user_id'] = auth()->id();

        if (!empty($data['is_default'])) {
            UserAddress::where('user_id', auth()->id())->update(['is_default' => false]);
        }

        UserAddress::create($data);

        return back()->with('success', 'Address added.');
    }

    public function update(Request $request, int $id)
    {
        $address = UserAddress::where('user_id', auth()->id())->findOrFail($id);

        $data = $request->validate([
            'label'         => 'nullable|string|max:50',
            'first_name'    => 'required|string|max:100',
            'last_name'     => 'required|string|max:100',
            'phone'         => 'nullable|string|max:30',
            'company'       => 'nullable|string|max:100',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city'          => 'required|string|max:100',
            'province'      => 'nullable|string|max:100',
            'postal_code'   => 'required|string|max:20',
            'country'       => 'required|string|max:100',
            'is_default'    => 'boolean',
        ]);

        if (!empty($data['is_default'])) {
            UserAddress::where('user_id', auth()->id())->update(['is_default' => false]);
        }

        $address->update($data);

        return back()->with('success', 'Address updated.');
    }

    public function setDefault(int $id)
    {
        UserAddress::where('user_id', auth()->id())->update(['is_default' => false]);
        UserAddress::where('user_id', auth()->id())->where('id', $id)->update(['is_default' => true]);

        return back()->with('success', 'Default address updated.');
    }

    public function destroy(int $id)
    {
        UserAddress::where('user_id', auth()->id())->where('id', $id)->delete();

        return back()->with('success', 'Address deleted.');
    }
}
