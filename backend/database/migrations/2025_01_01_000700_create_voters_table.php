<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('committee_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('area_id')->nullable()->constrained()->nullOnDelete();
            $table->string('full_name');
            $table->string('national_id')->nullable();
            $table->string('voter_uid')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->enum('gender', ['male','female','unknown'])->default('unknown');
            $table->date('birthdate')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->unique(['campaign_id','national_id']);
            $table->unique(['campaign_id','voter_uid']);
            $table->index(['campaign_id','committee_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
