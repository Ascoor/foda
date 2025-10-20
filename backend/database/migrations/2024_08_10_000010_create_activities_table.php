<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('volunteer_id')->nullable()->constrained('volunteers')->nullOnDelete();
            $table->foreignId('voter_id')->nullable()->constrained('voters')->nullOnDelete();
            $table->string('activity_type', 50);
            $table->string('status', 30)->default('pending');
            $table->string('channel', 50)->nullable();
            $table->dateTime('performed_at');
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('campaign_id', 'activities_campaign_id_index');
            $table->index('volunteer_id', 'activities_volunteer_id_index');
            $table->index('voter_id', 'activities_voter_id_index');
            $table->index('performed_at', 'activities_performed_at_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
