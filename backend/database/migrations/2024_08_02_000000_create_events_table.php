<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('event_id')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('organiser')->nullable();
            $table->string('location')->nullable();
            $table->dateTime('date');
            $table->enum('type', ['conference', 'field', 'meeting']);
            $table->foreignId('area_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['date', 'type']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
