<?php
return [
    'exchange_rate'         => (float) env('TURN14_EXCHANGE_RATE', 17),
    'customs_duty'          => (float) env('TURN14_CUSTOMS_DUTY', 10),
    'markup_rate'           => (float) env('TURN14_MARKUP_RATE', 0.7),
    'tax_rate'              => (float) env('TURN14_TAX_RATE', 15),
    'freight_discount'      => (float) env('TURN14_FREIGHT_DISCOUNT', 50),
    'fuel_surcharge'        => (float) env('TURN14_FUEL_SURCHARGE', 48),
    'disbursement_rate'     => (float) env('TURN14_DISBURSEMENT_FEE_RATE', 4),
    'disbursement_min'      => (float) env('TURN14_DISBURSEMENT_FEE_MIN', 105),
    'ltl_shipping_cost'     => (float) env('TURN14_LTL_SHIPPING_COST', 1000),
    'price_rounding'        => (float) env('TURN14_PRICE_ROUNDING', 5),
    'weight_inflation'      => (float) env('TURN14_WEIGHT_INFLATION', 10),
    'api_url'               => env('TURN14_API_URL', 'https://api.turn14.com/v1/'),
    'client_id'             => env('TURN14_CLIENT_ID'),
    'client_secret'         => env('TURN14_CLIENT_SECRET'),
];
