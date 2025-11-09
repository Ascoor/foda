<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Services\External\ElectionDataService;
use Throwable;

class ExternalDataController extends ApiController
{
    public function electionSummary(ElectionDataService $svc)
    {
        try {
            $data = $svc->summary();
            if (! $data) {
                return response()->json([
                    'status' => 'error',
                    'errors' => ['No data'],
                ], 502);
            }
            return $this->ok($data);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'errors' => ['Upstream timeout or bad gateway'],
            ], 504);
        }
    }
}
