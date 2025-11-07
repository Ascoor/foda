<?php

namespace App\Services\Schema;

use Doctrine\DBAL\Schema\AbstractSchemaManager;
use Doctrine\DBAL\Schema\Column as DoctrineColumn;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class SchemaSynchronizer
{
    private ?AbstractSchemaManager $schemaManager = null;

    private string $connectionName;

    private ?\Throwable $connectionException = null;

    private array $ignoreTables = [
        'migrations',
        'failed_jobs',
        'password_resets',
        'personal_access_tokens',
        'schema_migrations_log',
        'cache',
        'jobs',
    ];

    public function __construct(
        private BlueprintRepository $blueprints,
        private SchemaAuditLogger $auditLogger,
        private DatabaseManager $db
    ) {
        $this->connectionName = $db->getDefaultConnection();

        try {
            $connection = $db->connection($this->connectionName);
            $this->schemaManager = $this->resolveSchemaManager($connection);
        } catch (\Throwable $exception) {
            $this->connectionException = $exception;
        }
    }

    /**
     * @param  array<int, string>|null  $tables
     */
    public function sync(?array $tables, bool $apply, bool $cleanup, ?int $userId = null): array
    {
        $inspection = $this->inspect($tables);

        $results = [
            'matched' => [],
            'added' => [],
            'updated' => [],
            'deleted' => [],
            'warnings' => [],
            'missing' => $inspection['missing'],
            'diverged' => [],
            'extra' => $inspection['extra'],
        ];

        foreach ($inspection['tables'] as $table => $info) {
            if (! $info['exists']) {
                if ($apply) {
                    $this->createTable($info['blueprint']);
                    $results['added'][] = $table;
                    $this->auditLogger->log($table, 'added', $userId);
                }

                continue;
            }

            if ($info['matches']) {
                $results['matched'][] = $table;
                continue;
            }

            $results['diverged'][] = $table;

            if ($apply) {
                $this->recreateTable($info['blueprint']);
                $results['updated'][] = $table;
                $results['warnings'][] = "تمت إعادة إنشاء الجدول [{$table}] لتطبيق البنية المرجعية.";
                $this->auditLogger->log($table, 'updated', $userId, $info['differences']);
            }
        }

        if ($cleanup) {
            foreach ($results['extra'] as $table) {
                if ($apply) {
                    $this->dropTable($table);
                    $results['deleted'][] = $table;
                    $this->auditLogger->log($table, 'deleted', $userId);
                }
            }
        }

        $finalInspection = $apply ? $this->inspect($tables) : $inspection;
        $results['final_status'] = $this->determineStatus($finalInspection, $results, $cleanup, $apply);
        $results['final_inspection'] = $finalInspection;

        return $results;
    }

    /**
     * @param  array<int, string>  $tables
     */
    public function updateTables(array $tables, ?int $userId = null): array
    {
        return $this->sync($tables, true, false, $userId);
    }

    public function addTable(string $table, ?int $userId = null): array
    {
        $blueprint = $this->blueprints->require($table);

        $schemaManager = $this->schemaManager();
        $exists = $schemaManager->tablesExist([$table]);

        if ($exists) {
            return [
                'status' => 'exists',
                'table' => $table,
            ];
        }

        $this->createTable($blueprint);
        $this->auditLogger->log($table, 'added', $userId);

        return [
            'status' => 'created',
            'table' => $table,
        ];
    }

    public function removeTable(string $table, ?int $userId = null): array
    {
        $schemaManager = $this->schemaManager();

        if (! $schemaManager->tablesExist([$table])) {
            return [
                'status' => 'missing',
                'table' => $table,
            ];
        }

        $this->dropTable($table);
        $this->auditLogger->log($table, 'deleted', $userId);

        return [
            'status' => 'deleted',
            'table' => $table,
        ];
    }

    /**
     * @param  array<int, string>|null  $tables
     */
    public function inspect(?array $tables = null): array
    {
        $blueprints = $this->blueprints->forTables($tables);
        $existingTables = $this->listExistingTables();

        $inspection = [
            'tables' => [],
            'missing' => [],
            'extra' => [],
        ];

        foreach ($blueprints as $table => $blueprint) {
            $info = [
                'exists' => in_array($table, $existingTables, true),
                'matches' => false,
                'differences' => [
                    'missing_columns' => [],
                    'extra_columns' => [],
                    'type_mismatches' => [],
                    'missing_indexes' => [],
                    'missing_foreign_keys' => [],
                ],
                'blueprint' => $blueprint,
            ];

            if (! $info['exists']) {
                $inspection['missing'][] = $table;
            } else {
                $tableDetails = $this->schemaManager()->introspectTable($table);

                $info['matches'] = $this->compareTable($tableDetails, $blueprint, $info['differences']);
            }

            $inspection['tables'][$table] = $info;
        }

        $expectedTables = $blueprints->keys()->all();
        $trackedTables = $tables ? array_values(array_intersect($existingTables, $tables)) : $existingTables;

        foreach ($trackedTables as $existingTable) {
            if (in_array($existingTable, $this->ignoreTables, true)) {
                continue;
            }

            if (! in_array($existingTable, $expectedTables, true)) {
                $inspection['extra'][] = $existingTable;
            }
        }

        sort($inspection['missing']);
        sort($inspection['extra']);

        return $inspection;
    }

    public function generateAuditMarkdown(array $results): string
    {
        $lines = [];
        $lines[] = '# Schema Audit Report';
        $lines[] = 'Generated at: '.now()->toDateTimeString();
        $lines[] = '';
        $lines[] = '| الحالة | التفاصيل |';
        $lines[] = '| --- | --- |';
        $lines[] = '| ✅ تطابق تام | '.($results['matched'] ? implode(', ', $results['matched']) : 'لا يوجد').' |';
        $lines[] = '| 🔁 تم التحديث | '.($results['updated'] ? implode(', ', $results['updated']) : 'لا يوجد').' |';
        $lines[] = '| ➕ تمت الإضافة | '.($results['added'] ? implode(', ', $results['added']) : 'لا يوجد').' |';
        $lines[] = '| ❌ تم الحذف | '.($results['deleted'] ? implode(', ', $results['deleted']) : 'لا يوجد').' |';
        $lines[] = '| ⚠️ تحذيرات التطبيع | '.($results['warnings'] ? implode("<br>", $results['warnings']) : 'لا يوجد').' |';
        $lines[] = '';
        $lines[] = 'الحالة النهائية: '.$results['final_status'];

        return implode(PHP_EOL, $lines).PHP_EOL;
    }

    public function generateVerificationMarkdown(array $inspection): string
    {
        $matched = collect($inspection['tables'])
            ->filter(fn ($info) => $info['exists'] && $info['matches'])
            ->keys()
            ->all();

        $diverged = collect($inspection['tables'])
            ->filter(fn ($info) => $info['exists'] && ! $info['matches'])
            ->keys()
            ->all();

        $lines = [];
        $lines[] = '| الحالة | الوصف |';
        $lines[] = '| --- | --- |';
        $lines[] = '| ✅ | الجداول المطابقة: '.($matched ? implode(', ', $matched) : 'لا يوجد').' |';
        $lines[] = '| ⚠️ | الجداول الناقصة: '.($inspection['missing'] ? implode(', ', $inspection['missing']) : 'لا يوجد').' |';
        $lines[] = '| ❌ | الجداول الزائدة: '.($inspection['extra'] ? implode(', ', $inspection['extra']) : 'لا يوجد').' |';

        $recommendations = [];

        if ($diverged) {
            $recommendations[] = 'ينصح بتشغيل `php artisan schema:sync --apply --tables='.implode(',', $diverged).'` لتحديث الجداول غير المتطابقة.';
        }

        if ($inspection['missing']) {
            $recommendations[] = 'تشغيل `php artisan schema:sync --apply` لإنشاء الجداول الناقصة.';
        }

        if ($inspection['extra']) {
            $recommendations[] = 'استخدام `php artisan schema:sync --cleanup --apply` لإزالة الجداول الزائدة بعد أخذ نسخة احتياطية.';
        }

        $lines[] = '| 📎 | توصيات التحسين: '.($recommendations ? implode(' ', $recommendations) : 'لا يوجد').' |';

        return implode(PHP_EOL, $lines).PHP_EOL;
    }

    private function determineStatus(array $inspection, array $results, bool $cleanup, bool $apply): string
    {
        $hasMissing = (bool) $inspection['missing'];
        $hasDiverged = collect($inspection['tables'])->contains(fn ($info) => $info['exists'] && ! $info['matches']);
        $hasExtra = (bool) $inspection['extra'];

        if ($hasMissing || $hasDiverged) {
            return '🟡 Partial';
        }

        if ($hasExtra && ! $cleanup) {
            return '⚫ Legacy';
        }

        if (! $apply && ($results['missing'] || $results['diverged'])) {
            return '🟡 Partial';
        }

        return '🟢 Ready';
    }

    private function compareTable(\Doctrine\DBAL\Schema\Table $tableDetails, TableBlueprint $blueprint, array &$differences): bool
    {
        $matches = true;

        foreach ($blueprint->columns() as $name => $definition) {
            if (! $tableDetails->hasColumn($name)) {
                $differences['missing_columns'][] = $name;
                $matches = false;
                continue;
            }

            $column = $tableDetails->getColumn($name);
            $expectedType = $this->normalizeBlueprintType($definition['type']);
            $actualType = $this->normalizeDoctrineType($column);

            if ($expectedType !== $actualType) {
                $differences['type_mismatches'][$name] = [$expectedType, $actualType];
                $matches = false;
            }

            if (isset($definition['length']) && $column->getLength() !== null && $column->getLength() !== (int) $definition['length']) {
                $differences['type_mismatches'][$name] = [$definition['length'], $column->getLength()];
                $matches = false;
            }

            if (($definition['nullable'] ?? false) !== ! $column->getNotnull()) {
                $differences['type_mismatches'][$name] = ['nullable' => $definition['nullable'] ?? false];
                $matches = false;
            }
        }

        foreach ($tableDetails->getColumns() as $column) {
            $name = $column->getName();
            if (! $blueprint->hasColumn($name) && ! in_array($name, ['created_at', 'updated_at', 'deleted_at'], true)) {
                $differences['extra_columns'][] = $name;
                $matches = false;
            }
        }

        $expectedIndexes = collect($blueprint->indexes())->map(fn ($index) => $index['name'] ?? $this->guessIndexName($blueprint->table(), $index))->filter()->values()->all();
        foreach ($expectedIndexes as $indexName) {
            if (! $tableDetails->hasIndex($indexName)) {
                $differences['missing_indexes'][] = $indexName;
                $matches = false;
            }
        }

        $expectedForeignKeys = collect($blueprint->foreignKeys())->map(fn ($fk) => $fk['name'] ?? $this->guessForeignKeyName($blueprint->table(), $fk))->filter()->values()->all();

        foreach ($expectedForeignKeys as $fkName) {
            if (! $tableDetails->hasForeignKey($fkName)) {
                $differences['missing_foreign_keys'][] = $fkName;
                $matches = false;
            }
        }

        return $matches;
    }

    private function normalizeBlueprintType(string $type): string
    {
        return match ($type) {
            'bigIncrements' => 'bigint',
            'increments' => 'integer',
            'uuid' => 'guid',
            'timestamp', 'timestamps' => 'datetime',
            'dateTimeTz', 'dateTime' => 'datetime',
            'longText' => 'text',
            'foreignId' => 'bigint',
            default => $type,
        };
    }

    private function normalizeDoctrineType(DoctrineColumn $column): string
    {
        $type = $column->getType()->getName();

        return match ($type) {
            'integer', 'smallint', 'bigint' => $type,
            'datetime', 'datetimetz', 'datetime_immutable', 'datetimetz_immutable' => 'datetime',
            'string' => $column->getLength() === 36 ? 'guid' : 'string',
            default => $type,
        };
    }

    private function guessIndexName(string $table, array $index): string
    {
        if (isset($index['name'])) {
            return $index['name'];
        }

        $type = $index['type'] ?? 'index';
        $columns = implode('_', $index['columns'] ?? []);

        return Str::snake($table.'_'.$columns.'_'.$type);
    }

    private function guessForeignKeyName(string $table, array $foreignKey): string
    {
        if (isset($foreignKey['name'])) {
            return $foreignKey['name'];
        }

        $columns = implode('_', $foreignKey['columns'] ?? []);

        return Str::snake($table.'_'.$columns.'_foreign');
    }

    private function createTable(TableBlueprint $blueprint): void
    {
        Schema::connection($this->connectionName)->create($blueprint->table(), function (Blueprint $table) use ($blueprint) {
            $this->applyColumns($table, $blueprint);
            $this->applyIndexes($table, $blueprint);
            $this->applyForeignKeys($table, $blueprint);
        });
    }

    private function recreateTable(TableBlueprint $blueprint): void
    {
        Schema::connection($this->connectionName)->disableForeignKeyConstraints();
        Schema::connection($this->connectionName)->dropIfExists($blueprint->table());
        Schema::connection($this->connectionName)->enableForeignKeyConstraints();

        $this->createTable($blueprint);
    }

    private function dropTable(string $table): void
    {
        Schema::connection($this->connectionName)->disableForeignKeyConstraints();
        Schema::connection($this->connectionName)->dropIfExists($table);
        Schema::connection($this->connectionName)->enableForeignKeyConstraints();
    }

    private function applyColumns(Blueprint $table, TableBlueprint $blueprint): void
    {
        foreach ($blueprint->columns() as $name => $definition) {
            $column = $this->makeColumn($table, $name, $definition);

            if (($definition['nullable'] ?? false) && method_exists($column, 'nullable')) {
                $column->nullable();
            }

            if (array_key_exists('default', $definition)) {
                $column->default($definition['default']);
            }

            if (($definition['unsigned'] ?? false) && method_exists($column, 'unsigned')) {
                $column->unsigned();
            }
        }

        if ($blueprint->timestamps()) {
            $table->timestamps();
        }

        if ($blueprint->softDeletes()) {
            $table->softDeletes();
        }
    }

    private function makeColumn(Blueprint $table, string $name, array $definition)
    {
        return match ($definition['type']) {
            'bigIncrements' => $table->bigIncrements($name),
            'increments' => $table->increments($name),
            'uuid' => $table->uuid($name),
            'foreignId' => $table->foreignId($name),
            'integer' => $table->integer($name),
            'bigInteger' => $table->bigInteger($name),
            'unsignedBigInteger' => $table->unsignedBigInteger($name),
            'boolean' => $table->boolean($name),
            'text' => $table->text($name),
            'longText' => $table->longText($name),
            'json' => $table->json($name),
            'decimal' => $table->decimal($name, $definition['precision'] ?? 10, $definition['scale'] ?? 2),
            'date' => $table->date($name),
            'dateTime', 'dateTimeTz' => $table->dateTime($name, $definition['precision'] ?? 0),
            'timestamp' => $table->timestamp($name),
            default => $table->string($name, $definition['length'] ?? 255),
        };
    }

    private function applyIndexes(Blueprint $table, TableBlueprint $blueprint): void
    {
        foreach ($blueprint->indexes() as $index) {
            $columns = $index['columns'] ?? [];
            $name = $index['name'] ?? null;

            if (! $columns) {
                continue;
            }

            $type = $index['type'] ?? 'index';

            match ($type) {
                'primary' => $table->primary($columns, $name),
                'unique' => $table->unique($columns, $name),
                default => $table->index($columns, $name),
            };
        }
    }

    private function applyForeignKeys(Blueprint $table, TableBlueprint $blueprint): void
    {
        foreach ($blueprint->foreignKeys() as $foreignKey) {
            $columns = $foreignKey['columns'] ?? null;
            $references = $foreignKey['references'] ?? null;
            $on = $foreignKey['on'] ?? null;

            if (! $columns || ! $references || ! $on) {
                continue;
            }

            $definition = $table->foreign($columns, $foreignKey['name'] ?? null)
                ->references($references)
                ->on($on);

            if (isset($foreignKey['onDelete'])) {
                $definition->onDelete($foreignKey['onDelete']);
            }

            if (isset($foreignKey['onUpdate'])) {
                $definition->onUpdate($foreignKey['onUpdate']);
            }
        }
    }

    private function listExistingTables(): array
    {
        $tables = $this->schemaManager()->listTableNames();

        return array_map(fn ($table) => $table, $tables);
    }

    private function schemaManager(): AbstractSchemaManager
    {
        if ($this->schemaManager instanceof AbstractSchemaManager) {
            return $this->schemaManager;
        }

        try {
            $connection = $this->db->connection($this->connectionName);
            $this->schemaManager = $this->resolveSchemaManager($connection);

            return $this->schemaManager;
        } catch (\Throwable $exception) {
            $this->connectionException = $exception;

            $message = 'A database connection is required to inspect or synchronize the schema. '
                .'Unable to connect using the ['.$this->connectionName.'] connection: '
                .$exception->getMessage();

            throw new \RuntimeException($message, previous: $exception);
        }
    }

    private function resolveSchemaManager(Connection $connection): AbstractSchemaManager
    {
        if (method_exists($connection, 'getDoctrineSchemaManager')) {
            return $connection->getDoctrineSchemaManager();
        }

        if (method_exists($connection, 'getDoctrineConnection')) {
            return $connection->getDoctrineConnection()->createSchemaManager();
        }

        throw new \RuntimeException('Unable to resolve Doctrine schema manager for the current connection.');
    }
}
