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
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->enum('type', ['expense', 'donation']);
            $table->foreignId('category_id')->nullable()->constrained('expense_categories')->nullOnDelete();
            $table->decimal('amount', 14, 2);
            $table->date('date');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('finances');
    }
};
