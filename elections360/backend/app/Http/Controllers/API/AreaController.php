<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AreaResource;
use App\Models\Area;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AreaController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AreaResource::collection(
            Area::with(['children', 'committees'])->paginate()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $area = Area::create($this->validateData($request));

        return response()->json(new AreaResource($area->load(['children', 'committees'])), 201);
    }

    public function show(Area $area): AreaResource
    {
        return new AreaResource($area->load(['children', 'committees']));
    }

    public function update(Request $request, Area $area): AreaResource
    {
        $area->update($this->validateData($request, true));

        return new AreaResource($area->load(['children', 'committees']));
    }

    public function destroy(Area $area): JsonResponse
    {
        $area->delete();

        return response()->json(null, 204);
    }

    private function validateData(Request $request, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'parent_id' => ['nullable', 'exists:areas,id'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ]);
    }
}
