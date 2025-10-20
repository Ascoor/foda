<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('geo_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('parent_id')->nullable()->constrained('geo_areas')->cascadeOnDelete();
            $table->enum('level', ['country', 'governorate', 'district', 'committee']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('geo_areas');
    }
};
