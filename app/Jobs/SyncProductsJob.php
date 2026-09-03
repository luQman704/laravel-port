<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class SyncProductsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 3600;
    public int $tries = 2;

    public function handle(): void
    {
        // Full product sync is resource-intensive — delegate to artisan command
        // which mirrors the PS module's turn14import cron scripts.
        Log::info('SyncProductsJob: dispatching artisan command');
        Artisan::call('turn14:sync-products');
    }
}
