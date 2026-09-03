<?php
namespace App\Services\Turn14;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApiClient
{
    private string $apiUrl;
    private string $clientId;
    private string $clientSecret;

    public function __construct()
    {
        // DB settings take precedence over config (set via Turn14Settings admin page)
        $this->apiUrl       = rtrim(Setting::get('turn14.api_url',       config('turn14.api_url', 'https://api.turn14.com/v1')), '/');
        $this->clientId     = Setting::get('turn14.client_id',     config('turn14.client_id', ''));
        $this->clientSecret = Setting::get('turn14.client_secret', config('turn14.client_secret', ''));
    }

    // ── Token ──────────────────────────────────────────────────────────────────

    private function getToken(): string
    {
        // Check for a cached token with >10s remaining
        $expire = (int) Setting::get('turn14.token_expire', 0);
        if ($expire - time() > 10) {
            return (string) Setting::get('turn14.token', '');
        }

        return $this->fetchToken();
    }

    private function fetchToken(): string
    {
        if (!$this->clientId || !$this->clientSecret) {
            return '';
        }

        $response = Http::post("{$this->apiUrl}/token", [
            'grant_type'    => 'client_credentials',
            'client_id'     => $this->clientId,
            'client_secret' => $this->clientSecret,
        ]);

        if ($response->failed()) {
            Log::error('[Turn14 ApiClient] Token fetch failed', ['status' => $response->status()]);
            return '';
        }

        $data  = $response->json();
        $token = $data['access_token'] ?? '';

        if ($token) {
            $expiresIn = (int) ($data['expires_in'] ?? 3600);
            Setting::set('turn14.token', $token);
            Setting::set('turn14.token_expire', (string)(time() + $expiresIn));
            // Also cache in-process for this request
            Cache::put('turn14_access_token', $token, $expiresIn - 10);
        }

        return $token;
    }

    // ── HTTP ───────────────────────────────────────────────────────────────────

    public function get(string $endpoint, array $params = []): array
    {
        $token = $this->getToken();
        if (!$token) {
            return [];
        }

        $response = Http::withToken($token)
            ->timeout(20)
            ->get("{$this->apiUrl}/{$endpoint}", $params);

        // Token expired mid-flight — re-auth once
        if ($response->unauthorized()) {
            Setting::set('turn14.token_expire', '0');
            Cache::forget('turn14_access_token');
            $token    = $this->fetchToken();
            $response = Http::withToken($token)
                ->timeout(20)
                ->get("{$this->apiUrl}/{$endpoint}", $params);
        }

        if ($response->failed()) {
            Log::warning("[Turn14 ApiClient] GET {$endpoint} failed", ['status' => $response->status()]);
            return [];
        }

        return $response->json() ?? [];
    }

    // ── Domain endpoints ───────────────────────────────────────────────────────

    public function getBrands(int $page = 1): array
    {
        return $this->get('brands', ['page' => $page]);
    }

    public function getItems(int $page = 1): array
    {
        return $this->get('items', ['page' => $page]);
    }

    public function getItemPricing(int $page = 1): array
    {
        return $this->get('pricing', ['page' => $page]);
    }

    public function getItemInventory(int $page = 1): array
    {
        return $this->get('inventory', ['page' => $page]);
    }

    public function getItemInventoryByBrand(int $brandId, int $page = 1): array
    {
        return $this->get("inventory/brand/{$brandId}", ['page' => $page]);
    }

    /**
     * Fetch full item data (including files/images) for a single product.
     * Endpoint: GET /v1/items/data/{id}
     * Response: { data: [ { id, files: [...], ... } ] }
     */
    public function getItemData(string $turn14Id): array
    {
        return $this->get('items/data/' . rawurlencode($turn14Id));
    }
}
