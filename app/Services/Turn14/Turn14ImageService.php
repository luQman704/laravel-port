<?php
namespace App\Services\Turn14;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Lazy image fetcher — mirrors the PrestaShop images.php controller logic.
 *
 * First request for a product: calls Turn14 API items/data/{id}, filters out
 * generic/logo/warning images, picks the largest size variant per file,
 * stores results in new902_turn14_product_media.
 *
 * Subsequent requests: served from DB cache (30-day TTL, 7-day for empty results).
 */
class Turn14ImageService
{
    // media_content labels that are never product photos
    private const SKIP_MEDIA_CONTENT = [
        'brand logo', 'logo', 'prop 65', 'prop-65', 'p65',
        'warning', 'caution', 'hazard', 'regulatory', 'safety data',
        'instruction manual', 'owners manual',
    ];

    // URL substrings that identify non-product images (secondary filter)
    private const WARNING_KEYWORDS = [
        'warning', 'p65', 'prop65', 'prop-65', 'caution', 'hazard',
        'regulatory', 'logo', 'instruction',
    ];

    // Turn14 size codes: larger rank = bigger image; no size code = original (rank 4)
    private const SIZE_RANK = ['S' => 1, 'M' => 2, 'L' => 3];

    public function __construct(private readonly ApiClient $api) {}

    /**
     * Return image URLs for a product, fetching from Turn14 API if not cached.
     * Always returns an array (may be empty if no product images exist).
     */
    public function getImages(string $turn14Id): array
    {
        $cached = $this->getCachedImages($turn14Id);
        if ($cached !== null) {
            return $cached;
        }

        // Not yet cached — hit the API
        $images = $this->fetchFromApi($turn14Id);

        // Fall back to large-variant thumbnail if API returned nothing
        if (empty($images)) {
            $row = DB::table('new902_turn14_product')
                ->where('id', $turn14Id)
                ->value('thumbnail');
            if ($row) {
                // Convert thumbnail URL to L-size by replacing size suffix
                $images = [$this->toLargeUrl((string)$row)];
            }
        }

        $this->storeImages($turn14Id, $images);

        return $images;
    }

    // ── Cache ──────────────────────────────────────────────────────────────────

    private function getCachedImages(string $turn14Id): ?array
    {
        $rows = DB::table('new902_turn14_product_media')
            ->where('turn14_product_id', $turn14Id)
            ->orderBy('position')
            ->get(['image_url', 'date_added']);

        if ($rows->isEmpty()) {
            return null; // never fetched
        }

        $latest = $rows->max('date_added');

        // Sentinel rows (image_url = '') = "fetched but found nothing"
        $realImages = $rows->filter(fn($r) => $r->image_url !== '')->values();

        if ($realImages->isEmpty()) {
            // All sentinels — expire after 7 days
            if (strtotime($latest) < time() - 7 * 86400) {
                DB::table('new902_turn14_product_media')
                    ->where('turn14_product_id', $turn14Id)
                    ->delete();
                return null;
            }
            return [];
        }

        // Real images — expire after 30 days
        if (strtotime($latest) < time() - 30 * 86400) {
            DB::table('new902_turn14_product_media')
                ->where('turn14_product_id', $turn14Id)
                ->delete();
            return null;
        }

        return $realImages->pluck('image_url')->all();
    }

    // ── API fetch ──────────────────────────────────────────────────────────────

    private function fetchFromApi(string $turn14Id): array
    {
        try {
            $response = $this->api->getItemData($turn14Id);
        } catch (\Throwable $e) {
            Log::error("[Turn14ImageService] API error for {$turn14Id}: " . $e->getMessage());
            return [];
        }

        if (empty($response['data'])) {
            return [];
        }

        // data is an array — first element is the product
        $data = $response['data'];
        $item = is_array($data) ? ($data[0] ?? null) : $data;

        if (!$item || empty($item['files'])) {
            return [];
        }

        $urls = [];

        foreach ($item['files'] as $file) {
            // Only raster images
            if (($file['type'] ?? '') !== 'Image') {
                continue;
            }

            // Turn14 marks non-product images with generic=true
            if (!empty($file['generic'])) {
                continue;
            }

            // Skip logos, warnings, compliance docs by media_content label
            $mediaContent = strtolower(trim($file['media_content'] ?? ''));
            $skip = false;
            foreach (self::SKIP_MEDIA_CONTENT as $kw) {
                if (str_contains($mediaContent, $kw)) {
                    $skip = true;
                    break;
                }
            }
            if ($skip) continue;

            if (empty($file['links'])) continue;

            // Pick largest size variant
            $best     = null;
            $bestArea = -1;

            foreach ($file['links'] as $link) {
                $url = trim($link['url'] ?? '');
                if (!$url) continue;

                // Secondary URL-based filter
                $urlPath = strtolower(parse_url($url, PHP_URL_PATH) ?? $url);
                $urlSkip = false;
                foreach (self::WARNING_KEYWORDS as $kw) {
                    if (str_contains($urlPath, $kw)) { $urlSkip = true; break; }
                }
                if ($urlSkip) continue;

                $sizeCode = strtoupper(trim($link['size'] ?? ''));
                $rank     = self::SIZE_RANK[$sizeCode] ?? 4; // no code = original = highest

                $w    = (int)($link['width']  ?? 0);
                $h    = (int)($link['height'] ?? 0);
                $area = ($w > 0 && $h > 0) ? $w * $h : 0;

                if ($best === null || $rank > $best['rank'] || ($rank === $best['rank'] && $area > $bestArea)) {
                    $best     = ['url' => $url, 'rank' => $rank];
                    $bestArea = $area;
                }
            }

            if ($best !== null) {
                $urls[] = $best['url'];
            }
        }

        return array_values(array_unique($urls));
    }

    // ── Storage ────────────────────────────────────────────────────────────────

    private function storeImages(string $turn14Id, array $images): void
    {
        $now = now()->toDateTimeString();

        DB::table('new902_turn14_product_media')
            ->where('turn14_product_id', $turn14Id)
            ->delete();

        if (empty($images)) {
            // Sentinel: fetched but nothing found (avoids hammering API on every view)
            DB::table('new902_turn14_product_media')->insert([
                'turn14_product_id' => $turn14Id,
                'image_url'         => '',
                'position'          => 0,
                'date_added'        => $now,
            ]);
            return;
        }

        $rows = [];
        foreach ($images as $i => $url) {
            $rows[] = [
                'turn14_product_id' => $turn14Id,
                'image_url'         => $url,
                'position'          => $i + 1,
                'date_added'        => $now,
            ];
        }
        DB::table('new902_turn14_product_media')->insert($rows);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    /**
     * Attempt to upgrade a thumbnail URL to its large-size variant.
     * Turn14 CDN URLs end in a size code suffix before the extension,
     * e.g. "abc123S.JPG" -> "abc123L.JPG"
     */
    private function toLargeUrl(string $url): string
    {
        return (string) preg_replace('/([A-Z0-9]+)[SM](\.jpe?g)$/i', '$1L$2', $url);
    }
}
