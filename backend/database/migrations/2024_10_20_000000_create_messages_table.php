<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('recipient_type', 80);
            $table->unsignedBigInteger('recipient_id');
            $table->string('channel', 40)->default('sms');
            $table->string('subject', 255)->nullable();
            $table->text('content');
            $table->string('status', 30)->default('queued');
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->json('response_payload')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('campaign_id', 'messages_campaign_id_index');
            $table->index('sender_id', 'messages_sender_id_index');
            $table->index(['recipient_type', 'recipient_id'], 'messages_recipient_index');
            $table->index('status', 'messages_status_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
