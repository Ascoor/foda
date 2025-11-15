<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('geographic_scopes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('level', ['governorate', 'center', 'city', 'district', 'committee', 'custom'])->default('custom');
            $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('geographic_scopes')->cascadeOnDelete();
            $table->json('bbox')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->unique(['campaign_id', 'name']);
            $table->index(['campaign_id', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('geographic_scopes');
    }
};
