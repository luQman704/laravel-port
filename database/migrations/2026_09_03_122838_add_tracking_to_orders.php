<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('shiplogic_shipment_id')->nullable()->after('yoco_checkout_id');
            $table->string('waybill_number', 64)->nullable()->after('shiplogic_shipment_id');
            $table->decimal('cart_weight_kg', 8, 3)->nullable()->after('waybill_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['shiplogic_shipment_id', 'waybill_number', 'cart_weight_kg']);
        });
    }
};
