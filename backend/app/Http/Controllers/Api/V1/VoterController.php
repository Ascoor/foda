<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoterRequest;
use App\Http\Requests\UpdateVoterRequest;
use App\Http\Resources\VoterResource;
use App\Models\Campaign;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class VoterController extends Controller
{
    use HandlesIndexRequests;

    public function index(Request $request, Campaign $campaign)
    {
        $query = Voter::with('area')->forCampaign($campaign);

        $voters = $this->handleIndex(
            $request,
            $query,
            ['name', 'email', 'phone', 'address'],
            ['area_id', 'sex', 'voter_id'],
            ['name', 'email', 'phone', 'address'],
            ['name', 'created_at', 'updated_at']
        );

        return VoterResource::collection($voters);
    }

    public function store(StoreVoterRequest $request, Campaign $campaign)
    {
        $payload = $request->validated();
        $payload['campaign_id'] = $campaign->getKey();

        $voter = Voter::create($payload);

        return (new VoterResource($voter->load('area')))->response()->setStatusCode(201);
    }

    public function show(Campaign $campaign, Voter $voter)
    {
        abort_unless($voter->campaign_id === $campaign->getKey(), 404);

        return new VoterResource($voter->load('area'));
    }

    public function update(UpdateVoterRequest $request, Campaign $campaign, Voter $voter)
    {
        abort_unless($voter->campaign_id === $campaign->getKey(), 404);

        $payload = $request->validated();
        $payload['campaign_id'] = $campaign->getKey();

        $voter->update($payload);

        return new VoterResource($voter->load('area'));
    }

    public function destroy(Campaign $campaign, Voter $voter)
    {
        abort_unless($voter->campaign_id === $campaign->getKey(), 404);

        $voter->delete();

        return response()->noContent();
    }

    public function import(Request $request, Campaign $campaign)
    {
        $file = $request->file('file');
        if (! $file) {
            return response()->json(['message' => 'No file provided'], 422);
        }

        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle);
        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);
            if (! $data) {
                continue;
            }

            $data['campaign_id'] = $campaign->getKey();
            Voter::updateOrCreate(
                [
                    'campaign_id' => $campaign->getKey(),
                    'voter_id' => $data['voter_id'] ?? null,
                ],
                $data
            );
        }
        fclose($handle);

        return response()->json(['message' => 'Imported'], 201);
    }

    public function export(Campaign $campaign)
    {
        $voters = Voter::with('area')->where('campaign_id', $campaign->getKey())->get();
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="voters.csv"',
        ];

        $columns = ['id','name','email','phone','area_id','address','sex','birthdate','age','bloodgroup','img_url','ion_user_id','voter_id','voter_uid','add_date','created_at','updated_at'];

        $callback = function () use ($voters, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($voters as $voter) {
                fputcsv($file, $voter->only($columns));
            }
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
