<?php

namespace App\Filament\Admin\Pages;

use App\Jobs\FetchProductImagesJob;
use App\Jobs\SyncBrandsJob;
use App\Jobs\SyncDiscontinueJob;
use App\Jobs\SyncProductsJob;
use App\Jobs\SyncStockDeltaJob;
use App\Jobs\SyncStockFullJob;
use App\Models\Turn14Brand;
use App\Models\Turn14Product;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class Turn14Dashboard extends Page
{
    protected static ?string $navigationIcon  = 'heroicon-o-chart-bar';
    protected static ?string $navigationLabel = 'Turn14 Dashboard';
    protected static ?string $navigationGroup = 'Turn14';
    protected static ?int    $navigationSort  = 0;
    protected static string  $view            = 'filament.pages.turn14-dashboard';

    public function getStats(): array
    {
        return [
            'products'       => Turn14Product::where('sync_active', 1)->count(),
            'discontinued'   => Turn14Product::where('discontinued', 1)->count(),
            'brands'         => Turn14Brand::count(),
            'active_brands'  => Turn14Brand::where('sync_active', 1)->count(),
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('sync_brands')
                ->label('Sync Brands')
                ->icon('heroicon-o-arrow-path')
                ->color('gray')
                ->action(function () {
                    SyncBrandsJob::dispatch();
                    Notification::make()->title('Brand sync queued')->success()->send();
                }),

            Action::make('sync_products')
                ->label('Sync Products')
                ->icon('heroicon-o-arrow-path')
                ->color('primary')
                ->requiresConfirmation()
                ->modalHeading('Sync all products?')
                ->modalDescription('This is a long-running job. It will run in the background.')
                ->action(function () {
                    SyncProductsJob::dispatch();
                    Notification::make()->title('Product sync queued')->success()->send();
                }),

            Action::make('sync_stock')
                ->label('Sync Stock (Delta)')
                ->icon('heroicon-o-arrow-path')
                ->color('warning')
                ->action(function () {
                    SyncStockDeltaJob::dispatch();
                    Notification::make()->title('Stock delta sync queued')->success()->send();
                }),

            Action::make('sync_stock_full')
                ->label('Full Stock Crawl')
                ->icon('heroicon-o-arrow-path')
                ->color('danger')
                ->requiresConfirmation()
                ->modalDescription('Full stock crawl is resource-intensive. Only run when needed.')
                ->action(function () {
                    SyncStockFullJob::dispatch();
                    Notification::make()->title('Full stock sync queued')->success()->send();
                }),

            Action::make('sync_discontinue')
                ->label('Check Discontinued')
                ->icon('heroicon-o-x-circle')
                ->color('gray')
                ->action(function () {
                    SyncDiscontinueJob::dispatch();
                    Notification::make()->title('Discontinuation check queued')->success()->send();
                }),

            Action::make('fetch_images')
                ->label('Fetch Product Images')
                ->icon('heroicon-o-photo')
                ->color('info')
                ->requiresConfirmation()
                ->modalHeading('Fetch product images from Turn14?')
                ->modalDescription('This will fetch high-quality images for up to 500 products that have no cached images yet. Run multiple times to cover the full catalogue. Requires queue worker.')
                ->action(function () {
                    FetchProductImagesJob::dispatch(500, 300);
                    Notification::make()->title('Image fetch queued (500 products)')->success()->send();
                }),
        ];
    }
}
