<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Base;

use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller as BaseController;

abstract class ApiController extends BaseController
{
    protected function ok(mixed $data = [], int $code = 200): JsonResponse
    {
        return ApiResponse::success($data ?? [], 'ok', $code);
    }

    protected function created(mixed $data = []): JsonResponse
    {
        return ApiResponse::success($data ?? [], 'created', 201);
    }

    protected function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    protected function error(string $message, int $code = 500, array $errors = []): JsonResponse
    {
        return ApiResponse::error($message, $code, $errors);
    }

    protected function resource(JsonResource|AnonymousResourceCollection $resource, int $code = 200): JsonResponse
    {
        return ApiResponse::fromResource($resource, $code);
    }
}
