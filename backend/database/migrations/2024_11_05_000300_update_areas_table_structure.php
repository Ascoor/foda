<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            if (! Schema::hasColumn('areas', 'name_ar')) {
                $table->string('name_ar', 150)->nullable()->after('name');
            }

            if (! Schema::hasColumn('areas', 'name_en')) {
                $table->string('name_en', 150)->nullable()->after('name_ar');
            }

            if (! Schema::hasColumn('areas', 'slug')) {
                $table->string('slug', 180)->nullable()->after('name_en');
                $table->unique('slug');
            }

            if (! Schema::hasColumn('areas', 'type')) {
                $table->string('type', 50)->nullable()->after('slug');
            }

            if (! Schema::hasColumn('areas', 'level')) {
                $table->unsignedTinyInteger('level')->default(0)->after('type');
            }

            if (! Schema::hasColumn('areas', 'parent_id')) {
                $table->foreignId('parent_id')
                    ->nullable()
                    ->after('level')
                    ->constrained('areas')
                    ->nullOnDelete();
            }

            if (! Schema::hasColumn('areas', 'code')) {
                $table->string('code', 50)->nullable()->after('parent_id');
            }

            if (! Schema::hasColumn('areas', 'meta')) {
                $table->json('meta')->nullable()->after('code');
            }

            if (! Schema::hasColumn('areas', 'lat')) {
                $table->decimal('lat', 10, 6)->nullable()->after('meta');
            }

            if (! Schema::hasColumn('areas', 'lng')) {
                $table->decimal('lng', 10, 6)->nullable()->after('lat');
            }
        });
    }

    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            if (Schema::hasColumn('areas', 'lng')) {
                $table->dropColumn('lng');
            }

            if (Schema::hasColumn('areas', 'lat')) {
                $table->dropColumn('lat');
            }

            if (Schema::hasColumn('areas', 'meta')) {
                $table->dropColumn('meta');
            }

            if (Schema::hasColumn('areas', 'code')) {
                $table->dropColumn('code');
            }

            if (Schema::hasColumn('areas', 'parent_id')) {
                $table->dropConstrainedForeignId('parent_id');
            }

            if (Schema::hasColumn('areas', 'level')) {
                $table->dropColumn('level');
            }

            if (Schema::hasColumn('areas', 'type')) {
                $table->dropColumn('type');
            }

            if (Schema::hasColumn('areas', 'slug')) {
                $table->dropUnique('areas_slug_unique');
                $table->dropColumn('slug');
            }

            if (Schema::hasColumn('areas', 'name_en')) {
                $table->dropColumn('name_en');
            }

            if (Schema::hasColumn('areas', 'name_ar')) {
                $table->dropColumn('name_ar');
            }
        });
    }
};
