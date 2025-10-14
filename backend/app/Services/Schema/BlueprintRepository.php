<?php

namespace App\Services\Schema;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;

class BlueprintRepository
{
    public function __construct(private ?string $path = null)
    {
        $this->path = $path ?? database_path('migrations/blueprints');
    }

    /**
     * @return Collection<int, TableBlueprint>
     */
    public function all(): Collection
    {
        return collect(File::files($this->path))
            ->filter(fn ($file) => $file->getExtension() === 'stub')
            ->mapWithKeys(function ($file) {
                $blueprint = $this->loadFromFile($file->getPathname());

                return [$blueprint->table() => $blueprint];
            })
            ->sortKeys();
    }

    public function find(string $table): ?TableBlueprint
    {
        $file = $this->path.DIRECTORY_SEPARATOR.$table.'.stub';

        if (! File::exists($file)) {
            return null;
        }

        return $this->loadFromFile($file);
    }

    public function require(string $table): TableBlueprint
    {
        $blueprint = $this->find($table);

        if (! $blueprint) {
            throw new \RuntimeException("Blueprint stub for table [{$table}] was not found.");
        }

        return $blueprint;
    }

    /**
     * @param  array<int, string>|null  $tables
     * @return Collection<int, TableBlueprint>
     */
    public function forTables(?array $tables = null): Collection
    {
        $blueprints = $this->all();

        if ($tables === null || $tables === []) {
            return $blueprints;
        }

        return collect($tables)
            ->filter()
            ->map(fn ($table) => $this->require($table))
            ->keyBy(fn (TableBlueprint $blueprint) => $blueprint->table());
    }

    private function loadFromFile(string $path): TableBlueprint
    {
        $definition = include $path;

        if (! is_array($definition)) {
            throw new \RuntimeException("Blueprint stub [{$path}] must return an array definition.");
        }

        return new TableBlueprint($definition);
    }
}
