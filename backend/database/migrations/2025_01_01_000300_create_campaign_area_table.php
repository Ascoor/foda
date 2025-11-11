<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_area', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('area_id')->constrained()->cascadeOnDelete();
            $table->string('alias')->nullable();
            $table->string('local_code')->nullable();
            $table->timestamps();
            $table->unique(['campaign_id','area_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_area');
    }
};
