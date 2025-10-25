<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group', 100)->nullable();
            $table->string('key', 150);
            $table->text('value')->nullable();
            $table->string('type', 50)->nullable();
            $table->boolean('is_encrypted')->default(false);
            $table->timestamps();

            $table->unique(['group', 'key'], 'settings_group_key_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
