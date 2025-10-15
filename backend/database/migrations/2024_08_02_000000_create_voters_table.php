<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('committee_id');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->foreignId('area_id')->constrained('areas');
            $table->string('address')->nullable();
            $table->enum('sex', ['male', 'female'])->nullable();
            $table->date('birthdate')->nullable();
            $table->unsignedTinyInteger('age')->nullable();
            $table->string('bloodgroup')->nullable();
            $table->string('img_url')->nullable();
            $table->unsignedBigInteger('ion_user_id')->nullable();
            $table->string('voter_id')->unique();
            $table->date('add_date')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
