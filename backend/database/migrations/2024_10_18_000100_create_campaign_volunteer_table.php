<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_volunteer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('volunteer_id')->constrained('volunteers')->cascadeOnDelete();
            $table->string('assignment')->nullable(); // Caller|Field|Observer...
            $table->string('shift')->nullable();      // Morning|Evening
            $table->json('tags')->nullable();
            $table->timestamps();

            $table->unique(['campaign_id', 'volunteer_id']);
            $table->index(['campaign_id', 'assignment']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_volunteer');
    }
};
