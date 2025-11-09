<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('analytics_snapshots')) {
            Schema::create('analytics_snapshots', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('election_id')->nullable()->constrained('elections')->nullOnDelete();
                $table->string('key');
                $table->date('as_of_date');
                $table->json('payload')->nullable();
                $table->decimal('forecast_value', 12, 3)->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'key', 'as_of_date']);
            });
        }

        if (! Schema::hasTable('swots')) {
            Schema::create('swots', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->morphs('entity');
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->json('strengths')->nullable();
                $table->json('weaknesses')->nullable();
                $table->json('opportunities')->nullable();
                $table->json('threats')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'entity_type', 'entity_id']);
            });
        }

        if (! Schema::hasTable('schema_migrations_log')) {
            Schema::create('schema_migrations_log', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('table_name');
                $table->string('change_type');
                $table->foreignId('executed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->json('details')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('schema_migrations_log');
        Schema::dropIfExists('swots');
        Schema::dropIfExists('analytics_snapshots');
    }
};
