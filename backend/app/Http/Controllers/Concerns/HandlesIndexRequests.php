<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HandlesIndexRequests
{
    /**
     * Apply search, filtering, sorting and pagination to a query.
     *
     * @param  array<int, string>  $searchable
     * @param  array<int, string>  $filterable
     * @param  array<int, string>  $partialMatch
     * @param  array<int, string>  $sortable
     * @return \Illuminate\Contracts\Pagination\Paginator|\Illuminate\Database\Eloquent\Collection
     */
    protected function handleIndex(
        Request $request,
        Builder $query,
        array $searchable = [],
        array $filterable = [],
        array $partialMatch = [],
        array $sortable = [],
        ?int $defaultPerPage = null
    ) {
        $search = trim((string) $request->query('search', ''));

        if ($search !== '' && $searchable !== []) {
            $query->where(function (Builder $builder) use ($search, $searchable) {
                foreach ($searchable as $column) {
                    $builder->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        $reservedKeys = ['search', 'sort_by', 'order', 'page', 'per_page'];

        $filters = $filterable === []
            ? $request->except($reservedKeys)
            : array_intersect_key($request->all(), array_flip($filterable));

        foreach ($filters as $column => $value) {
            if (in_array($column, $reservedKeys, true)) {
                continue;
            }

            if (is_array($value)) {
                $values = array_values(array_filter($value, static fn ($item) => $item !== null && $item !== ''));

                if ($values !== []) {
                    $query->whereIn($column, $values);
                }

                continue;
            }

            if ($value === null || $value === '') {
                continue;
            }

            if (in_array($column, $partialMatch, true)) {
                $query->where($column, 'like', "%{$value}%");

                continue;
            }

            $query->where($column, $value);
        }

        $sortColumn = (string) $request->query('sort_by', '');

        if ($sortColumn !== '' && ($sortable === [] || in_array($sortColumn, $sortable, true))) {
            $direction = strtolower((string) $request->query('order', 'asc'));
            $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'asc';

            $query->orderBy($sortColumn, $direction);
        }

        $perPage = (int) $request->query('per_page', 0);
        $perPage = $perPage > 0 ? $perPage : $defaultPerPage;

        if ($perPage) {
            return $query->paginate($perPage)->appends($request->query());
        }

        return $query->get();
    }
}
