<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->foreignId('area_id')->constrained()->cascadeOnDelete();
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
               $table->foreignId('campaign_id')->nullable()->constrained()->nullOnDelete();
        
            $table->index('name', 'teams_name_index');
            $table->index('area_id', 'teams_area_id_index');
            $table->index('supervisor_id', 'teams_supervisor_id_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
