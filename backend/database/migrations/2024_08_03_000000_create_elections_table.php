<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('elections', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('slug', 150)->unique();
            $table->string('election_type', 80);
            $table->string('country', 120)->nullable();
            $table->string('geo_scope', 120)->nullable();
            $table->text('description')->nullable();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->string('status', 30)->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status', 'elections_status_index');
            $table->index('election_type', 'elections_type_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('elections');
    }
};
