<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('areas')) {
            Schema::create('areas', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('name');
                $table->string('code')->nullable();
                $table->unsignedTinyInteger('level')->default(0);
                $table->foreignId('parent_id')->nullable()->constrained('areas')->nullOnDelete();
                $table->json('names')->nullable();
                $table->json('meta')->nullable();
                $table->json('centroid')->nullable();
                $table->json('bbox')->nullable();
                $table->timestamps();
                $table->index(['level', 'code']);
            });
        }

        if (! Schema::hasTable('campaign_area')) {
            Schema::create('campaign_area', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('area_id')->constrained('areas')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['campaign_id', 'area_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_area');
        Schema::dropIfExists('areas');
    }
};
