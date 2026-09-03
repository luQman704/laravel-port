<?php
namespace App\Jobs;

use App\Services\Turn14\Turn14ImageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Batch-fetches product images from the Turn14 API for products that have
 * no cached media yet. Processes up to $limit products per run with a small
 * delay to avoid rate limiting.
 */
class FetchProductImagesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 3600;
    public int $tries   = 1;

    public function __construct(
        private int $limit = 500,
        private int $delayMs = 300,
    ) {}

    public function handle(Turn14ImageService $imageService): void
    {
        Log::info("FetchProductImagesJob: starting (limit={$this->limit})");

        $products = DB::table('new902_turn14_product as p')
            ->where('p.sync_active', 1)
            ->where('p.discontinued', 0)
            ->whereNotExists(function ($q) {
                $q->from('new902_turn14_product_media as m')
                  ->whereColumn('m.turn14_product_id', 'p.id');
            })
            ->select('p.id')
            ->orderBy('p.id')
            ->limit($this->limit)
            ->get();

        $fetched = 0;
        $failed  = 0;

        foreach ($products as $product) {
            try {
                $imageService->getImages($product->id);
                $fetched++;
            } catch (\Throwable $e) {
                $failed++;
                Log::warning("FetchProductImagesJob: failed for {$product->id} — " . $e->getMessage());
            }

            if ($this->delayMs > 0) {
                usleep($this->delayMs * 1000);
            }
        }

        Log::info("FetchProductImagesJob: done. Fetched={$fetched}, Failed={$failed}");
    }
}
