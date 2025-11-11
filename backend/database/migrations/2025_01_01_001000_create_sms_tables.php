<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sms_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('provider')->default('generic');
            $table->string('api_key')->nullable();
            $table->string('sender_id')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });

        Schema::create('sms_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('to');
            $table->text('body');
            $table->enum('status', ['queued','sent','failed'])->default('queued');
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('scheduled_for')->nullable();
            $table->timestamps();
            $table->index(['campaign_id','status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms_messages');
        Schema::dropIfExists('sms_settings');
    }
};
