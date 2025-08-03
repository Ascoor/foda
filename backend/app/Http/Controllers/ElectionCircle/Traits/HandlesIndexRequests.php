<?php

namespace App\Http\Controllers\ElectionCircle\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HandlesIndexRequests
{
    /**
     * Apply search, filtering, sorting and pagination to a query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  array<int,string>  $searchable
     * @return \Illuminate\Contracts\Pagination\Paginator|\Illuminate\Database\Eloquent\Collection
     */
    protected function handleIndex(Request $request, Builder $query, array $searchable = [])
    {
        if ($search = $request->get('search')) {
            $query->where(function (Builder $q) use ($search, $searchable) {
                foreach ($searchable as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        foreach ($request->except(['search', 'sort_by', 'order', 'page', 'per_page']) as $column => $value) {
            if ($value !== null && $value !== '') {
                $query->where($column, $value);
            }
        }

        if ($sort = $request->get('sort_by')) {
            $query->orderBy($sort, $request->get('order', 'asc'));
        }

        $perPage = $request->get('per_page');
        return $perPage ? $query->paginate((int) $perPage) : $query->get();
    }
}
