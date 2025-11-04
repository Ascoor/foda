<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AreaResource;
use App\Models\Area;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AreaController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeIfPossible('viewAny', Area::class);

        $areas = Area::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%' . $request->input('search') . '%';

                $query->where(function ($inner) use ($term) {
                    $inner->where('name', 'like', $term)
                        ->orWhere('description', 'like', $term);
                });
            })
            ->orderBy('name')
            ->paginate(min((int) $request->input('per_page', 15), 100))
            ->appends($request->query());

        return AreaResource::collection($areas);
    }

    public function store(Request $request)
    {
        $this->authorizeIfPossible('create', Area::class);

        $data = $this->validateRequest($request);

        $area = Area::query()->create($data);

        return (new AreaResource($area))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Area $area)
    {
        $this->authorizeIfPossible('view', $area);

        return new AreaResource($area);
    }

    public function update(Request $request, Area $area)
    {
        $this->authorizeIfPossible('update', $area);

        $data = $this->validateRequest($request, $area);

        $area->fill($data)->save();

        return new AreaResource($area->refresh());
    }

    public function destroy(Area $area): JsonResponse
    {
        $this->authorizeIfPossible('delete', $area);

        $area->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    protected function validateRequest(Request $request, ?Area $area = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'x' => ['nullable', 'numeric', 'between:-90,90'],
            'y' => ['nullable', 'numeric', 'between:-180,180'],
        ], [], [
            'x' => 'latitude',
            'y' => 'longitude',
        ]);
    }

    protected function authorizeIfPossible(string $ability, $arguments = []): void
    {
        if (method_exists($this, 'authorize')) {
            try {
                $this->authorize($ability, $arguments);
            } catch (\Throwable $exception) {
                // If a policy is not defined we silently ignore authorization checks.
            }
        }
    }
}
