<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('committees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('geo_area_id')->constrained('geo_areas')->cascadeOnDelete();
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name', 150);
            $table->string('code', 50)->nullable();
            $table->integer('voters_count')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('campaign_id', 'committees_campaign_id_index');
            $table->index('geo_area_id', 'committees_geo_area_id_index');
            $table->index('supervisor_id', 'committees_supervisor_id_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('committees');
    }
};
