<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['campaign_manager','area_coordinator','committee_supervisor','agent','volunteer','finance','viewer'])->default('viewer');
            $table->enum('status', ['invited','active','suspended'])->default('active');
            $table->json('permissions')->nullable();
            $table->timestamps();
            $table->unique(['campaign_id','user_id']);
            $table->index(['campaign_id','role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_user');
    }
};
