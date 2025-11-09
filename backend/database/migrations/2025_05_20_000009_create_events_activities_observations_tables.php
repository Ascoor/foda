<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('events')) {
            Schema::create('events', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
                $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
                $table->string('title');
                $table->text('description')->nullable();
                $table->dateTime('starts_at');
                $table->dateTime('ends_at')->nullable();
                $table->json('location')->nullable();
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'starts_at']);
            });
        }

        if (! Schema::hasTable('activities')) {
            Schema::create('activities', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
                $table->foreignId('committee_id')->nullable()->constrained('committees')->nullOnDelete();
                $table->foreignId('voter_id')->nullable()->constrained('voters')->nullOnDelete();
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->string('type');
                $table->string('status')->nullable();
                $table->json('location')->nullable();
                $table->unsignedTinyInteger('support_score')->nullable();
                $table->dateTime('reported_at')->nullable();
                $table->json('payload')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'reported_at']);
            });
        }

        if (! Schema::hasTable('observations')) {
            Schema::create('observations', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('committee_id')->nullable()->constrained('committees')->nullOnDelete();
                $table->foreignId('volunteer_id')->nullable()->constrained('volunteers')->nullOnDelete();
                $table->dateTime('recorded_at')->nullable();
                $table->json('meta')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'recorded_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('observations');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('events');
    }
};
