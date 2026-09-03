<?php
namespace App\Jobs;

use App\Models\Turn14Stock;
use App\Services\Turn14\ApiClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncStockDeltaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $tries = 3;

    public function handle(ApiClient $api): void
    {
        Log::info('SyncStockDeltaJob: starting');
        $page = 1;

        do {
            $data     = $api->getItemInventory($page);
            $items    = $data['data'] ?? [];

            foreach ($items as $item) {
                $t14Id = (string)($item['id'] ?? '');
                if (!$t14Id) continue;

                $attrs     = $item['attributes'] ?? [];
                $inventory = $attrs['inventory'] ?? [];

                $localQty  = 0;
                $usaQty    = 0;
                $warehouseStock = [];

                foreach ($inventory as $loc) {
                    $qty = (int)($loc['quantity'] ?? 0);
                    $locName = $loc['location'] ?? '';
                    if (str_contains(strtolower($locName), 'local') || str_contains(strtolower($locName), 'sa')) {
                        $localQty += $qty;
                    } else {
                        $usaQty += $qty;
                        $warehouseStock[$locName] = $qty;
                    }
                }

                Turn14Stock::updateOrCreate(
                    ['turn14_product_id' => $t14Id],
                    [
                        'quantity'        => $localQty,
                        'mfr_quantity'    => (int)($attrs['mfrQuantity'] ?? 0),
                        'mfr_esd'         => $attrs['mfrEsd'] ?? null,
                        'warehouse_stock' => json_encode($warehouseStock),
                        'date_upd'        => now(),
                    ]
                );
            }

            $page++;
            $hasMore = isset($data['links']['next']);
        } while ($hasMore && !empty($items));

        Log::info('SyncStockDeltaJob: done');
    }
}
