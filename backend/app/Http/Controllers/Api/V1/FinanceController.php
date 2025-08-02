<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\FinanceRequest;
use App\Http\Resources\FinanceResource;
use App\Models\Finance;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Finance::query();

        if ($request->filled('reference_id')) {
            $query->where('reference_id', $request->reference_id);
        }

        return FinanceResource::collection($query->get());
    }

    public function store(FinanceRequest $request)
    {
        $finance = Finance::create($request->validated());

        return (new FinanceResource($finance))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Finance $finance)
    {
        return new FinanceResource($finance);
    }

    public function update(FinanceRequest $request, Finance $finance)
    {
        $finance->update($request->validated());

        return new FinanceResource($finance);
    }

    public function destroy(Finance $finance)
    {
        $finance->delete();

        return response()->noContent();
    }
}
