<?php

namespace App\Exceptions;

use RuntimeException;

class ExternalApiException extends RuntimeException
{
    protected string $service;

    protected ?int $status;

    protected ?array $details;

    public function __construct(string $service, string $message, ?int $status = null, ?array $details = null)
    {
        parent::__construct($message);

        $this->service = $service;
        $this->status = $status;
        $this->details = $details;
    }

    public function getService(): string
    {
        return $this->service;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function getDetails(): ?array
    {
        return $this->details;
    }
}
