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
            $table->string('full_name');
            $table->string('national_id')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->foreignId('area_id')->nullable()->constrained('geo_areas')->nullOnDelete();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->enum('support_status', ['supporter', 'opponent', 'undecided'])->default('undecided');
            $table->dateTime('last_contact_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
