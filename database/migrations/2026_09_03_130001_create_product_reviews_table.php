<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->string('turn14_product_id', 64)->index();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('reviewer_name', 100);
            $table->string('reviewer_email', 255)->nullable();
            $table->string('title', 100)->nullable();
            $table->text('body');
            $table->unsignedTinyInteger('rating'); // 1–5
            $table->enum('status', ['pending', 'published'])->default('published');
            $table->timestamps();
            $table->index(['turn14_product_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};
