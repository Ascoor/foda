<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class SchemaMigrationsLog extends Model
{
    use HasFactory;

    protected $table = 'schema_migrations_log';

    protected $fillable = [
        'table_name',
        'change_type',
        'executed_by',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function executor(): R\BelongsTo
    {
        return $this->belongsTo(User::class, 'executed_by');
    }
}
