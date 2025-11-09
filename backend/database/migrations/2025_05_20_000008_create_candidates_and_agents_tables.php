<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('candidates')) {
            Schema::create('candidates', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('election_id')->nullable()->constrained('elections')->nullOnDelete();
                $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->nullOnDelete();
                $table->string('name');
                $table->string('party')->nullable();
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'name']);
            });
        }

        if (! Schema::hasTable('agents')) {
            Schema::create('agents', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('candidate_id')->nullable()->constrained('candidates')->nullOnDelete();
                $table->foreignId('committee_id')->nullable()->constrained('committees')->nullOnDelete();
                $table->string('full_name');
                $table->string('phone')->nullable();
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'full_name', 'committee_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('agents');
        Schema::dropIfExists('candidates');
    }
};
