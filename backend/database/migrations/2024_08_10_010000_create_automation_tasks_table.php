<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('automation_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task')->unique();
            $table->string('display_name');
            $table->string('description')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->string('status')->nullable();
            $table->timestamp('last_run_at')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automation_tasks');
    }
};
