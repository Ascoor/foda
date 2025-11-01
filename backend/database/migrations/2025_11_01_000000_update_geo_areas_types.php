<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        DB::transaction(function () {
            if (Schema::hasColumn('geo_areas', 'type')) {
                DB::table('geo_areas')->where('type', 'circle')->update(['type' => 'markaz']);

                Schema::table('geo_areas', function (Blueprint $table) {
                    $table->enum('type', ['governorate', 'markaz', 'qesm', 'city', 'neighborhood'])->change();
                });
            }
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('geo_areas', 'type')) {
            Schema::table('geo_areas', function (Blueprint $table) {
                $table->enum('type', ['governorate', 'district', 'circle', 'neighborhood'])->change();
            });
        }
    }
};
