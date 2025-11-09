<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('campaigns')) {
            Schema::create('campaigns', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('election_id')->nullable()->constrained('elections')->nullOnDelete();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->dateTime('starts_at')->nullable();
                $table->dateTime('ends_at')->nullable();
                $table->string('spatial_level')->nullable();
                $table->json('bbox')->nullable();
                $table->string('status')->default('draft');
                $table->json('settings')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('campaigns', function (Blueprint $table) {
                if (! Schema::hasColumn('campaigns', 'slug')) {
                    $table->string('slug')->unique()->after('name');
                }
                if (! Schema::hasColumn('campaigns', 'spatial_level')) {
                    $table->string('spatial_level')->nullable()->after('ends_at');
                }
                if (! Schema::hasColumn('campaigns', 'bbox')) {
                    $table->json('bbox')->nullable()->after('spatial_level');
                }
                if (! Schema::hasColumn('campaigns', 'status')) {
                    $table->string('status')->default('draft')->after('bbox');
                }
                if (! Schema::hasColumn('campaigns', 'settings')) {
                    $table->json('settings')->nullable()->after('status');
                }
            });
        }

        if (! Schema::hasTable('campaign_polling_days')) {
            Schema::create('campaign_polling_days', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->date('polling_day');
                $table->timestamps();
                $table->unique(['campaign_id', 'polling_day']);
            });
        }

        if (! Schema::hasTable('ec_settings')) {
            Schema::create('ec_settings', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('election_id')->nullable()->constrained('elections')->nullOnDelete();
                $table->string('key');
                $table->text('value')->nullable();
                $table->timestamps();
                $table->unique(['election_id', 'key']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ec_settings');
        Schema::dropIfExists('campaign_polling_days');
        Schema::dropIfExists('campaigns');
    }
};
