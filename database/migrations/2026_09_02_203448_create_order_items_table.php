<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id');
            $table->string('turn14_product_id', 16);
            $table->string('product_name');
            $table->string('part_number');
            $table->string('brand_name')->nullable();
            $table->unsignedInteger('qty');
            $table->decimal('unit_price_excl', 10, 2);
            $table->decimal('unit_price_incl', 10, 2);
            $table->decimal('line_total_incl', 10, 2);

            $table->foreign('order_id')->references('id')->on('orders')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
