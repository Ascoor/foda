<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Committee;
use App\Models\GeoArea;
use Illuminate\Http\Request;

class GeoController extends Controller
{
    public function governorates()
    {
        return GeoArea::query()
            ->where('type', 'governorate')
            ->orderBy('code')
            ->get(['id', 'code']);
    }

    public function circles(Request $request)
    {
        $data = $request->validate([
            'governorate_id' => ['required', 'string'],
        ]);

        return GeoArea::query()
            ->where('parent_id', $data['governorate_id'])
            ->whereIn('type', ['markaz', 'qesm', 'city'])
            ->orderBy('type')
            ->orderBy('code')
            ->get(['id', 'type', 'code']);
    }

    public function committees(Request $request)
    {
        $data = $request->validate([
            'geo_area_id' => ['required', 'string'],
        ]);

        return Committee::query()
            ->where('geo_area_id', $data['geo_area_id'])
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'geo_area_id']);
    }
}
