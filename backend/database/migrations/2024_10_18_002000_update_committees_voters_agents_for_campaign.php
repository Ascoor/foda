<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Committees ---------------------------------------------------------
        Schema::table('committees', function (Blueprint $table) {
            if (!Schema::hasColumn('committees', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }

            if (!Schema::hasColumn('committees', 'code')) {
                $table->string('code')->nullable()->after('campaign_id');
            }

            $table->unique(['campaign_id', 'code'], 'committees_campaign_code_unique');
            $table->index(['campaign_id', 'name'], 'committees_campaign_name_idx');
        });

        // Voters -------------------------------------------------------------
        Schema::table('voters', function (Blueprint $table) {
            if (!Schema::hasColumn('voters', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }

            if (!Schema::hasColumn('voters', 'voter_uid')) {
                $table->string('voter_uid')->nullable()->after('voter_id');
            }

            $table->index('voter_uid', 'voters_voter_uid_idx');
            $table->unique(['campaign_id', 'voter_uid'], 'voters_campaign_voter_uid_unique');
            $table->index(['campaign_id', 'committee_id'], 'voters_campaign_committee_idx');
        });

        // Agents -------------------------------------------------------------
        Schema::table('agents', function (Blueprint $table) {
            if (!Schema::hasColumn('agents', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }

            if (!Schema::hasColumn('agents', 'person_id')) {
                $table->foreignId('person_id')
                    ->after('campaign_id')
                    ->constrained('volunteers')
                    ->cascadeOnDelete();
            }

            if (!Schema::hasColumn('agents', 'active')) {
                $table->boolean('active')->default(true)->after('committee_id');
            }

            if (!Schema::hasColumn('agents', 'assigned_at')) {
                $table->date('assigned_at')->nullable()->after('active');
            }

            if (!Schema::hasColumn('agents', 'ended_at')) {
                $table->date('ended_at')->nullable()->after('assigned_at');
            }

            if (!Schema::hasColumn('agents', 'meta')) {
                $table->json('meta')->nullable()->after('ended_at');
            }

            $table->unique(['campaign_id', 'person_id'], 'agents_campaign_person_unique');
            $table->unique(['person_id'], 'agents_person_unique');
            $table->index(['campaign_id', 'committee_id'], 'agents_campaign_committee_idx');
        });
    }

    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            if (Schema::hasColumn('agents', 'meta')) {
                $table->dropColumn('meta');
            }

            if (Schema::hasColumn('agents', 'ended_at')) {
                $table->dropColumn('ended_at');
            }

            if (Schema::hasColumn('agents', 'assigned_at')) {
                $table->dropColumn('assigned_at');
            }

            if (Schema::hasColumn('agents', 'active')) {
                $table->dropColumn('active');
            }

            if (Schema::hasColumn('agents', 'person_id')) {
                $table->dropConstrainedForeignId('person_id');
            }

            if (Schema::hasColumn('agents', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }

            $table->dropUnique('agents_campaign_person_unique');
            $table->dropUnique('agents_person_unique');
            $table->dropIndex('agents_campaign_committee_idx');
        });

        Schema::table('voters', function (Blueprint $table) {
            $table->dropUnique('voters_campaign_voter_uid_unique');
            $table->dropIndex('voters_campaign_committee_idx');
            $table->dropIndex('voters_voter_uid_idx');

            if (Schema::hasColumn('voters', 'voter_uid')) {
                $table->dropColumn('voter_uid');
            }

            if (Schema::hasColumn('voters', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });

        Schema::table('committees', function (Blueprint $table) {
            $table->dropUnique('committees_campaign_code_unique');
            $table->dropIndex('committees_campaign_name_idx');

            if (Schema::hasColumn('committees', 'code')) {
                $table->dropColumn('code');
            }

            if (Schema::hasColumn('committees', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });
    }
};
