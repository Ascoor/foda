<?php

namespace App\Http\Controllers\ElectionCircle\Concerns;

use Illuminate\Http\Request;

trait HandlesIndexRequests
{
    /**
     * Apply search, filtering and pagination to a query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  array<string>  $filterable
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    protected function paginateAndFilter(Request $request, $query, array $filterable = [])
    {
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('id', $search);
            });
        }

        foreach ($filterable as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->input($field));
            }
        }

        $perPage = $request->integer('per_page', 15);

        return $query->paginate($perPage);
    }
}
