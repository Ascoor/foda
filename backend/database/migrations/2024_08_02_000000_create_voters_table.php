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
            $table->string('name')->nullable();
            $table->string('voter_id')->unique();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->foreignId('committee_id')->nullable()->constrained('committees')->nullOnDelete();
            $table->foreignId('area_id')->nullable()->constrained('areas')->cascadeOnDelete();
            $table->string('address')->nullable();
            $table->enum('sex', ['male', 'female'])->nullable();
            $table->date('birthdate')->nullable();
            $table->unsignedTinyInteger('age')->nullable();
            $table->string('bloodgroup')->nullable();
            $table->string('img_url')->nullable();
            $table->unsignedBigInteger('ion_user_id')->nullable();
            $table->enum('support_status', ['supporter', 'opponent', 'undecided'])->default('undecided');
            $table->dateTime('last_contact_at')->nullable();
            $table->text('notes')->nullable();
            $table->date('add_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('support_status');
            $table->index('last_contact_at');
            $table->index('committee_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
