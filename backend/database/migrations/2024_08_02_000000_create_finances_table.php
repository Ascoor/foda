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
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('expense_categories')->nullOnDelete();
            $table->string('type', 20);
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('EGP');
            $table->date('transacted_at');
            $table->string('reference', 100)->nullable();
            $table->text('description')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('campaign_id', 'finances_campaign_id_index');
            $table->index('category_id', 'finances_category_id_index');
            $table->index('recorded_by', 'finances_recorded_by_index');
            $table->index('type', 'finances_type_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finances');
    }
};
