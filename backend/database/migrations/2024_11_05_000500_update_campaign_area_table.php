<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            if (! Schema::hasColumn('campaign_area', 'area_id')) {
                Schema::table('campaign_area', function (Blueprint $table) {
                    $table->integer('area_id')->nullable()->after('campaign_id');
                });
            }

            return;
        }

        Schema::table('campaign_area', function (Blueprint $table) {
            if (Schema::hasColumn('campaign_area', 'geo_area_id')) {
                $table->dropUnique('campaign_area_campaign_id_geo_area_id_unique');
                $table->dropForeign(['geo_area_id']);
                $table->dropColumn('geo_area_id');
            }

            if (! Schema::hasColumn('campaign_area', 'area_id')) {
                $table->foreignId('area_id')
                    ->after('campaign_id')
                    ->constrained('areas')
                    ->cascadeOnDelete();
            }

            $table->unique(['campaign_id', 'area_id']);
        });
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('campaign_area', function (Blueprint $table) {
            $table->dropUnique('campaign_area_campaign_id_area_id_unique');

            if (Schema::hasColumn('campaign_area', 'area_id')) {
                $table->dropForeign(['area_id']);
                $table->dropColumn('area_id');
            }

            if (! Schema::hasColumn('campaign_area', 'geo_area_id')) {
                $table->foreignId('geo_area_id')
                    ->after('campaign_id')
                    ->constrained('geo_areas')
                    ->cascadeOnDelete();
                $table->unique(['campaign_id', 'geo_area_id']);
            }
        });
    }
};
