<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('geo_areas', function (Blueprint $table) {
            if (! Schema::hasColumn('geo_areas', 'parent_id')) {
                $table->foreignId('parent_id')
                    ->nullable()
                    ->after('name')
                    ->constrained('geo_areas')
                    ->nullOnDelete();
            }

            if (! Schema::hasColumn('geo_areas', 'level')) {
                $table->string('level', 50)->nullable()->after('parent_id');
            }

            if (! Schema::hasColumn('geo_areas', 'code')) {
                $table->string('code', 50)->nullable()->after('level');
                $table->unique('code', 'geo_areas_code_unique');
            }

            if (! Schema::hasColumn('geo_areas', 'meta')) {
                $table->json('meta')->nullable()->after('code');
            }
        });
    }

    public function down(): void
    {
        Schema::table('geo_areas', function (Blueprint $table) {
            if (Schema::hasColumn('geo_areas', 'meta')) {
                $table->dropColumn('meta');
            }

            if (Schema::hasColumn('geo_areas', 'code')) {
                $table->dropUnique('geo_areas_code_unique');
                $table->dropColumn('code');
            }

            if (Schema::hasColumn('geo_areas', 'level')) {
                $table->dropColumn('level');
            }

            if (Schema::hasColumn('geo_areas', 'parent_id')) {
                $table->dropConstrainedForeignId('parent_id');
            }
        });
    }
};
