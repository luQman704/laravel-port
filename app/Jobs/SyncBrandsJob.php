<?php
namespace App\Jobs;

use App\Models\Turn14Brand;
use App\Services\Turn14\ApiClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncBrandsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;
    public int $tries = 3;

    public function handle(ApiClient $api): void
    {
        Log::info('SyncBrandsJob: starting');
        $page = 1;

        do {
            $data = $api->getBrands($page);
            $brands = $data['data'] ?? [];

            foreach ($brands as $brand) {
                Turn14Brand::updateOrCreate(
                    ['brand_id' => $brand['id']],
                    [
                        'name'         => $brand['attributes']['name'] ?? '',
                        'logo'         => $brand['attributes']['logo'] ?? '',
                        'sync_active'  => 1,
                        'date_add'     => now(),
                    ]
                );
            }

            $page++;
            $hasMore = isset($data['links']['next']);
        } while ($hasMore && !empty($brands));

        Log::info('SyncBrandsJob: done');
    }
}
