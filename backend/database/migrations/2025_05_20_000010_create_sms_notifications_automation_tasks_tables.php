<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('sms_settings')) {
            Schema::create('sms_settings', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->nullOnDelete();
                $table->string('provider')->nullable();
                $table->json('config')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'provider']);
            });
        }

        if (! Schema::hasTable('sms')) {
            Schema::create('sms', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->nullOnDelete();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('to');
                $table->string('status')->default('queued');
                $table->string('provider_message_id')->nullable();
                $table->text('body');
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'status']);
            });
        }

        if (! Schema::hasTable('notifications')) {
            Schema::create('notifications', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->nullOnDelete();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('type');
                $table->string('priority')->default('normal');
                $table->json('data')->nullable();
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'type']);
            });
        }

        if (! Schema::hasTable('automation_tasks')) {
            Schema::create('automation_tasks', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->string('name');
                $table->string('status')->default('inactive');
                $table->dateTime('last_run_at')->nullable();
                $table->json('config')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'name']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('automation_tasks');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('sms');
        Schema::dropIfExists('sms_settings');
    }
};
