<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncStockFullJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 3600;
    public int $tries = 2;

    public function handle(SyncStockDeltaJob $deltaJob): void
    {
        // Full stock sync = same as delta (Turn14 returns full inventory each time)
        Log::info('SyncStockFullJob: starting (same as delta)');
        app()->call([$deltaJob, 'handle']);
    }
}
