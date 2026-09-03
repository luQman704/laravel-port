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
            $table->text('order_notes')->nullable()->after('shipping_email');
            $table->boolean('gift_wrapped')->default(false)->after('order_notes');
            $table->decimal('gift_wrap_cost', 10, 2)->default(0)->after('gift_wrapped');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['order_notes', 'gift_wrapped', 'gift_wrap_cost']);
        });
    }
};
