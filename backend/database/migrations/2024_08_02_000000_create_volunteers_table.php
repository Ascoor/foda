<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->foreignId('assigned_area_id')->nullable()->constrained('geo_areas')->nullOnDelete();
            $table->string('full_name', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('phone', 30)->nullable();
            $table->boolean('is_active')->default(true);
            $table->dateTime('joined_at')->nullable();
            $table->dateTime('last_assigned_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('campaign_id', 'volunteers_campaign_id_index');
            $table->index('team_id', 'volunteers_team_id_index');
            $table->index('assigned_area_id', 'volunteers_assigned_area_id_index');
            $table->index('is_active', 'volunteers_is_active_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteers');
    }
};
