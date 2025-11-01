<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_committees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->foreignId('committee_id')->constrained('committees')->restrictOnDelete();
            $table->unsignedInteger('target_voters')->nullable();
            $table->unsignedSmallInteger('agent_quota')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['campaign_id', 'committee_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_committees');
    }
};
