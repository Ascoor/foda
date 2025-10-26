<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schema_migrations_log', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('table_name');
            $table->string('change_type');
            $table->unsignedBigInteger('executed_by')->nullable();
            $table->json('details')->nullable();
            $table->timestamp('executed_at')->useCurrent();

            $table->index(['table_name', 'executed_at'], 'schema_migrations_log_table_executed_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schema_migrations_log');
    }
};
