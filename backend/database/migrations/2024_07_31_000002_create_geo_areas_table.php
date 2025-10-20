<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('geo_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('geo_areas')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('code', 50)->nullable();
            $table->string('level', 50);
            $table->string('full_path', 255)->nullable();
            $table->timestamps();

            $table->index('parent_id', 'geo_areas_parent_id_index');
            $table->index('level', 'geo_areas_level_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('geo_areas');
    }
};
