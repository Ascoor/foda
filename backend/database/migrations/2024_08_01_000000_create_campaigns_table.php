<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->constrained()->cascadeOnDelete();
            $table->foreignId('candidate_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('geo_area_id')->nullable()->constrained('geo_areas')->nullOnDelete();
            $table->string('name', 255);
            $table->string('slug', 150)->unique();
            $table->string('slogan', 255)->nullable();
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status', 30)->default('planning');
            $table->decimal('budget', 12, 2)->default(0);
            $table->integer('target_votes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('election_id', 'campaigns_election_id_index');
            $table->index('candidate_id', 'campaigns_candidate_id_index');
            $table->index('geo_area_id', 'campaigns_geo_area_id_index');
            $table->index('status', 'campaigns_status_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
