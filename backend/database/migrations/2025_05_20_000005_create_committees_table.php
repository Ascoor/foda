<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('committees')) {
            Schema::create('committees', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('area_id')->constrained('areas')->cascadeOnDelete();
                $table->string('name');
                $table->string('code');
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'code']);
                $table->index(['campaign_id', 'area_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('committees');
    }
};
