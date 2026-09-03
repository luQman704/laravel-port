<?php
namespace App\Services\Turn14;

use App\Models\Turn14WeightRange;
use App\Models\Turn14DutyOverride;
use App\Models\Setting;

class PricingService
{
    private array $config;

    public function __construct()
    {
        $base = config('turn14');
        // Allow DB settings to override file config (admin-editable values)
        $keys = ['exchange_rate','customs_duty','markup_rate','tax_rate','freight_discount',
                 'fuel_surcharge','disbursement_rate','disbursement_min','ltl_shipping_cost',
                 'price_rounding','weight_inflation'];
        foreach ($keys as $k) {
            $dbVal = Setting::get("turn14.{$k}");
            if ($dbVal !== null) {
                $base[$k] = (float) $dbVal;
            }
        }
        $this->config = $base;
    }

    /**
     * Calculate ZAR retail price (tax-excl) for a Turn14 product.
     *
     * @param float $usdPrice  USD purchase cost
     * @param array $product   Row/array with weight, dimensions, ltl_freight_required, brand_id, category, subcategory
     */
    public function calcDisplayPrice(float $usdPrice, array $product): float
    {
        if ($usdPrice <= 0) {
            return 0.0;
        }

        $config = $this->config;
        $override = $this->resolveDutyOverride($product);
        if ($override !== null) {
            $config['customs_duty'] = $override;
        }

        return $this->calcPrice($usdPrice, $config, $product);
    }

    public function calcPrice(float $price, array $config, array $product): float
    {
        if ($price <= 0) return 0.0;

        $exchange_rate         = (float)($config['exchange_rate']     ?? 17);
        $customs_duty          = (float)($config['customs_duty']      ?? 10);
        $price_round           = (float)($config['price_rounding']    ?? 5);
        $markup_rate           = (float)($config['markup_rate']       ?? 0.7);
        $tax_rate              = (float)($config['tax_rate']          ?? 15);
        $freight_discount_rate = (float)($config['freight_discount']  ?? 50);
        $fuel_surcharge_rate   = (float)($config['fuel_surcharge']    ?? 48);
        $disbursement_rate     = (float)($config['disbursement_rate'] ?? 4);
        $disbursement_fee_min  = (float)($config['disbursement_min']  ?? 105);
        $ltl_shipping_fee      = (float)($config['ltl_shipping_cost'] ?? 1000);
        $weight_inf            = (float)($config['weight_inflation']  ?? 10);

        // Step 1: ZAR + customs
        $price_zar          = $price * $exchange_rate;
        $price_customs_duty = $price_zar * $customs_duty / 100;

        // Step 2: billable weight
        $highest_weight = 0.0;
        $weight  = (float)($product['weight'] ?? 0);
        $dims    = $product['dimensions'] ?? null;

        if ($weight <= 0 && !empty($dims)) {
            $dimArray = is_array($dims) ? $dims : json_decode($dims, true);
            if (is_array($dimArray)) {
                foreach ($dimArray as $dim) {
                    $w_kg = (float)($dim['weight'] ?? 0) * 0.453592;
                    $vol  = (2.54 * (float)($dim['width']  ?? 0))
                          * (2.54 * (float)($dim['height'] ?? 0))
                          * (2.54 * (float)($dim['length'] ?? 0))
                          / 5000;
                    $highest_weight += max($w_kg, $vol);
                }
            }
        } else {
            $w_kg = $weight * 0.453592;
            $vol  = (2.54 * (float)($product['width']  ?? 0))
                  * (2.54 * (float)($product['height'] ?? 0))
                  * (2.54 * (float)($product['length'] ?? 0))
                  / 5000;
            $highest_weight = max($w_kg, $vol);
        }

        $highest_weight = $highest_weight * (1 + $weight_inf / 100);

        // Step 3: shipping cost
        $shipping_cost_total = 0.0;
        if ($highest_weight <= 0) {
            $shipping_cost_total = $price_zar * 0.5;
        } else {
            $range = Turn14WeightRange::where('from', '<', $highest_weight)
                ->where('to', '>=', $highest_weight)
                ->value('price');

            $shipping_rate = (float)($range ?? 0);

            if ($shipping_rate > 0) {
                $hw_05              = ceil($highest_weight / 0.5) * 0.5;
                $hw_1               = ceil($highest_weight / 1.0) * 1.0;
                $rate_discounted    = $shipping_rate * (100 - $freight_discount_rate) / 100;
                $fuel_surcharge     = $rate_discounted * $fuel_surcharge_rate / 100;
                $cost_less_discount = $rate_discounted + $fuel_surcharge;
                $per_kg             = ($hw_1 < 10)
                    ? $cost_less_discount / $hw_05
                    : $cost_less_discount / $hw_1;
                $hw_rounded          = ceil($highest_weight / 0.1) * 0.1;
                $shipping_cost_total = $per_kg * $hw_rounded;
            } else {
                $shipping_cost_total = $price_zar * 0.5;
            }
        }

        if ($shipping_cost_total < 1) {
            return 0.0;
        }

        // Step 4: disbursement fee
        $disbursement_fee = $price_zar * $disbursement_rate / 100;
        if ($disbursement_fee < $disbursement_fee_min) {
            $disbursement_fee = $disbursement_fee_min;
        }

        // Step 5: markup
        $price_markup = ($price_zar / $markup_rate)
                      + $price_customs_duty
                      + $disbursement_fee
                      + $shipping_cost_total;

        // Step 6: VAT
        $shipping_tax        = $shipping_cost_total * $tax_rate / 100;
        $product_import_tax  = $price_zar           * $tax_rate / 100;
        $total_claimable_tax = $shipping_tax + $product_import_tax;
        $invoice_tax         = $price_markup * $tax_rate / 100;
        $tax_payable         = $invoice_tax  - $total_claimable_tax;

        $retail_price_incl = $price_markup + $tax_payable;

        // Step 7: LTL surcharge
        if (!empty($product['ltl_freight_required'])) {
            $retail_price_incl += $ltl_shipping_fee;
        }

        // Step 8: round and return tax-excl
        $retail_price_incl = ceil($retail_price_incl / $price_round) * $price_round;
        $retail_price_excl = $retail_price_incl * 100 / (100 + $tax_rate);

        return round($retail_price_excl, (int)$price_round);
    }

    public function formatPrice(float $priceExclTax): string
    {
        $taxRate = (float)config('turn14.tax_rate', 15);
        $incl    = $priceExclTax * (1 + $taxRate / 100);
        return 'R ' . number_format($incl, 2, '.', ' ');
    }

    public function inclTax(float $priceExcl): float
    {
        $taxRate = (float)config('turn14.tax_rate', 15);
        return $priceExcl * (1 + $taxRate / 100);
    }

    /**
     * Approximate inverse of the pricing formula for filter range queries.
     * Converts a ZAR incl. price back to an approximate USD purchase cost.
     * Not exact (ignores per-product shipping/disbursement) but close enough for range filtering.
     */
    public function zarToUsdApprox(float $zarIncl): float
    {
        if ($zarIncl <= 0) return 0.0;
        $rate   = (float)($this->config['exchange_rate'] ?? 17);
        $duty   = (float)($this->config['customs_duty']  ?? 10);
        $markup = (float)($this->config['markup_rate']   ?? 0.7);
        // Inverse of: usd * rate / markup * (1+duty/100) * ~1.15
        return $zarIncl * $markup / $rate / (1 + $duty / 100) / 1.15;
    }

    private function resolveDutyOverride(array $product): ?float
    {
        $brandId = $product['brand_id'] ?? null;
        if ($brandId) {
            $override = Turn14DutyOverride::where('type', 'brand')
                ->where('brand_id', $brandId)
                ->value('duty_rate');
            if ($override !== null) return (float)$override;
        }

        $name = strtolower(($product['product_name'] ?? '') . ' ' . ($product['part_description'] ?? ''));
        $keywordOverrides = Turn14DutyOverride::where('type', 'keyword')->get();
        foreach ($keywordOverrides as $row) {
            if ($row->keyword && str_contains($name, strtolower($row->keyword))) {
                return (float)$row->duty_rate;
            }
        }

        return null;
    }
}
