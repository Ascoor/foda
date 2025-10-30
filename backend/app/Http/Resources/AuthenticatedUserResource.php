<?php

namespace App\Http\Resources;

use App\Data\ResolvedScope;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthenticatedUserResource extends JsonResource
{
    public function __construct($resource, private ?ResolvedScope $scope = null)
    {
        parent::__construct($resource);
    }

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'memberships' => $this->memberships->map(fn ($membership) => [
                'id' => $membership->id,
                'scopeType' => $membership->scope_type->value,
                'scopeId' => $membership->scope_id,
                'role' => $membership->role->value,
            ]),
            'scopes' => $this->scope ? [
                'areas' => $this->scope->areaIds,
                'campaigns' => $this->scope->campaignIds,
            ] : null,
        ];
    }
}
