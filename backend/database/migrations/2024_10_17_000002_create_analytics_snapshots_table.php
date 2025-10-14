<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->nullable()->constrained('elections')->nullOnDelete();
            $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->cascadeOnDelete();
            $table->string('metric_key', 120);
            $table->date('snapshot_date');
            $table->json('payload');
            $table->decimal('forecast_value', 12, 2)->nullable();
            $table->timestamps();

            $table->unique(['campaign_id', 'metric_key', 'snapshot_date'], 'analytics_snapshots_unique_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_snapshots');
    }
};
