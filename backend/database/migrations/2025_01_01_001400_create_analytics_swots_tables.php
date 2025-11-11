<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('analytics_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('metric_key');
            $table->date('snapshot_date');
            $table->json('payload')->nullable();
            $table->decimal('forecast_value', 10, 2)->nullable();
            $table->timestamps();
            $table->unique(['campaign_id','metric_key','snapshot_date']);
        });

        Schema::create('swots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id');
            $table->text('strengths')->nullable();
            $table->text('weaknesses')->nullable();
            $table->text('opportunities')->nullable();
            $table->text('threats')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->index(['campaign_id','entity_type','entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('swots');
        Schema::dropIfExists('analytics_snapshots');
    }
};
