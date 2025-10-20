<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('full_name', 255);
            $table->string('slug', 150)->unique();
            $table->string('party', 150)->nullable();
            $table->text('biography')->nullable();
            $table->string('photo_path', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id', 'candidates_user_id_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
