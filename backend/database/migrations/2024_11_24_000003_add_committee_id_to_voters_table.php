<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            if (! Schema::hasColumn('voters', 'committee_id')) {
                $table->foreignId('committee_id')
                    ->nullable()
                    ->after('geo_area_id')
                    ->constrained('committees')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            if (Schema::hasColumn('voters', 'committee_id')) {
                $table->dropConstrainedForeignId('committee_id');
            }
        });
    }
};
