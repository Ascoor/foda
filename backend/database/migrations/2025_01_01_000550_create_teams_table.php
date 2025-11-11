<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('name');                  // اسم الفريق
            $table->foreignId('area_id')->nullable()->constrained()->nullOnDelete(); // ربط اختياري بمنطقة
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->nullOnDelete(); // مشرف الفريق (يوزر)
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['campaign_id','name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
