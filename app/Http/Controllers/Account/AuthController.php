<?php
namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin(): \Inertia\Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'These credentials do not match our records.']);
        }

        // Merge guest cart into user cart
        app(CartService::class)->mergeSession(auth()->id());

        $request->session()->regenerate();
        return redirect()->intended('/account');
    }

    public function showRegister(): \Inertia\Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name'            => 'required|string|max:100',
            'last_name'             => 'required|string|max:100',
            'title'                 => 'nullable|in:Mr.,Mrs.,Ms.,Dr.',
            'email'                 => 'required|email|unique:users',
            'phone'                 => 'nullable|string|max:30',
            'birthdate'             => 'nullable|date',
            'password'              => 'required|min:8|confirmed',
            'newsletter_subscribed' => 'boolean',
        ]);

        $user = \App\Models\User::create([
            'name'                  => trim($request->first_name . ' ' . $request->last_name),
            'title'                 => $request->title,
            'email'                 => $request->email,
            'phone'                 => $request->phone,
            'birthdate'             => $request->birthdate,
            'newsletter_subscribed' => $request->boolean('newsletter_subscribed'),
            'password'              => $request->password,
        ]);

        Auth::login($user);
        app(CartService::class)->mergeSession($user->id);
        $request->session()->regenerate();

        \Mail::to($user->email)->send(new \App\Mail\WelcomeEmail($user));

        return redirect('/account');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
