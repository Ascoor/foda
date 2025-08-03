<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\FinanceRequest;
use App\Http\Resources\FinanceResource;
use App\Models\Finance;
use Illuminate\Http\Request;

/**
 * Finance CRUD and reporting endpoints.
 * Legacy: none.
 */

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Finance::with('category');

        if ($request->filled('reference_id')) {
            $query->where('reference_id', $request->reference_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return FinanceResource::collection($query->get());
    }

    public function store(FinanceRequest $request)
    {
        $finance = Finance::create($request->validated());

        return (new FinanceResource($finance->load('category')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Finance $finance)
    {
        return new FinanceResource($finance->load('category'));
    }

    public function update(FinanceRequest $request, Finance $finance)
    {
        $finance->update($request->validated());

        return new FinanceResource($finance->load('category'));
    }

    public function destroy(Finance $finance)
    {
        $finance->delete();

        return response()->noContent();
    }

    public function report(Request $request)
    {
        $query = Finance::with('category');

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->to);
        }

        $finances = $query->get();

        return FinanceResource::collection($finances);
    }
}
