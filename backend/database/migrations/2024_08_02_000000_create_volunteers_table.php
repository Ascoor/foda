<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 150)->nullable()->unique();
            $table->string('phone', 20)->nullable();
            $table->boolean('active')->default(true);
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->foreignId('assigned_area_id')->nullable()->constrained('geo_areas')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('active');
            $table->index(['team_id', 'assigned_area_id']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('volunteers');
    }
};
