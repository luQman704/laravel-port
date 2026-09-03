<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->string('carrier', 50)->default('thecourierguy');
            $table->string('service_code', 60);       // e.g. THE_COURIER_GUY_ECO
            $table->string('service_name', 100);      // e.g. Economy (3-5 days)
            $table->decimal('weight_from', 8, 2);     // kg, inclusive lower bound
            $table->decimal('weight_to',   8, 2);     // kg, inclusive upper bound
            $table->decimal('base_price',  10, 2);    // ZAR excl. VAT
            $table->boolean('is_active')->default(true);
        });

        // Seed The Courier Guy rates (ZAR excl. VAT, based on PS weight_range data)
        // Economy: ~3-5 business days
        // Overnight: next business day
        // Same Day: same day delivery (Gauteng metros only)
        DB::table('shipping_rates')->insert([
            // Economy
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_ECO','service_name'=>'Economy (3-5 days)','weight_from'=>0,'weight_to'=>1,'base_price'=>79,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_ECO','service_name'=>'Economy (3-5 days)','weight_from'=>1,'weight_to'=>2,'base_price'=>89,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_ECO','service_name'=>'Economy (3-5 days)','weight_from'=>2,'weight_to'=>5,'base_price'=>109,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_ECO','service_name'=>'Economy (3-5 days)','weight_from'=>5,'weight_to'=>10,'base_price'=>159,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_ECO','service_name'=>'Economy (3-5 days)','weight_from'=>10,'weight_to'=>20,'base_price'=>229,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_ECO','service_name'=>'Economy (3-5 days)','weight_from'=>20,'weight_to'=>50,'base_price'=>359,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_ECO','service_name'=>'Economy (3-5 days)','weight_from'=>50,'weight_to'=>999,'base_price'=>599,'is_active'=>1],
            // Overnight
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_OVN','service_name'=>'Overnight (next day)','weight_from'=>0,'weight_to'=>1,'base_price'=>149,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_OVN','service_name'=>'Overnight (next day)','weight_from'=>1,'weight_to'=>2,'base_price'=>179,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_OVN','service_name'=>'Overnight (next day)','weight_from'=>2,'weight_to'=>5,'base_price'=>219,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_OVN','service_name'=>'Overnight (next day)','weight_from'=>5,'weight_to'=>10,'base_price'=>299,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_OVN','service_name'=>'Overnight (next day)','weight_from'=>10,'weight_to'=>20,'base_price'=>429,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_OVN','service_name'=>'Overnight (next day)','weight_from'=>20,'weight_to'=>50,'base_price'=>649,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_OVN','service_name'=>'Overnight (next day)','weight_from'=>50,'weight_to'=>999,'base_price'=>999,'is_active'=>1],
            // Same Day (Gauteng only, flat rate tiers)
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_SAME_DAY','service_name'=>'Same Day (Gauteng only)','weight_from'=>0,'weight_to'=>2,'base_price'=>199,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_SAME_DAY','service_name'=>'Same Day (Gauteng only)','weight_from'=>2,'weight_to'=>5,'base_price'=>269,'is_active'=>1],
            ['carrier'=>'thecourierguy','service_code'=>'THE_COURIER_GUY_SAME_DAY','service_name'=>'Same Day (Gauteng only)','weight_from'=>5,'weight_to'=>999,'base_price'=>399,'is_active'=>1],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_rates');
    }
};
