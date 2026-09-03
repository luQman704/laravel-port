<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('yoco_checkout_id')->nullable()->after('yoco_charge_id');
            $table->string('shipping_carrier')->nullable()->after('shipping_cost');
            $table->string('shipping_service')->nullable()->after('shipping_carrier');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['yoco_checkout_id', 'shipping_carrier', 'shipping_service']);
        });
    }
};
