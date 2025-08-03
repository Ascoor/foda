<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ec_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->nullable()->constrained('elections');
            $table->string('key');
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ec_settings');
    }
};
