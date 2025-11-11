<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('automation_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('task');
            $table->string('display_name');
            $table->boolean('is_enabled')->default(true);
            $table->enum('status', ['idle','running','failed','completed'])->default('idle');
            $table->dateTime('last_run_at')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->unique(['campaign_id','task']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automation_tasks');
    }
};
