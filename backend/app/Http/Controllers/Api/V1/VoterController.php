<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoterRequest;
use App\Http\Requests\UpdateVoterRequest;
use App\Http\Resources\VoterResource;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class VoterController extends Controller
{
    public function index(Request $request)
    {
        $query = Voter::with('area');

        if ($name = $request->query('name')) {
            $query->where('name', 'like', "%{$name}%");
        }
        if ($areaId = $request->query('area_id')) {
            $query->where('area_id', $areaId);
        }
        if ($voterId = $request->query('voter_id')) {
            $query->where('voter_id', $voterId);
        }

        return VoterResource::collection($query->get());
    }

    public function store(StoreVoterRequest $request)
    {
        $voter = Voter::create($request->validated());

        return (new VoterResource($voter->load('area')))->response()->setStatusCode(201);
    }

    public function show(Voter $voter)
    {
        return new VoterResource($voter->load('area'));
    }

    public function update(UpdateVoterRequest $request, Voter $voter)
    {
        $voter->update($request->validated());

        return new VoterResource($voter->load('area'));
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
            Voter::create($data);
        }
        fclose($handle);

        return response()->json(['message' => 'Imported'], 201);
    }

    public function export()
    {
        $voters = Voter::with('area')->get();
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="voters.csv"',
        ];

        $columns = ['id','name','email','phone','area_id','address','sex','birthdate','age','bloodgroup','img_url','ion_user_id','voter_id','add_date','created_at','updated_at'];

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
