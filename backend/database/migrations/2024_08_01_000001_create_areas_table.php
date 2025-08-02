<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('description', 1000);
$table->decimal('x', 12, 8);
$table->decimal('y', 12, 8);

            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};
