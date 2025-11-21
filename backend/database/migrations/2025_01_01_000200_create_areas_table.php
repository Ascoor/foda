<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['governorate', 'center', 'city', 'district', 'custom'])->default('custom');
            $table->foreignId('parent_id')->nullable()->constrained('areas')->nullOnDelete();
            $table->string('code')->nullable()->index();
            $table->decimal('x', 10, 7)->nullable();
            $table->decimal('y', 10, 7)->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};
