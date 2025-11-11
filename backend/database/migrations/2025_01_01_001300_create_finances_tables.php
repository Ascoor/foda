<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en')->nullable();
            $table->timestamps();
        });

        Schema::create('finances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('expense_categories')->nullOnDelete();
            $table->enum('trx_type', ['income','expense']);
            $table->decimal('amount', 12, 2);
            $table->date('date')->index();
            $table->string('reference')->nullable();
            $table->text('description')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->index(['campaign_id','date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finances');
        Schema::dropIfExists('expense_categories');
    }
};
