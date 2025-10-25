<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('phone', 30)->nullable();
            $table->string('national_id', 50)->nullable();
            $table->string('avatar_path', 255)->nullable();
            $table->string('address', 255)->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique('user_id', 'profiles_user_id_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
