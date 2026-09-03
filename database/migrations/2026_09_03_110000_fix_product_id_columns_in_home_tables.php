<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_deals', function (Blueprint $table) {
            $table->string('turn14_product_id', 64)->change();
        });

        Schema::table('home_featured_products', function (Blueprint $table) {
            $table->string('turn14_product_id', 64)->change();
        });
    }

    public function down(): void
    {
        Schema::table('home_deals', function (Blueprint $table) {
            $table->unsignedBigInteger('turn14_product_id')->change();
        });

        Schema::table('home_featured_products', function (Blueprint $table) {
            $table->unsignedBigInteger('turn14_product_id')->change();
        });
    }
};
