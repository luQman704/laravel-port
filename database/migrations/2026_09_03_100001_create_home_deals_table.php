<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_deals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('turn14_product_id');
            $table->decimal('deal_price_incl', 12, 2)->nullable();
            $table->decimal('deal_price_excl', 12, 2)->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_deals');
    }
};
