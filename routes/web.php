<?php

use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Shop\BrowseController;
use App\Http\Controllers\Shop\CategoryController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\SearchController;
use App\Http\Controllers\Shop\VehicleController;
use App\Http\Controllers\Shop\EngineController;
use App\Http\Controllers\Shop\StockAlertController;
use App\Http\Controllers\Shop\NewsletterController;
use App\Http\Controllers\Shop\ArticleController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class);
Route::get('/browse', [BrowseController::class, 'index']);
Route::get('/category/{category}', [CategoryController::class, 'show']);
Route::get('/product/{id}', [ProductController::class, 'show']);
Route::get('/search', SearchController::class);
Route::get('/api/search/quick', [SearchController::class, 'quick']);
Route::get('/api/product/{turn14Id}/images', [ProductController::class, 'images']);

// Vehicles
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
Route::get('/api/vehicles/years', [VehicleController::class, 'years']);
Route::get('/api/vehicles/models', [VehicleController::class, 'models']);

// Engines
Route::get('/engines', [EngineController::class, 'index']);
Route::get('/engines/{id}', [EngineController::class, 'show']);

// Stock Alerts
Route::post('/stock-alert/subscribe', [StockAlertController::class, 'subscribe']);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

// Articles
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/stock-alert/unsubscribe/{token}', [StockAlertController::class, 'unsubscribe'])->name('stock-alert.unsubscribe');

use App\Http\Controllers\Shop\WishlistController;
use App\Http\Controllers\Shop\ProductReviewController;
use App\Http\Controllers\Shop\CompareController;
use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\Cart\CheckoutController;
use App\Http\Controllers\Account\AuthController;
use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\Account\GarageController;
use App\Http\Controllers\Account\ProfileController;
use App\Http\Controllers\Account\AddressController;

// Compare (no auth)
Route::get('/compare', [CompareController::class, 'index']);

// Wishlist
Route::get('/wishlist', [WishlistController::class, 'index']);
Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
Route::get('/api/wishlist/ids', [WishlistController::class, 'ids']);

// Reviews
Route::get('/api/products/{turn14Id}/reviews', [ProductReviewController::class, 'index']);
Route::post('/reviews', [ProductReviewController::class, 'store']);

// Cart
Route::get('/cart', [CartController::class, 'index']);
Route::get('/api/cart', [CartController::class, 'api']);
Route::post('/cart/add', [CartController::class, 'add']);
Route::post('/cart/update', [CartController::class, 'update']);
Route::post('/cart/remove', [CartController::class, 'remove']);

// Checkout
Route::get('/checkout', [CheckoutController::class, 'index']);
Route::post('/checkout/process', [CheckoutController::class, 'process']);
Route::post('/api/checkout/rates', [CheckoutController::class, 'rates']);
Route::get('/checkout/success', [CheckoutController::class, 'success'])->middleware('auth');
Route::get('/checkout/cancel',  [CheckoutController::class, 'cancel'])->middleware('auth');
Route::get('/checkout/failed',  [CheckoutController::class, 'failed'])->middleware('auth');
Route::post('/checkout/webhook/yoco', [CheckoutController::class, 'webhook']); // no auth/CSRF — Yoco server-to-server

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Account (requires auth)
Route::middleware('auth')->prefix('account')->group(function () {
    Route::get('/', [AccountController::class, 'index']);
    Route::get('/orders', [AccountController::class, 'orders']);
    Route::get('/orders/{id}', [AccountController::class, 'orderDetail']);
    Route::get('/orders/{id}/receipt', [AccountController::class, 'orderReceipt']);
    Route::get('/garage', [GarageController::class, 'index']);
    Route::post('/garage/add', [GarageController::class, 'add']);
    Route::delete('/garage/{id}', [GarageController::class, 'remove']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    // Addresses
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::post('/addresses/{id}/default', [AddressController::class, 'setDefault']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);

    // Stock Alerts
    Route::get('/alerts', [StockAlertController::class, 'myAlerts']);
    Route::delete('/alerts/{id}', [StockAlertController::class, 'deleteAlert']);
});
