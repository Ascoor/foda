<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('committees', function (Blueprint $table) {
            if (Schema::hasColumn('committees', 'geo_area_id')) {
                $table->index('geo_area_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('committees', function (Blueprint $table) {
            if (Schema::hasColumn('committees', 'geo_area_id')) {
                $table->dropIndex(['geo_area_id']);
            }
        });
    }
};
