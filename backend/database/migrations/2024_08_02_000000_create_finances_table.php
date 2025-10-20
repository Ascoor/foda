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
            $table->string('reference_id')->nullable();
            $table->enum('type', ['expense', 'donation']);
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('expense_categories')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('reference_id');
            $table->index('type');
            $table->index('date');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('finances');
    }
};
