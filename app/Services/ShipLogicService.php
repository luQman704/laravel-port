<?php
namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;

class ShipLogicService
{
    private string $baseUrl = 'https://api.portal.thecourierguy.co.za/v2';

    private function apiKey(): string
    {
        return Setting::get('tcg.api_key', '');
    }

    private function headers(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->apiKey(),
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
        ];
    }

    private function collectionAddress(): array
    {
        return [
            'company'        => Setting::get('tcg.company_name', 'Performance Products SA'),
            'type'           => 'business',
            'street_address' => Setting::get('tcg.address_line1', ''),
            'local_area'     => Setting::get('tcg.address_line2', ''),
            'city'           => Setting::get('tcg.city', ''),
            'zone'           => Setting::get('tcg.province', ''),
            'country'        => 'ZA',
            'code'           => Setting::get('tcg.postal_code', ''),
        ];
    }

    private function collectionContact(): array
    {
        return [
            'name'          => Setting::get('tcg.contact_person', ''),
            'mobile_number' => Setting::get('tcg.contact_phone', ''),
            'email'         => Setting::get('tcg.email', ''),
        ];
    }

    public function getRates(array $parcels, array $deliveryAddress): array
    {
        $payload = [
            'collection_address' => $this->collectionAddress(),
            'delivery_address'   => [
                'street_address' => $deliveryAddress['address_line1'] ?? '',
                'local_area'     => $deliveryAddress['address_line2'] ?? '',
                'city'           => $deliveryAddress['city'] ?? '',
                'zone'           => $deliveryAddress['province'] ?? '',
                'country'        => 'ZA',
                'code'           => $deliveryAddress['postal_code'] ?? '',
                'type'           => 'residential',
            ],
            'parcels' => $parcels,
        ];

        $response = Http::withHeaders($this->headers())
            ->timeout(15)
            ->post("{$this->baseUrl}/rates", $payload);

        if (!$response->successful()) {
            throw new \RuntimeException('ShipLogic rates API error: ' . $response->body());
        }

        $data  = $response->json();
        $rates = [];

        foreach ($data['rates'] ?? [] as $rate) {
            $code      = $rate['service_level']['code'] ?? null;
            $name      = $rate['service_level']['name'] ?? $code;
            $priceIncl = (float) ($rate['rate'] ?? 0);
            $priceExcl = (float) ($rate['rate_excluding_vat'] ?? round($priceIncl / 1.15, 2));

            if ($code === null || $priceIncl <= 0) continue;

            $rates[] = [
                'carrier'      => 'The Courier Guy',
                'service_code' => $code,
                'service_name' => $name,
                'price_excl'   => round($priceExcl, 2),
                'price_incl'   => round($priceIncl, 2),
                'vat'          => round($priceIncl - $priceExcl, 2),
            ];
        }

        return $rates;
    }

    public function createShipment(Order $order, string $serviceLevelCode): array
    {
        $weightKg = (float) ($order->cart_weight_kg ?? 1.0);

        $payload = [
            'collection_address'            => $this->collectionAddress(),
            'collection_contact'            => $this->collectionContact(),
            'delivery_address'              => [
                'street_address' => $order->shipping_address,
                'city'           => $order->shipping_city,
                'zone'           => $order->shipping_province,
                'country'        => 'ZA',
                'code'           => $order->shipping_postal_code,
                'type'           => 'residential',
            ],
            'delivery_contact'              => [
                'name'          => $order->shipping_name,
                'mobile_number' => $order->shipping_phone,
                'email'         => $order->shipping_email,
            ],
            'parcels'                       => [
                [
                    'submitted_length_cm' => 30.0,
                    'submitted_width_cm'  => 30.0,
                    'submitted_height_cm' => 30.0,
                    'submitted_weight_kg' => max(0.1, $weightKg),
                ],
            ],
            'service_level_code'            => strtoupper($serviceLevelCode),
            'customer_reference'            => "ORDER-{$order->id}",
            'special_instructions_delivery' => "Order #{$order->id} — please handle with care.",
        ];

        $response = Http::withHeaders($this->headers())
            ->timeout(30)
            ->post("{$this->baseUrl}/shipments", $payload);

        if (!$response->successful()) {
            throw new \RuntimeException('ShipLogic shipment creation failed: ' . $response->body());
        }

        $data = $response->json();

        return [
            'shipment_id'        => $data['id'] ?? null,
            'tracking_reference' => $data['short_tracking_reference'] ?? null,
        ];
    }

    public function trackShipment(string $trackingReference): array
    {
        $response = Http::withHeaders($this->headers())
            ->timeout(15)
            ->get("{$this->baseUrl}/tracking/shipments", [
                'tracking_reference' => $trackingReference,
            ]);

        $data     = $response->json();
        $shipment = ($data['shipments'] ?? [])[0] ?? null;

        if (!$shipment) {
            throw new \RuntimeException("No shipment found for tracking reference: {$trackingReference}");
        }

        return [
            'status'             => $shipment['status'] ?? null,
            'shipment_id'        => $shipment['shipment_id'] ?? null,
            'tracking_reference' => $shipment['short_tracking_reference'] ?? null,
            'collected_date'     => $shipment['shipment_collected_date'] ?? null,
            'delivered_date'     => $shipment['shipment_delivered_date'] ?? null,
        ];
    }
}
