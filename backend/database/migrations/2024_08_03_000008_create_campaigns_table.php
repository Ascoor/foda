<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->nullable()->constrained('elections');
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('governorate_id');
            $table->unsignedBigInteger('district_id');
            $table->unsignedBigInteger('electoral_circle_id');
            $table->timestamps();

            $table->index('governorate_id');
            $table->index('district_id');
            $table->index('electoral_circle_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
