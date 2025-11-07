<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            if (! Schema::hasColumn('observations', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }

            if (! Schema::hasColumn('observations', 'recorded_at')) {
                $table->dateTime('recorded_at')->nullable()->after('notes');
            }

            if (! Schema::hasColumn('observations', 'meta')) {
                $table->json('meta')->nullable()->after('recorded_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            if (Schema::hasColumn('observations', 'meta')) {
                $table->dropColumn('meta');
            }

            if (Schema::hasColumn('observations', 'recorded_at')) {
                $table->dropColumn('recorded_at');
            }

            if (Schema::hasColumn('observations', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });
    }
};
