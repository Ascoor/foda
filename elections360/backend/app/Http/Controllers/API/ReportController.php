<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReportController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ReportResource::collection(
            Report::with(['area', 'agent.committee'])->latest()->paginate()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $report = Report::create($this->validateData($request));

        return response()->json(new ReportResource($report->load(['area', 'agent.committee'])), 201);
    }

    public function show(Report $report): ReportResource
    {
        return new ReportResource($report->load(['area', 'agent.committee']));
    }

    public function update(Request $request, Report $report): ReportResource
    {
        $report->update($this->validateData($request, true));

        return new ReportResource($report->load(['area', 'agent.committee']));
    }

    public function destroy(Report $report): JsonResponse
    {
        $report->delete();

        return response()->json(null, 204);
    }

    private function validateData(Request $request, bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:50'],
            'area_id' => ['nullable', 'exists:areas,id'],
            'agent_id' => ['nullable', 'exists:agents,id'],
        ]);
    }
}
