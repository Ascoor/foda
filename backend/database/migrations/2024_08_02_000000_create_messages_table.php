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
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('recipient_type', ['user', 'voter', 'volunteer']);
            $table->unsignedBigInteger('recipient_id')->nullable();
            $table->text('content');
            $table->dateTime('sent_at')->nullable();
            $table->enum('status', ['sent', 'failed', 'queued'])->default('queued');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
