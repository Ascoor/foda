<?php

namespace App\Http\Controllers\Api\Traits;

trait ApiResponse
{
    protected function ok($data = null, array $meta = [])
    {
        return response()->json(['status' => 'ok', 'data' => $data, 'meta' => $meta], 200);
    }

    protected function created($data = null, array $meta = [])
    {
        return response()->json(['status' => 'created', 'data' => $data, 'meta' => $meta], 201);
    }

    protected function unprocessable($errors)
    {
        return response()->json(['status' => 'error', 'errors' => $errors], 422);
    }

    protected function forbidden($msg = 'Forbidden')
    {
        return response()->json(['status' => 'error', 'errors' => [$msg]], 403);
    }

    protected function notFound($msg = 'Not Found')
    {
        return response()->json(['status' => 'error', 'errors' => [$msg]], 404);
    }
}
