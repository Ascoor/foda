<?php

use App\Enums\CampaignStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_id')->constrained('areas')->cascadeOnDelete();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('cover_url')->nullable();
            $table->enum('status', CampaignStatus::values())->default(CampaignStatus::Draft->value);
            $table->timestamps();

            $table->index(['area_id', 'status'], 'idx_campaigns_area_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
