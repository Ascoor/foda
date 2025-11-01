<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('committees', function (Blueprint $table) {
            if (!Schema::hasColumn('committees', 'code')) {
                $table->string('code')->nullable()->after('geo_area_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('committees', function (Blueprint $table) {
            if (Schema::hasColumn('committees', 'code')) {
                $table->dropColumn('code');
            }
        });
    }
};
