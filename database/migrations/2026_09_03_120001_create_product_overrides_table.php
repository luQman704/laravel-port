<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('turn14_product_overrides', function (Blueprint $table) {
            $table->id();
            $table->string('turn14_product_id', 64)->unique();
            $table->string('product_name')->nullable();
            $table->decimal('weight', 10, 4)->nullable();
            $table->decimal('length', 10, 4)->nullable();
            $table->decimal('width',  10, 4)->nullable();
            $table->decimal('height', 10, 4)->nullable();
            $table->string('category')->nullable();
            $table->string('subcategory')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('turn14_product_overrides');
    }
};
