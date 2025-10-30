<?php

use App\Enums\MembershipRole;
use App\Enums\MembershipScopeType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('scope_type', MembershipScopeType::values());
            $table->unsignedBigInteger('scope_id');
            $table->enum('role', MembershipRole::values());
            $table->timestamps();

            $table->unique(['user_id', 'scope_type', 'scope_id', 'role'], 'uniq_membership_user_scope_role');
            $table->index(['user_id', 'scope_type', 'scope_id'], 'idx_memberships_user_scope');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};
