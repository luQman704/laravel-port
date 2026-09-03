<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'name'  => 'nullable|string|max:100',
        ]);

        $email = strtolower(trim($request->input('email')));

        $existing = NewsletterSubscriber::where('email', $email)->first();

        if ($existing) {
            if ($existing->unsubscribed_at) {
                $existing->update(['unsubscribed_at' => null, 'subscribed_at' => now()]);
                return response()->json(['message' => 'Welcome back! You\'re subscribed again.']);
            }
            return response()->json(['message' => 'You\'re already subscribed!']);
        }

        NewsletterSubscriber::create([
            'email'         => $email,
            'name'          => $request->input('name'),
            'subscribed_at' => now(),
        ]);

        return response()->json(['message' => 'Subscribed! Thanks for joining.'], 201);
    }
}
