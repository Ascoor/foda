<?php

namespace App\Exceptions;

use App\Support\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    protected function convertValidationExceptionToResponse(ValidationException $e, $request): JsonResponse
    {
        return ApiResponse::error(
            $e->getMessage(),
            $e->status,
            $e->errors(),
            'VALIDATION_ERROR'
        );
    }

    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {
            if ($e instanceof QueryException && (string) $e->getCode() === '23000') {
                $message = __('validation.unique', ['attribute' => 'record']);

                return ApiResponse::error(
                    $message,
                    422,
                    ['date' => [__('validation.unique', ['attribute' => 'date'])]],
                    'VALIDATION_ERROR'
                );
            }

            $status = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;
            $code = 'SERVER_ERROR';

            if ($e instanceof ValidationException) {
                $code = 'VALIDATION_ERROR';
            }

            if ($e instanceof AuthorizationException) {
                $status = 403;
                $code = 'AUTHORIZATION_ERROR';
            }

            $message = $e->getMessage() ?: __('Server Error');
            $errors = method_exists($e, 'errors') ? (array) $e->errors() : [];

            return ApiResponse::error($message, $status, $errors, $code);
        }

        return parent::render($request, $e);
    }

    protected function jsonErrorResponse(Throwable $e, int $status, array $payload): JsonResponse
    {
        return ApiResponse::error(
            $payload['message'] ?? $e->getMessage() ?? __('Server Error'),
            $status,
            (array) ($payload['errors'] ?? []),
            $payload['code'] ?? null
        );
    }

    protected function unauthenticated($request, AuthenticationException $exception): JsonResponse|Response
    {
        if ($request->expectsJson()) {
            return ApiResponse::error($exception->getMessage() ?: __('Unauthenticated.'), 401, [], 'AUTHENTICATION_ERROR');
        }

        return redirect()->guest(route('login'));
    }
}
