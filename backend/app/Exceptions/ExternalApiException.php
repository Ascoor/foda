<?php

namespace App\Exceptions;

use Exception;

class ExternalApiException extends Exception
{
    public static function fromResponse(string $service, int $status, string $message = ''): self
    {
        $description = $message !== '' ? $message : 'Unexpected response returned from external service.';

        return new self(sprintf('[%s] %s (status: %d)', $service, $description, $status));
    }
}
