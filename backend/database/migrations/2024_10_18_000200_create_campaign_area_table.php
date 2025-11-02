<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_area', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('geo_area_id')->constrained('geo_areas')->cascadeOnDelete();
            $table->string('alias')->nullable();
            $table->string('code')->nullable();
            $table->timestamps();

            $table->unique(['campaign_id', 'geo_area_id']);
            $table->index(['campaign_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_area');
    }
};
