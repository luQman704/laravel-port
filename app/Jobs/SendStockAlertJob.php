<?php
namespace App\Jobs;

use App\Models\Turn14StockAlert;
use App\Models\Turn14Stock;
use App\Models\Turn14Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendStockAlertJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;

    public function handle(): void
    {
        $alerts = Turn14StockAlert::whereNull('date_notified')->get();

        foreach ($alerts as $alert) {
            $stock = Turn14Stock::where('turn14_product_id', $alert->turn14_product_id)->first();
            if (!$stock) continue;

            $shouldNotify = false;
            if ($alert->watch_local  && $stock->quantity > 0) $shouldNotify = true;
            if ($alert->watch_usa    && $this->getUsaQty($stock) > 0) $shouldNotify = true;
            if ($alert->watch_mfr    && $stock->mfr_quantity > 0) $shouldNotify = true;

            if ($shouldNotify) {
                try {
                    $product = Turn14Product::where('id', $alert->turn14_product_id)->first();
                    Mail::to($alert->email)->send(new \App\Mail\StockAlertNotification($alert, $product, $stock));
                    $alert->update(['date_notified' => now()]);
                } catch (\Throwable $e) {
                    Log::error('SendStockAlertJob: failed for alert '.$alert->id.': '.$e->getMessage());
                }
            }
        }
    }

    private function getUsaQty(Turn14Stock $stock): int
    {
        $ws = $stock->warehouse_stock;
        if (empty($ws)) return 0;
        $arr = is_array($ws) ? $ws : json_decode($ws, true);
        return (int) array_sum(array_values($arr ?? []));
    }
}
