<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $this->updateCommittees();
        $this->updateVoters();
        $this->updateAgents();
        $this->updateVolunteers();
        $this->updateGeoAreas();
        $this->updateEvents();
        $this->updateCandidates();
    }

    public function down(): void
    {
        // This migration is idempotent and does not remove constraints on rollback
    }

    protected function updateCommittees(): void
    {
        Schema::table('committees', function (Blueprint $table) {
            if (! Schema::hasColumn('committees', 'campaign_id')) {
                $table->foreignId('campaign_id')->after('id')->constrained('campaigns')->cascadeOnDelete();
            }

            if (! Schema::hasColumn('committees', 'code')) {
                $table->string('code')->nullable()->after('campaign_id');
            }
        });

        Schema::table('committees', function (Blueprint $table) {
            if (! $this->indexExists('committees', 'committees_campaign_id_index')) {
                $table->index('campaign_id');
            }

            if (Schema::hasColumn('committees', 'code') && ! $this->indexExists('committees', 'committees_campaign_code_unique')) {
                $table->unique(['campaign_id', 'code'], 'committees_campaign_code_unique');
            }
        });
    }

    protected function updateVoters(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            if (! Schema::hasColumn('voters', 'campaign_id')) {
                $table->foreignId('campaign_id')->after('id')->constrained('campaigns')->cascadeOnDelete();
            }

            if (! Schema::hasColumn('voters', 'national_id')) {
                $table->string('national_id')->nullable()->after('name');
            }
        });

        Schema::table('voters', function (Blueprint $table) {
            if (! $this->indexExists('voters', 'voters_campaign_id_index')) {
                $table->index('campaign_id');
            }

            if (Schema::hasColumn('voters', 'committee_id') && ! $this->indexExists('voters', 'voters_campaign_committee_idx')) {
                $table->index(['campaign_id', 'committee_id'], 'voters_campaign_committee_idx');
            }

            if (Schema::hasColumn('voters', 'national_id') && ! $this->indexExists('voters', 'voters_campaign_national_id_unique')) {
                $table->unique(['campaign_id', 'national_id'], 'voters_campaign_national_id_unique');
            }

            if (Schema::hasColumn('voters', 'voter_uid') && ! $this->indexExists('voters', 'voters_campaign_voter_uid_unique')) {
                $table->unique(['campaign_id', 'voter_uid'], 'voters_campaign_voter_uid_unique');
            }
        });
    }

    protected function updateAgents(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            if (! Schema::hasColumn('agents', 'campaign_id')) {
                $table->foreignId('campaign_id')->after('id')->constrained('campaigns')->cascadeOnDelete();
            }
        });

        Schema::table('agents', function (Blueprint $table) {
            if (! $this->indexExists('agents', 'agents_campaign_id_index')) {
                $table->index('campaign_id');
            }

            if (Schema::hasColumn('agents', 'person_id') && ! $this->indexExists('agents', 'agents_campaign_person_unique')) {
                $table->unique(['campaign_id', 'person_id'], 'agents_campaign_person_unique');
            }
        });
    }

    protected function updateVolunteers(): void
    {
        Schema::table('volunteers', function (Blueprint $table) {
            if (! Schema::hasColumn('volunteers', 'campaign_id')) {
                $table->foreignId('campaign_id')->after('id')->constrained('campaigns')->cascadeOnDelete();
            }
        });

        Schema::table('volunteers', function (Blueprint $table) {
            if (! $this->indexExists('volunteers', 'volunteers_campaign_id_index')) {
                $table->index('campaign_id');
            }
        });
    }

    protected function updateGeoAreas(): void
    {
        Schema::table('geo_areas', function (Blueprint $table) {
            if (! Schema::hasColumn('geo_areas', 'campaign_id')) {
                $table->foreignId('campaign_id')->nullable()->after('id')->constrained('campaigns')->nullOnDelete();
            }
        });

        Schema::table('geo_areas', function (Blueprint $table) {
            if (! $this->indexExists('geo_areas', 'geo_areas_campaign_id_index')) {
                $table->index('campaign_id');
            }
        });
    }

    protected function updateEvents(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (! Schema::hasColumn('events', 'campaign_id')) {
                $table->foreignId('campaign_id')->after('id')->constrained('campaigns')->cascadeOnDelete();
            }
        });

        Schema::table('events', function (Blueprint $table) {
            if (! $this->indexExists('events', 'events_campaign_id_index')) {
                $table->index('campaign_id');
            }
        });
    }

    protected function updateCandidates(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            if (! Schema::hasColumn('candidates', 'campaign_id')) {
                $table->foreignId('campaign_id')->after('id')->constrained('campaigns')->cascadeOnDelete();
            }
        });

        Schema::table('candidates', function (Blueprint $table) {
            if (! $this->indexExists('candidates', 'candidates_campaign_id_index')) {
                $table->index('campaign_id');
            }
        });
    }

    protected function indexExists(string $table, string $indexName): bool
    {
        $schemaManager = Schema::getConnection()->getDoctrineSchemaManager();
        $indexes = $schemaManager->listTableIndexes($table);

        return array_key_exists(strtolower($indexName), array_change_key_case($indexes, CASE_LOWER));
    }
};
