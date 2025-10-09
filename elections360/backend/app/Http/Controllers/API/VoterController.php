<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\VoterResource;
use App\Models\Voter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VoterController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return VoterResource::collection(
            Voter::with(['area', 'committee'])->latest()->paginate()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateData($request);
        $voter = Voter::create($data);

        return response()->json(new VoterResource($voter->load(['area', 'committee'])), 201);
    }

    public function show(Voter $voter): VoterResource
    {
        return new VoterResource($voter->load(['area', 'committee']));
    }

    public function update(Request $request, Voter $voter): VoterResource
    {
        $voter->update($this->validateData($request, $voter->id, true));

        return new VoterResource($voter->load(['area', 'committee']));
    }

    public function destroy(Voter $voter): JsonResponse
    {
        $voter->delete();

        return response()->json(null, 204);
    }

    private function validateData(Request $request, ?int $voterId = null, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'national_id' => [$required, 'string', 'max:20', 'unique:voters,national_id,' . $voterId],
            'phone' => ['nullable', 'string', 'max:20'],
            'gender' => ['nullable', 'in:male,female'],
            'area_id' => ['nullable', 'exists:areas,id'],
            'committee_id' => ['nullable', 'exists:committees,id'],
        ]);
    }
}
