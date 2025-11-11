<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type')->index();
            $table->string('title');
            $table->text('message')->nullable();
            $table->enum('priority', ['low','normal','high'])->default('normal')->index();
            $table->json('meta')->nullable();
            $table->dateTime('read_at')->nullable()->index();
            $table->timestamps();
            $table->index(['campaign_id','type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
