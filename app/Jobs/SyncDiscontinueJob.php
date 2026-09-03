<?php
namespace App\Jobs;

use App\Models\Turn14Product;
use App\Services\Turn14\ApiClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncDiscontinueJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;
    public int $tries = 3;

    public function handle(ApiClient $api): void
    {
        Log::info('SyncDiscontinueJob: starting');
        $page = 1;

        do {
            $data  = $api->getItems($page);
            $items = $data['data'] ?? [];

            foreach ($items as $item) {
                $t14Id = (string)($item['id'] ?? '');
                if (!$t14Id) continue;

                $discontinued = (bool)($item['attributes']['discontinued'] ?? false);
                if ($discontinued) {
                    Turn14Product::where('id', $t14Id)
                        ->update(['discontinued' => 1, 'date_upd' => now()]);
                }
            }

            $page++;
            $hasMore = isset($data['links']['next']);
        } while ($hasMore && !empty($items));

        Log::info('SyncDiscontinueJob: done');
    }
}
