<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_featured_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('turn14_product_id');
            // 'trending' = Top Trending, 'popular' = Popular Products tabs
            $table->string('section', 32)->default('trending');
            // Only used when section = 'popular', to group by category tab
            $table->string('category_tab', 64)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_featured_products');
    }
};
