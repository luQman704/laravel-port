<?php
namespace App\Console\Commands;

use App\Services\Turn14\Turn14ImageService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FetchProductImages extends Command
{
    protected $signature = 'turn14:fetch-images
                            {--limit=200 : Max products to process in this run}
                            {--all : Re-fetch even already-cached products}
                            {--delay=300 : Milliseconds between API calls}';

    protected $description = 'Pre-fetch product images from Turn14 API and cache them in the media table';

    public function handle(Turn14ImageService $imageService): int
    {
        $limit  = (int) $this->option('limit');
        $all    = (bool) $this->option('all');
        $delay  = (int) $this->option('delay');

        $this->info("Fetching images for up to {$limit} products...");

        // Build the query
        $query = DB::table('new902_turn14_product as p')
            ->where('p.sync_active', 1)
            ->where('p.discontinued', 0)
            ->select('p.id');

        if (!$all) {
            // Only products with no cached media at all
            $query->whereNotExists(function ($q) {
                $q->from('new902_turn14_product_media as m')
                  ->whereColumn('m.turn14_product_id', 'p.id');
            });
        }

        $products = $query->orderBy('p.id')->limit($limit)->get();

        if ($products->isEmpty()) {
            $this->info('No products need image fetching — all cached.');
            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        $fetched = 0;
        $failed  = 0;

        foreach ($products as $product) {
            try {
                $images = $imageService->getImages($product->id);
                $fetched++;
            } catch (\Throwable $e) {
                $failed++;
                $this->newLine();
                $this->warn("  Failed {$product->id}: " . $e->getMessage());
            }

            $bar->advance();

            if ($delay > 0) {
                usleep($delay * 1000);
            }
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Done. Fetched: {$fetched}, Failed: {$failed}");

        return self::SUCCESS;
    }
}
