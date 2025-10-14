<?php

namespace App\Services\Schema;

use Illuminate\Support\Arr;

class TableBlueprint
{
    public function __construct(private array $definition)
    {
        if (! isset($this->definition['table'])) {
            throw new \InvalidArgumentException('Blueprint definition is missing the table name.');
        }

        $this->definition['columns'] = $this->normalizeColumns($this->definition['columns'] ?? []);
        $this->definition['indexes'] = array_values($this->definition['indexes'] ?? []);
        $this->definition['foreign_keys'] = array_values($this->definition['foreign_keys'] ?? []);
    }

    public function table(): string
    {
        return $this->definition['table'];
    }

    public function columns(): array
    {
        return $this->definition['columns'];
    }

    public function columnNames(): array
    {
        return array_keys($this->definition['columns']);
    }

    public function hasColumn(string $name): bool
    {
        return array_key_exists($name, $this->definition['columns']);
    }

    public function column(string $name): ?array
    {
        return $this->definition['columns'][$name] ?? null;
    }

    public function indexes(): array
    {
        return $this->definition['indexes'];
    }

    public function foreignKeys(): array
    {
        return $this->definition['foreign_keys'];
    }

    public function timestamps(): bool
    {
        return (bool) ($this->definition['timestamps'] ?? true);
    }

    public function softDeletes(): bool
    {
        return (bool) ($this->definition['soft_deletes'] ?? false);
    }

    public function piiColumns(): array
    {
        return Arr::wrap($this->definition['pii'] ?? []);
    }

    public function options(): array
    {
        return $this->definition['options'] ?? [];
    }

    public function toArray(): array
    {
        return $this->definition;
    }

    private function normalizeColumns(array $columns): array
    {
        $normalized = [];

        foreach ($columns as $name => $definition) {
            if (is_int($name) && isset($definition['name'])) {
                $name = $definition['name'];
            }

            if (! is_string($name)) {
                throw new \InvalidArgumentException('Blueprint columns must be keyed by column name.');
            }

            $definition['type'] = $definition['type'] ?? 'string';
            $normalized[$name] = $definition;
        }

        return $normalized;
    }
}
