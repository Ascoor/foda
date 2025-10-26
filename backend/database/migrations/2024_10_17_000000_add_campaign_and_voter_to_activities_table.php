<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            if (!Schema::hasColumn('activities', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable()
                    ->after('committee_id')
                    ->constrained('campaigns')
                    ->nullOnDelete();
            }

            if (!Schema::hasColumn('activities', 'voter_id')) {
                $table->foreignId('voter_id')
                    ->nullable()
                    ->after('campaign_id')
                    ->constrained('voters')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            if (Schema::hasColumn('activities', 'voter_id')) {
                $table->dropConstrainedForeignId('voter_id');
            }

            if (Schema::hasColumn('activities', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });
    }
};
