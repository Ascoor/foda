<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('email', 255)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 255);
            $table->string('status', 20)->default('active');
            $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
            $table->foreignId('team_id')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
           $table->string('avatar')->nullable();
            $table->index('status', 'users_status_index');
            $table->index('role_id', 'users_role_id_index');
            $table->index('team_id', 'users_team_id_index');
            $table->index('last_login_at', 'users_last_login_at_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}
