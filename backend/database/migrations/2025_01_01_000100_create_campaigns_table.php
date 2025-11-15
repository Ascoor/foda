<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('poll_date')->nullable();
            $table->enum('geographic_strategy', ['governorate', 'center', 'city', 'district', 'custom'])->default('custom');
            $table->json('geographic_notes')->nullable();
            $table->json('bbox')->nullable();
            $table->timestamps();
            $table->index(['status', 'start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
