<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            if (Schema::hasColumn('campaigns', 'name')) {
                $table->string('name', 190)->change();
            } else {
                $table->string('name', 190);
            }

            if (! Schema::hasColumn('campaigns', 'timezone')) {
                $table->string('timezone')->default('Africa/Cairo')->after('description');
            }

            if (! Schema::hasColumn('campaigns', 'starts_at')) {
                $table->timestampTz('starts_at')->nullable()->after('timezone');
            }

            if (! Schema::hasColumn('campaigns', 'ends_at')) {
                $table->timestampTz('ends_at')->nullable()->after('starts_at');
            }

            if (! Schema::hasColumn('campaigns', 'spatial_level')) {
                $table->enum('spatial_level', ['city', 'center', 'governorate', 'region', 'custom'])
                    ->default('city')
                    ->after('ends_at');
            }

            if (! Schema::hasColumn('campaigns', 'admin_areas')) {
                $table->json('admin_areas')->nullable()->after('spatial_level');
            }

            if (! Schema::hasColumn('campaigns', 'spatial_extent')) {
                $table->json('spatial_extent')->nullable()->after('admin_areas');
            }

            if (! Schema::hasColumn('campaigns', 'bbox')) {
                $table->json('bbox')->nullable()->after('spatial_extent');
            }

            if (! Schema::hasColumn('campaigns', 'polling_settings')) {
                $table->json('polling_settings')->nullable()->after('bbox');
            }

            if (! Schema::hasColumn('campaigns', 'status')) {
                $table->enum('status', ['draft', 'active', 'archived'])->default('draft')->after('polling_settings');
            }

            if (! Schema::hasColumn('campaigns', 'created_by')) {
                $table->foreignId('created_by')
                    ->nullable()
                    ->after('status')
                    ->constrained('users')
                    ->nullOnDelete();
            }
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->index('status', 'campaigns_status_idx');
            $table->index(['starts_at', 'ends_at'], 'campaigns_window_idx');
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            if (Schema::hasColumn('campaigns', 'status')) {
                $table->dropIndex('campaigns_status_idx');
            }
            if (Schema::hasColumn('campaigns', 'starts_at')) {
                $table->dropIndex('campaigns_window_idx');
            }
        });

        Schema::table('campaigns', function (Blueprint $table) {
            if (Schema::hasColumn('campaigns', 'created_by')) {
                $table->dropConstrainedForeignId('created_by');
            }
            if (Schema::hasColumn('campaigns', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('campaigns', 'polling_settings')) {
                $table->dropColumn('polling_settings');
            }
            if (Schema::hasColumn('campaigns', 'bbox')) {
                $table->dropColumn('bbox');
            }
            if (Schema::hasColumn('campaigns', 'spatial_extent')) {
                $table->dropColumn('spatial_extent');
            }
            if (Schema::hasColumn('campaigns', 'admin_areas')) {
                $table->dropColumn('admin_areas');
            }
            if (Schema::hasColumn('campaigns', 'spatial_level')) {
                $table->dropColumn('spatial_level');
            }
            if (Schema::hasColumn('campaigns', 'ends_at')) {
                $table->dropColumn('ends_at');
            }
            if (Schema::hasColumn('campaigns', 'starts_at')) {
                $table->dropColumn('starts_at');
            }
            if (Schema::hasColumn('campaigns', 'timezone')) {
                $table->dropColumn('timezone');
            }
            if (Schema::hasColumn('campaigns', 'name')) {
                $table->string('name')->change();
            }
        });
    }
};
