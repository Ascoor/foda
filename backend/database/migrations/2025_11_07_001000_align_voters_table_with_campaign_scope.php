<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            if (Schema::hasColumn('voters', 'sex') && ! Schema::hasColumn('voters', 'gender')) {
                $table->renameColumn('sex', 'gender');
            }
        });

        Schema::table('voters', function (Blueprint $table) {
            if (! Schema::hasColumn('voters', 'national_id')) {
                $table->string('national_id', 50)->nullable()->after('name');
            }

            if (! Schema::hasColumn('voters', 'voter_uid')) {
                $table->string('voter_uid', 64)->nullable()->after('national_id');
            }

            if (! Schema::hasColumn('voters', 'gender')) {
                $table->string('gender', 10)->nullable()->after('phone');
            }

            if (! Schema::hasColumn('voters', 'meta')) {
                $table->json('meta')->nullable()->after('birthdate');
            }
        });
    }

    public function down(): void
    {
        Schema::table('voters', function (Blueprint $table) {
            if (Schema::hasColumn('voters', 'meta')) {
                $table->dropColumn('meta');
            }

            if (Schema::hasColumn('voters', 'voter_uid')) {
                $table->dropColumn('voter_uid');
            }

            if (Schema::hasColumn('voters', 'national_id')) {
                $table->dropColumn('national_id');
            }
        });

        Schema::table('voters', function (Blueprint $table) {
            if (Schema::hasColumn('voters', 'gender') && ! Schema::hasColumn('voters', 'sex')) {
                $table->renameColumn('gender', 'sex');
            }
        });
    }
};
