<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Events -------------------------------------------------------------
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }

            $table->index(['campaign_id', 'date'], 'events_campaign_date_idx');
        });

        // Finances -----------------------------------------------------------
        Schema::table('finances', function (Blueprint $table) {
            if (!Schema::hasColumn('finances', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }

            $table->index(['campaign_id', 'date'], 'finances_campaign_date_idx');
        });

        // SWOTs --------------------------------------------------------------
        Schema::table('swots', function (Blueprint $table) {
            if (!Schema::hasColumn('swots', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }

            $table->index(['campaign_id', 'entity_type', 'entity_id'], 'swots_campaign_entity_idx');
        });

        // SMS ----------------------------------------------------------------
        Schema::table('sms', function (Blueprint $table) {
            if (!Schema::hasColumn('sms', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable() // allows legacy/global messages until backfill completes
                    ->after('user_id')
                    ->constrained('campaigns')
                    ->nullOnDelete();
            }

            $table->index(['campaign_id', 'status'], 'sms_campaign_status_idx');
        });

        // Notifications ------------------------------------------------------
        Schema::table('notifications', function (Blueprint $table) {
            if (!Schema::hasColumn('notifications', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable() // platform-wide alerts remain supported
                    ->after('id')
                    ->constrained('campaigns')
                    ->nullOnDelete();
            }

            $table->index(['campaign_id', 'type'], 'notifications_campaign_type_idx');
        });

        // Activities ---------------------------------------------------------
        Schema::table('activities', function (Blueprint $table) {
            if (!Schema::hasColumn('activities', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable()
                    ->after('committee_id')
                    ->constrained('campaigns')
                    ->nullOnDelete();
            }

            $table->index(['campaign_id', 'reported_at'], 'activities_campaign_reported_idx');
        });

        // Teams --------------------------------------------------------------
        Schema::table('teams', function (Blueprint $table) {
            if (!Schema::hasColumn('teams', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->after('id')
                    ->constrained('campaigns')
                    ->cascadeOnDelete();
            }

            $table->index(['campaign_id', 'name'], 'teams_campaign_name_idx');
        });

        // Automation Tasks ---------------------------------------------------
        Schema::table('automation_tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('automation_tasks', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('campaigns')
                    ->nullOnDelete();
            }

            $table->index(['campaign_id', 'task'], 'automation_tasks_campaign_task_idx');
            if (Schema::hasColumn('automation_tasks', 'task')) {
                $table->dropUnique('automation_tasks_task_unique');
            }
            $table->unique(['campaign_id', 'task'], 'automation_tasks_campaign_task_unique');
        });

        // SMS Settings -------------------------------------------------------
        Schema::table('sms_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('sms_settings', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable() // allow fallback global configuration while rolling out per-campaign settings
                    ->after('id')
                    ->constrained('campaigns')
                    ->nullOnDelete();
            }

            $table->index(['campaign_id'], 'sms_settings_campaign_idx');
        });
    }

    public function down(): void
    {
        Schema::table('sms_settings', function (Blueprint $table) {
            if (Schema::hasColumn('sms_settings', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });

        Schema::table('automation_tasks', function (Blueprint $table) {
            $table->dropUnique('automation_tasks_campaign_task_unique');
            $table->dropIndex('automation_tasks_campaign_task_idx');
            if (Schema::hasColumn('automation_tasks', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
            $table->unique('task', 'automation_tasks_task_unique');
        });

        Schema::table('teams', function (Blueprint $table) {
            if (Schema::hasColumn('teams', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });

        Schema::table('activities', function (Blueprint $table) {
            if (Schema::hasColumn('activities', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });

        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });

        Schema::table('sms', function (Blueprint $table) {
            if (Schema::hasColumn('sms', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });

        Schema::table('swots', function (Blueprint $table) {
            if (Schema::hasColumn('swots', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });

        Schema::table('finances', function (Blueprint $table) {
            if (Schema::hasColumn('finances', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });

        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'campaign_id')) {
                $table->dropConstrainedForeignId('campaign_id');
            }
        });
    }
};
