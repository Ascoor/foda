<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('area_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('committee_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('voter_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->enum('type', ['call','visit','event','note','other'])->default('other');
            $table->enum('status', ['open','done','wip'])->default('open');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->integer('support_score')->nullable();
            $table->dateTime('reported_at')->index();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['campaign_id','reported_at']);
            $table->index(['campaign_id','type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
