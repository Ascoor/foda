<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeDashboardResource;
use App\Models\Area;
use App\Models\Event;
use App\Models\Team;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(): HomeDashboardResource
    {
        $registrations = Voter::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'count' => (int) $row->count,
            ]);

        $stats = [
            'areas' => Area::count(),
            'volunteers' => Volunteer::count(),
            'voters' => Voter::count(),
            'teams' => Team::count(),
            'events' => Event::count(),
            'registrations' => $registrations,
        ];

        return new HomeDashboardResource($stats);
    }

    public function heatmap(): JsonResponse
    {
        $points = Area::select('x as lat', 'y as lng')->get();

        return response()->json(['data' => $points]);
    }
}
