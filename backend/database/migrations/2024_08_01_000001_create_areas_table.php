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
            $table->string('name', 150);
            $table->string('code', 20)->unique();
            $table->foreignId('parent_id')->nullable()->constrained('areas')->nullOnDelete();
            $table->string('description', 1000)->nullable();
            $table->decimal('x', 12, 8)->nullable();
            $table->decimal('y', 12, 8)->nullable();
            $table->timestamps();

            $table->index(['parent_id', 'code']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};
