<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommitteeResource;
use App\Models\Committee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CommitteeController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CommitteeResource::collection(
            Committee::with(['area', 'agents', 'voters'])->paginate()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $committee = Committee::create($this->validateData($request));

        return response()->json(new CommitteeResource($committee->load(['area'])), 201);
    }

    public function show(Committee $committee): CommitteeResource
    {
        return new CommitteeResource($committee->load(['area', 'agents', 'voters']));
    }

    public function update(Request $request, Committee $committee): CommitteeResource
    {
        $committee->update($this->validateData($request, $committee->id, true));

        return new CommitteeResource($committee->load(['area', 'agents', 'voters']));
    }

    public function destroy(Committee $committee): JsonResponse
    {
        $committee->delete();

        return response()->json(null, 204);
    }

    private function validateData(Request $request, ?int $committeeId = null, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'code' => [$required, 'string', 'max:20', 'unique:committees,code,' . $committeeId],
            'area_id' => [$required, 'exists:areas,id'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
