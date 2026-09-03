<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $parts = explode(' ', $user->name, 2);

        return Inertia::render('Account/Profile', [
            'user' => array_merge($user->toArray(), [
                'first_name' => $parts[0] ?? '',
                'last_name'  => $parts[1] ?? '',
            ]),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'title'                 => 'nullable|in:Mr.,Mrs.,Ms.,Dr.',
            'first_name'            => 'required|string|max:100',
            'last_name'             => 'required|string|max:100',
            'email'                 => 'required|email|unique:users,email,' . $user->id,
            'phone'                 => 'nullable|string|max:30',
            'birthdate'             => 'nullable|date',
            'newsletter_subscribed' => 'boolean',
        ]);

        $user->update([
            'title'                 => $data['title'] ?? null,
            'name'                  => trim($data['first_name'] . ' ' . $data['last_name']),
            'email'                 => $data['email'],
            'phone'                 => $data['phone'] ?? null,
            'birthdate'             => $data['birthdate'] ?? null,
            'newsletter_subscribed' => $data['newsletter_subscribed'] ?? false,
        ]);

        return back()->with('success', 'Profile updated successfully.');
    }

    public function changePassword(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'current_password'         => 'required',
            'new_password'             => 'required|min:8|confirmed',
            'new_password_confirmation' => 'required',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return back()->with('success', 'Password changed successfully.');
    }
}
