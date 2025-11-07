<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('volunteers', function (Blueprint $table) {
            if (! Schema::hasColumn('volunteers', 'tags')) {
                $table->json('tags')->nullable()->after('phone');
            }
        });
    }

    public function down(): void
    {
        Schema::table('volunteers', function (Blueprint $table) {
            if (Schema::hasColumn('volunteers', 'tags')) {
                $table->dropColumn('tags');
            }
        });
    }
};
