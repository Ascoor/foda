<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('committee_id')->constrained('committees')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('full_name', 255);
            $table->string('phone', 30)->nullable();
            $table->string('role', 100)->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('committee_id', 'agents_committee_id_index');
            $table->index('user_id', 'agents_user_id_index');
            $table->index('is_active', 'agents_is_active_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};
