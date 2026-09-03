<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('new902_turn14_brand', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('sync_active');
            $table->string('logo_url')->nullable()->after('logo');
        });
    }

    public function down(): void
    {
        Schema::table('new902_turn14_brand', function (Blueprint $table) {
            $table->dropColumn(['is_featured', 'logo_url']);
        });
    }
};
