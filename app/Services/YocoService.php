<?php
namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;

class YocoService
{
    private string $secretKey;
    private string $baseUrl = 'https://payments.yoco.com/api';

    public function __construct()
    {
        $this->secretKey = Setting::get('yoco.secret_key', config('services.yoco.secret_key', ''));
    }

    /**
     * Create a Yoco hosted checkout session.
     * Returns ['id' => 'ch_xxx', 'redirectUrl' => 'https://c.yoco.com/...']
     * on success, or throws on failure.
     */
    public function createCheckout(
        int    $amountCents,
        string $successUrl,
        string $cancelUrl,
        string $failureUrl,
        array  $metadata = []
    ): array {
        $response = Http::withToken($this->secretKey)
            ->post("{$this->baseUrl}/checkouts", [
                'amount'     => $amountCents,
                'currency'   => 'ZAR',
                'successUrl' => $successUrl,
                'cancelUrl'  => $cancelUrl,
                'failureUrl' => $failureUrl,
                'metadata'   => $metadata,
            ]);

        $data = $response->json();

        if (!$response->successful() || empty($data['id'])) {
            throw new \RuntimeException(
                $data['displayMessage'] ?? $data['message'] ?? 'Yoco checkout creation failed.'
            );
        }

        return $data; // ['id', 'redirectUrl', ...]
    }

    /**
     * Verify a Yoco checkout by its ID.
     * Returns the checkout object with 'status' field.
     * Possible statuses: created, PAID, cancelled, failed
     */
    public function getCheckout(string $checkoutId): array
    {
        $response = Http::withToken($this->secretKey)
            ->get("{$this->baseUrl}/checkouts/{$checkoutId}");

        return $response->json() ?? [];
    }
}
