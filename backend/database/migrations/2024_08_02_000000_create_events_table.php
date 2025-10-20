<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->string('event_type', 50);
            $table->string('location', 255)->nullable();
            $table->foreignId('geo_area_id')->nullable()->constrained('geo_areas')->nullOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->string('status', 30)->default('scheduled');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('campaign_id', 'events_campaign_id_index');
            $table->index('geo_area_id', 'events_geo_area_id_index');
            $table->index('starts_at', 'events_starts_at_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
