<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Committee;
use Illuminate\Http\Request;

class CampaignCommitteeController extends Controller
{
    public function index(Campaign $campaign)
    {
        return $campaign->committees()->with('geoArea')->paginate(20);
    }

    public function attach(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'committee_ids' => ['required', 'array', 'min:1'],
            'committee_ids.*' => ['string'],
            'defaults.agent_quota' => ['nullable', 'integer', 'min:0'],
            'defaults.target_voters' => ['nullable', 'integer', 'min:0'],
        ]);

        $defaults = [
            'agent_quota' => data_get($data, 'defaults.agent_quota', 0),
            'target_voters' => data_get($data, 'defaults.target_voters'),
        ];

        $syncData = [];
        foreach ($data['committee_ids'] as $committeeId) {
            $syncData[$committeeId] = $defaults;
        }

        $campaign->committees()->syncWithoutDetaching($syncData);

        return response()->json(['ok' => true]);
    }

    public function detach(Campaign $campaign, Committee $committee)
    {
        $campaign->committees()->detach($committee->getKey());

        return response()->json(['ok' => true]);
    }
}
