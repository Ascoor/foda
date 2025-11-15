<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('volunteers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('geographic_scope_id')->nullable()->constrained('geographic_scopes')->nullOnDelete();
            $table->foreignId('committee_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('role')->nullable();
            $table->enum('status', ['pending', 'active', 'inactive'])->default('pending');
            $table->date('joined_at')->nullable();
            $table->json('skills')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['campaign_id', 'email']);
            $table->unique(['campaign_id', 'phone']);
        });

        Schema::create('representatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('geographic_scope_id')->nullable()->constrained('geographic_scopes')->nullOnDelete();
            $table->foreignId('committee_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('position')->nullable();
            $table->enum('assignment_type', ['station', 'field', 'media', 'legal', 'other'])->default('station');
            $table->enum('status', ['pending', 'active', 'inactive'])->default('pending');
            $table->date('assigned_at')->nullable();
            $table->json('responsibilities')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['campaign_id', 'email']);
            $table->unique(['campaign_id', 'phone']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('representatives');
        Schema::dropIfExists('volunteers');
    }
};
