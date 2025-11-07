<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Base;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller as BaseController;

abstract class ApiController extends BaseController
{
    protected function ok(mixed $data = null, int $code = 200): JsonResponse
    {
        $payload = $data ?? ['message' => 'ok'];

        return response()->json($payload, $code);
    }

    protected function created(mixed $data = null): JsonResponse
    {
        $payload = $data ?? ['message' => 'created'];

        return response()->json($payload, 201);
    }

    protected function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    protected function error(string $message, int $code = 500, array $errors = []): JsonResponse
    {
        $body = array_filter([
            'message' => $message,
            'errors' => $errors ?: null,
            'code' => $code,
        ], static fn ($value) => $value !== null);

        return response()->json($body, $code);
    }

    protected function resource(JsonResource|AnonymousResourceCollection $resource, int $code = 200): JsonResponse
    {
        return $resource->response()->setStatusCode($code);
    }
}
