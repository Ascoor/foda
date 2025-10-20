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
            $table->string('title');
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('location')->nullable();
            $table->dateTime('date')->nullable();
            $table->enum('type', ['conference', 'field', 'meeting'])->default('field');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
