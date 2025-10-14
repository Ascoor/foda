<?php

namespace App\Services\Schema;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SchemaAuditLogger
{
    public function log(string $table, string $changeType, ?int $userId = null, array $details = []): void
    {
        if (! Schema::hasTable('schema_migrations_log')) {
            return;
        }

        DB::table('schema_migrations_log')->insert([
            'table_name' => $table,
            'change_type' => $changeType,
            'executed_by' => $userId,
            'executed_at' => now(),
            'details' => empty($details) ? null : json_encode($details, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }
}
