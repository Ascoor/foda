<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            if (! Schema::hasColumn('campaigns', 'slug')) {
                $table->string('slug')->nullable()->after('name');
                $table->unique('slug');
            }

            if (! Schema::hasColumn('campaigns', 'starts_at')) {
                $table->timestamp('starts_at')->nullable()->after('description');
            }

            if (! Schema::hasColumn('campaigns', 'ends_at')) {
                $table->timestamp('ends_at')->nullable()->after('starts_at');
            }

            if (! Schema::hasColumn('campaigns', 'spatial_level')) {
                $table->string('spatial_level')->nullable()->after('ends_at');
            }

            if (! Schema::hasColumn('campaigns', 'bbox')) {
                $table->json('bbox')->nullable()->after('spatial_level');
            }

            if (! Schema::hasColumn('campaigns', 'status')) {
                $table->string('status')->nullable()->after('bbox');
            }

            if (! Schema::hasColumn('campaigns', 'election_id')) {
                $table->foreignId('election_id')->nullable()->after('id')->constrained('elections')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            if (Schema::hasColumn('campaigns', 'status')) {
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('campaigns', 'bbox')) {
                $table->dropColumn('bbox');
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

            if (Schema::hasColumn('campaigns', 'slug')) {
                $table->dropUnique('campaigns_slug_unique');
                $table->dropColumn('slug');
            }

            if (Schema::hasColumn('campaigns', 'election_id')) {
                $table->dropConstrainedForeignId('election_id');
            }
        });
    }
};
