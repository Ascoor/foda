<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('notifiable_type', 120);
            $table->unsignedBigInteger('notifiable_id');
            $table->string('title', 200);
            $table->text('body');
            $table->json('data')->nullable();
            $table->dateTime('read_at')->nullable();
            $table->timestamps();

            $table->index('user_id', 'notifications_user_id_index');
            $table->index(['notifiable_type', 'notifiable_id'], 'notifications_notifiable_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
