<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSwotRequest;
use App\Http\Requests\UpdateSwotRequest;
use App\Http\Resources\SwotResource;
use App\Models\Swot;
use Illuminate\Http\Request;

class SwotController extends Controller
{
    public function index()
    {
        return SwotResource::collection(Swot::latest()->paginate());
    }

    public function store(StoreSwotRequest $request)
    {
        $swot = Swot::create($request->validated() + ['created_by' => $request->user()->id]);
        return SwotResource::make($swot);
    }

    public function show(Swot $swot)
    {
        return SwotResource::make($swot);
    }

    public function update(UpdateSwotRequest $request, Swot $swot)
    {
        $swot->update($request->validated());
        return SwotResource::make($swot);
    }

    public function destroy(Swot $swot)
    {
        $swot->delete();
        return response()->noContent();
    }

    public function report(Request $request)
    {
        $request->validate([
            'entity_type' => 'required|string',
            'entity_ids' => 'array',
        ]);

        $query = Swot::where('entity_type', $request->entity_type);

        if ($request->filled('entity_ids')) {
            $query->whereIn('entity_id', $request->entity_ids);
        }

        return SwotResource::collection($query->get());
    }
}
