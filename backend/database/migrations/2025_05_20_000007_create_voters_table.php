<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('voters')) {
            Schema::create('voters', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
                $table->foreignId('committee_id')->nullable()->constrained('committees')->nullOnDelete();
                $table->string('full_name');
                $table->string('national_id')->nullable();
                $table->string('voter_uid')->nullable();
                $table->enum('gender', ['male', 'female', 'other'])->nullable();
                $table->date('dob')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->string('address')->nullable();
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'voter_uid']);
                $table->index(['campaign_id', 'national_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
