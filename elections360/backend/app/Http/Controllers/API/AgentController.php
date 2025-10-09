<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgentResource;
use App\Models\Agent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AgentController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AgentResource::collection(
            Agent::with(['committee.area'])->paginate()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $agent = Agent::create($this->validateData($request));

        return response()->json(new AgentResource($agent->load(['committee.area'])), 201);
    }

    public function show(Agent $agent): AgentResource
    {
        return new AgentResource($agent->load(['committee.area']));
    }

    public function update(Request $request, Agent $agent): AgentResource
    {
        $agent->update($this->validateData($request, true));

        return new AgentResource($agent->load(['committee.area']));
    }

    public function destroy(Agent $agent): JsonResponse
    {
        $agent->delete();

        return response()->json(null, 204);
    }

    private function validateData(Request $request, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'status' => ['nullable', 'string', 'max:50'],
            'committee_id' => ['nullable', 'exists:committees,id'],
        ]);
    }
}
