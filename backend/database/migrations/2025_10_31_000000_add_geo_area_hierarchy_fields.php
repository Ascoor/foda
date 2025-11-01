<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('geo_areas', function (Blueprint $table) {
            if (!Schema::hasColumn('geo_areas', 'parent_id')) {
                $table->foreignId('parent_id')->nullable()->after('election_id')->constrained('geo_areas')->nullOnDelete();
            }

            if (!Schema::hasColumn('geo_areas', 'type')) {
                $table->enum('type', ['governorate', 'district', 'circle', 'neighborhood'])->default('district')->after('parent_id');
            }

            if (!Schema::hasColumn('geo_areas', 'code')) {
                $table->string('code')->nullable()->after('type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('geo_areas', function (Blueprint $table) {
            if (Schema::hasColumn('geo_areas', 'code')) {
                $table->dropColumn('code');
            }

            if (Schema::hasColumn('geo_areas', 'type')) {
                $table->dropColumn('type');
            }

            if (Schema::hasColumn('geo_areas', 'parent_id')) {
                $table->dropConstrainedForeignId('parent_id');
            }
        });
    }
};
