<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('title', 4)->nullable()->after('name');
            $table->string('phone', 30)->nullable()->after('email');
            $table->date('birthdate')->nullable()->after('phone');
            $table->boolean('newsletter_subscribed')->default(false)->after('birthdate');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['title', 'phone', 'birthdate', 'newsletter_subscribed']);
        });
    }
};
