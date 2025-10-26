<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAreaRequest;
use App\Http\Requests\UpdateAreaRequest;
use App\Http\Resources\AreaResource;
use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    use HandlesIndexRequests;

    public function index(Request $request)
    {
        $areas = $this->handleIndex(
            $request,
            Area::query(),
            ['name'],
            ['name'],
            ['name'],
            ['name']
        );

        return AreaResource::collection($areas);
    }

    public function store(StoreAreaRequest $request)
    {
        $area = Area::create($request->validated());

        return (new AreaResource($area))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Area $area)
    {
        return new AreaResource($area);
    }

    public function update(UpdateAreaRequest $request, Area $area)
    {
        $area->update($request->validated());

        return new AreaResource($area);
    }

    public function destroy(Area $area)
    {
        $area->delete();

        return response()->noContent();
    }
}
