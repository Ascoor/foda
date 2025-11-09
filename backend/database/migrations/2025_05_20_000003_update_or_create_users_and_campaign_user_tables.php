<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('name');
                $table->string('email')->unique();
                $table->string('password');
                $table->timestamp('last_login_at')->nullable();
                $table->rememberToken();
                $table->timestamps();
            });
        } else {
            Schema::table('users', function (Blueprint $table) {
                if (! Schema::hasColumn('users', 'last_login_at')) {
                    $table->timestamp('last_login_at')->nullable()->after('password');
                }
            });
        }

        if (! Schema::hasTable('campaign_user')) {
            Schema::create('campaign_user', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('role')->nullable();
                $table->string('status')->default('active');
                $table->json('permissions')->nullable();
                $table->timestamps();
                $table->unique(['campaign_id', 'user_id']);
                $table->index(['campaign_id', 'role']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_user');
        // Users table is shared across the platform and is not dropped here.
    }
};
