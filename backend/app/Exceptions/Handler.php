<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
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
        return $this->jsonErrorResponse($e, $e->status, [
            'message' => $e->getMessage(),
            'errors' => $e->errors(),
            'code' => 'VALIDATION_ERROR',
        ]);
    }

    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {
            if ($e instanceof QueryException && (string) $e->getCode() === '23000') {
                $message = __('validation.unique', ['attribute' => 'record']);

                return $this->jsonErrorResponse($e, 422, [
                    'message' => $message,
                    'errors' => ['date' => [__('validation.unique', ['attribute' => 'date'])]],
                    'code' => 'VALIDATION_ERROR',
                ]);
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

            $payload = [
                'message' => $e->getMessage() ?: __('Server Error'),
                'errors' => method_exists($e, 'errors') ? $e->errors() : [],
                'code' => $code,
            ];

            return $this->jsonErrorResponse($e, $status, $payload);
        }

        return parent::render($request, $e);
    }

    protected function jsonErrorResponse(Throwable $e, int $status, array $payload): JsonResponse
    {
        return response()->json($payload, $status);
    }
}
