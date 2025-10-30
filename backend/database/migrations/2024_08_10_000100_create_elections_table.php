<?php

use App\Enums\ElectionPhase;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('elections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->string('name');
            $table->string('cover_url')->nullable();
            $table->enum('phase', ElectionPhase::values())->default(ElectionPhase::Upcoming->value);
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();
            $table->timestamps();

            $table->index(['campaign_id', 'phase', 'start_at'], 'idx_elections_campaign_phase');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('elections');
    }
};
