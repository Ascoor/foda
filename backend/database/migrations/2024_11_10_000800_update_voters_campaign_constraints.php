<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            if (! Schema::hasColumn('voters', 'national_id')) {
                $table->string('national_id')->nullable()->after('voter_id');
            }

            if (Schema::hasColumn('voters', 'voter_uid')) {
                $table->dropUnique('voters_campaign_voter_uid_unique');
            }

            $table->unique(['campaign_id', 'national_id'], 'voters_campaign_national_unique');
            $table->index(['campaign_id', 'name'], 'voters_campaign_name_idx');
        });
    }

    public function down(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            $table->dropUnique('voters_campaign_national_unique');
            $table->dropIndex('voters_campaign_name_idx');

            if (Schema::hasColumn('voters', 'national_id')) {
                $table->dropColumn('national_id');
            }

            if (Schema::hasColumn('voters', 'voter_uid')) {
                $table->unique(['campaign_id', 'voter_uid'], 'voters_campaign_voter_uid_unique');
            }
        });
    }
};
