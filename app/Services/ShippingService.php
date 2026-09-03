<?php
namespace App\Services;

class ShippingService
{
    // VAT rate applied to shipping cost
    const VAT = 0.15;

    public function __construct(
        private readonly ShipLogicService $shipLogic,
    ) {}

    /**
     * Calculate total cart weight in kg.
     * Turn14 stores weight in lbs; convert to kg.
     */
    public function cartWeightKg(array $contents): float
    {
        $totalKg = 0;
        foreach ($contents as $row) {
            $product = $row['product'] ?? [];
            $qty     = $row['item']->qty ?? 1;

            // weight is in lbs from Turn14; 1 lb = 0.453592 kg
            $weightLbs = (float) ($product['weight'] ?? 0);
            $weightKg  = $weightLbs * 0.453592;

            // Volumetric weight: (L × W × H in cm) / 5000
            $volKg = 0;
            $l = (float) ($product['length'] ?? 0) * 2.54; // inches → cm
            $w = (float) ($product['width']  ?? 0) * 2.54;
            $h = (float) ($product['height'] ?? 0) * 2.54;
            if ($l > 0 && $w > 0 && $h > 0) {
                $volKg = ($l * $w * $h) / 5000;
            }

            $itemKg     = max($weightKg, $volKg);
            $totalKg   += $itemKg * $qty;
        }

        // Apply 10% weight inflation (as per PS)
        return max(0.1, $totalKg * 1.10);
    }

    /**
     * Build a consolidated single-parcel array from cart contents.
     * Returns an array suitable for the ShipLogic parcels field.
     */
    public function cartParcels(array $contents): array
    {
        $weightKg    = $this->cartWeightKg($contents);
        $totalVolume = 0.0; // cubic cm

        foreach ($contents as $row) {
            $product = $row['product'] ?? [];
            $qty     = $row['item']->qty ?? 1;

            $l = (float) ($product['length'] ?? 0) * 2.54; // inches → cm
            $w = (float) ($product['width']  ?? 0) * 2.54;
            $h = (float) ($product['height'] ?? 0) * 2.54;

            if ($l > 0 && $w > 0 && $h > 0) {
                $totalVolume += $l * $w * $h * $qty;
            }
        }

        if ($totalVolume > 0) {
            // Cube root of total volume gives a single-side dimension
            $side = max(10.0, round(pow($totalVolume, 1 / 3), 1));
        } else {
            $side = 30.0;
        }

        return [
            [
                'submitted_length_cm' => $side,
                'submitted_width_cm'  => $side,
                'submitted_height_cm' => $side,
                'submitted_weight_kg' => max(0.1, $weightKg),
            ],
        ];
    }

    /**
     * Fixed options that are always available regardless of delivery address.
     */
    public function staticOptions(): array
    {
        return [
            [
                'carrier'      => 'Click & Collect',
                'service_code' => 'COLLECT',
                'service_name' => 'Collect in Person',
                'description'  => 'Not packaged or bubble wrapped. Collect from our warehouse in Benoni.',
                'price_excl'   => 0.0,
                'price_incl'   => 0.0,
                'vat'          => 0.0,
                'is_static'    => true,
            ],
            [
                'carrier'      => 'Own Arrangement',
                'service_code' => 'OWN_COURIER',
                'service_name' => 'Arrange own Courier',
                'description'  => 'Boxed & bubble wrapped. You arrange your own courier collection.',
                'price_excl'   => round(25.00 / 1.15, 2),
                'price_incl'   => 25.00,
                'vat'          => round(25.00 - 25.00 / 1.15, 2),
                'is_static'    => true,
            ],
        ];
    }

    /**
     * Get live TCG shipping options for the given parcels and delivery address.
     * Delegates to ShipLogic API — does NOT include static options.
     */
    public function getOptions(array $parcels, array $deliveryAddress): array
    {
        return $this->shipLogic->getRates($parcels, $deliveryAddress);
    }

    /**
     * Lookup a single shipping option by service code.
     * Checks static options first, then live TCG rates.
     */
    public function getOption(array $parcels, string $serviceCode, array $deliveryAddress): ?array
    {
        foreach ($this->staticOptions() as $opt) {
            if ($opt['service_code'] === $serviceCode) return $opt;
        }

        $options = $this->getOptions($parcels, $deliveryAddress);
        foreach ($options as $opt) {
            if ($opt['service_code'] === $serviceCode) return $opt;
        }
        return null;
    }
}
