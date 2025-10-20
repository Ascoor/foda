<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoterRequest;
use App\Http\Requests\UpdateVoterRequest;
use App\Http\Resources\VoterResource;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Response;

class VoterController extends Controller
{
    use HandlesIndexRequests;

    public function index(Request $request)
    {
        $voters = $this->handleIndex(
            $request,
            Voter::with(['campaign', 'geoArea', 'committee']),
            ['full_name', 'national_id', 'email', 'phone', 'address', 'notes'],
            ['campaign_id', 'geo_area_id', 'committee_id', 'support_status'],
            ['full_name', 'national_id', 'email', 'phone', 'address', 'notes'],
            ['full_name', 'last_contact_at', 'created_at', 'updated_at']
        );

        return VoterResource::collection($voters);
    }

    public function store(StoreVoterRequest $request)
    {
        $voter = Voter::create($request->validated());

        return (new VoterResource($voter->load(['campaign', 'geoArea', 'committee'])))->response()->setStatusCode(201);
    }

    public function show(Voter $voter)
    {
        return new VoterResource($voter->load(['campaign', 'geoArea', 'committee']));
    }

    public function update(UpdateVoterRequest $request, Voter $voter)
    {
        $voter->update($request->validated());

        return new VoterResource($voter->load(['campaign', 'geoArea', 'committee']));
    }

    public function destroy(Voter $voter)
    {
        $voter->delete();

        return response()->noContent();
    }

    public function import(Request $request)
    {
        $file = $request->file('file');
        if (!$file) {
            return response()->json(['message' => 'No file provided'], 422);
        }

        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle);
        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);
            if (!$data) {
                continue;
            }

            $payload = Arr::only($data, (new Voter())->getFillable());

            if (isset($payload['last_contact_at']) && $payload['last_contact_at'] !== '') {
                try {
                    $payload['last_contact_at'] = Carbon::parse($payload['last_contact_at']);
                } catch (\Throwable $exception) {
                    unset($payload['last_contact_at']);
                }
            }

            $payload = array_filter($payload, static fn ($value) => $value !== '');

            if (!isset($payload['campaign_id']) || !isset($payload['full_name'])) {
                continue;
            }

            Voter::create($payload);
        }
        fclose($handle);

        return response()->json(['message' => 'Imported'], 201);
    }

    public function export()
    {
        $voters = Voter::with(['campaign', 'geoArea', 'committee'])->get();
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="voters.csv"',
        ];

        $columns = [
            'id',
            'campaign_id',
            'geo_area_id',
            'committee_id',
            'full_name',
            'national_id',
            'phone',
            'email',
            'address',
            'support_status',
            'last_contact_at',
            'notes',
            'source',
            'created_at',
            'updated_at',
        ];

        $callback = function() use ($voters, $columns) {
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
