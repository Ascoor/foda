<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            if (! Schema::hasColumn('teams', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            if (Schema::hasColumn('teams', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });
    }
};
