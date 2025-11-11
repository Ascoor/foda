<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('organiser')->nullable();
            $table->string('location')->nullable();
            $table->dateTime('date')->index();
            $table->foreignId('area_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index(['campaign_id','date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
