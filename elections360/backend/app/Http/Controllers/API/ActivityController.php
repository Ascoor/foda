<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ActivityResource::collection(
            Activity::with(['area'])->latest('scheduled_at')->paginate()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $activity = Activity::create($this->validateData($request));

        return response()->json(new ActivityResource($activity->load(['area'])), 201);
    }

    public function show(Activity $activity): ActivityResource
    {
        return new ActivityResource($activity->load(['area']));
    }

    public function update(Request $request, Activity $activity): ActivityResource
    {
        $activity->update($this->validateData($request, true));

        return new ActivityResource($activity->load(['area']));
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json(null, 204);
    }

    private function validateData(Request $request, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:50'],
            'scheduled_at' => ['nullable', 'date'],
            'area_id' => ['nullable', 'exists:areas,id'],
        ]);
    }
}
