<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (! Schema::hasTable('campaign_polling_days')) {
            Schema::create('campaign_polling_days', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
                $table->date('date');
                $table->string('notes')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'date']);
                $table->index('campaign_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_polling_days');
    }
};
