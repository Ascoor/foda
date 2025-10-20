<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['call', 'visit', 'message', 'event']);
            $table->foreignId('volunteer_id')->nullable()->constrained('volunteers')->nullOnDelete();
            $table->foreignId('voter_id')->nullable()->constrained('voters')->nullOnDelete();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->enum('status', ['success', 'pending', 'failed'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
