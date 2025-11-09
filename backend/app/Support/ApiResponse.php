<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

class ApiResponse
{
    /**
     * Create a standardized success response payload.
     */
    public static function success(mixed $data = [], string $status = 'ok', int $code = 200, array $meta = []): JsonResponse
    {
        $payload = [
            'status' => $status,
            'data' => $data ?? [],
        ];

        if (! empty($meta)) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $code);
    }

    /**
     * Transform a Laravel resource into the standard payload structure.
     */
    public static function fromResource(JsonResource|AnonymousResourceCollection $resource, int $code = 200): JsonResponse
    {
        $response = $resource->response()->setStatusCode($code);
        $raw = $response->getData(true);

        $status = $code === 201 ? 'created' : 'ok';

        $data = $raw['data'] ?? $raw;

        $meta = [];

        if (isset($raw['meta']) && is_array($raw['meta'])) {
            $meta = $raw['meta'];
        }

        if (isset($raw['links']) && is_array($raw['links'])) {
            $meta['links'] = $raw['links'];
        }

        $additional = Arr::except($raw, ['data', 'meta', 'links']);

        if (! empty($additional)) {
            $meta = array_merge($meta, $additional);
        }

        $payload = [
            'status' => $status,
            'data' => $data ?? [],
        ];

        if (! empty($meta)) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $code);
    }

    /**
     * Create a standardized error response payload.
     */
    public static function error(string $message, int $code = 400, array $errors = [], ?string $errorCode = null): JsonResponse
    {
        $normalizedErrors = self::normalizeErrors($errors, $message);

        $payload = [
            'status' => 'error',
            'data' => null,
        ];

        if (! empty($normalizedErrors)) {
            $payload['errors'] = $normalizedErrors;
        }

        if ($errorCode !== null) {
            $payload['meta'] = ['code' => $errorCode];
        }

        return response()->json($payload, $code);
    }

    /**
     * Normalize validation or domain errors to a flat list of strings.
     *
     * @param  array<int|string, mixed>  $errors
     * @return string[]
     */
    public static function normalizeErrors(array $errors, ?string $message = null): array
    {
        $normalized = [];

        if ($errors !== []) {
            if (array_is_list($errors)) {
                $normalized = array_values(array_filter(
                    array_map(static fn ($value): ?string => is_string($value) ? trim($value) : null, $errors),
                    static fn ($value): bool => $value !== null && $value !== ''
                ));
            } else {
                foreach ($errors as $value) {
                    if (is_array($value)) {
                        foreach ($value as $entry) {
                            if (is_string($entry) && trim($entry) !== '') {
                                $normalized[] = trim($entry);
                            }
                        }
                    } elseif (is_string($value) && trim($value) !== '') {
                        $normalized[] = trim($value);
                    }
                }
            }
        }

        if ($message !== null && trim($message) !== '') {
            $normalized[] = trim($message);
        }

        if ($normalized === []) {
            return $message && trim($message) !== '' ? [trim($message)] : [];
        }

        return array_values(array_unique($normalized));
    }
}
