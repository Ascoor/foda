<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('expense_categories')) {
            Schema::create('expense_categories', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('name');
                $table->string('code')->nullable();
                $table->timestamps();
                $table->unique(['name']);
            });
        }

        if (! Schema::hasTable('finances')) {
            Schema::create('finances', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('category_id')->nullable()->constrained('expense_categories')->nullOnDelete();
                $table->decimal('amount', 12, 2);
                $table->enum('type', ['income', 'expense']);
                $table->date('txn_date');
                $table->string('description')->nullable();
                $table->string('external_ref')->nullable();
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->index(['campaign_id', 'txn_date']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('finances');
        Schema::dropIfExists('expense_categories');
    }
};
