<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('agent_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('committee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('active')->default(true);
            $table->dateTime('assigned_at')->nullable();
            $table->dateTime('ended_at')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->unique(['campaign_id','committee_id','user_id'], 'uniq_agent_assignment');
            $table->index(['campaign_id','committee_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_assignments');
    }
};
