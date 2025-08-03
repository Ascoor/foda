<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('finances', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 15, 2);
            $table->string('type');
            $table->date('date');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->foreignId('category_id')->constrained('expense_categories');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('finances');
    }
};
