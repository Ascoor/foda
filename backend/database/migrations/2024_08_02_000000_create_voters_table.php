<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('geo_area_id')->nullable()->constrained('geo_areas')->nullOnDelete();
            $table->string('full_name', 255);
            $table->foreignId('committee_id')->nullable()->constrained()->nullOnDelete();
        
            $table->string('national_id', 50)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('support_status', 20)->default('undecided');
            $table->dateTime('last_contact_at')->nullable();
            $table->text('notes')->nullable();
            $table->string('source', 120)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('campaign_id', 'voters_campaign_id_index');
            $table->index('geo_area_id', 'voters_geo_area_id_index');
            $table->index('support_status', 'voters_support_status_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
