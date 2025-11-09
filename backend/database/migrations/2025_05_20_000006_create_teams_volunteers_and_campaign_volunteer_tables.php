<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('teams')) {
            Schema::create('teams', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
                $table->foreignId('supervisor_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('name');
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'name']);
            });
        }

        if (! Schema::hasTable('volunteers')) {
            Schema::create('volunteers', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
                $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
                $table->string('first_name');
                $table->string('last_name')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->json('tags')->nullable();
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'team_id']);
                $table->index(['campaign_id', 'phone']);
            });
        }

        if (! Schema::hasTable('campaign_volunteer')) {
            Schema::create('campaign_volunteer', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('volunteer_id')->constrained('volunteers')->cascadeOnDelete();
                $table->string('assignment')->nullable();
                $table->string('shift')->nullable();
                $table->json('tags')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'volunteer_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_volunteer');
        Schema::dropIfExists('volunteers');
        Schema::dropIfExists('teams');
    }
};
