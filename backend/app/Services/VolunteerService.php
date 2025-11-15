<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Volunteer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class VolunteerService
{
    public function listForCampaign(Campaign $campaign, array $filters = []): LengthAwarePaginator
    {
        $query = $campaign->volunteers()->with(['committee', 'geographicScope']);

        if ($search = Arr::get($filters, 'q')) {
            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($status = Arr::get($filters, 'status')) {
            $query->where('status', $status);
        }

        if ($scopeId = Arr::get($filters, 'geographic_scope_id')) {
            $query->where('geographic_scope_id', $scopeId);
        }

        if ($committeeId = Arr::get($filters, 'committee_id')) {
            $query->where('committee_id', $committeeId);
        }

        return $query->orderBy('name')->paginate(Arr::get($filters, 'per_page', 15));
    }

    public function create(array $payload): Volunteer
    {
        return DB::transaction(fn (): Volunteer => Volunteer::query()->create($payload)->fresh(['committee', 'geographicScope']));
    }

    public function update(Volunteer $volunteer, array $payload): Volunteer
    {
        $volunteer->fill($payload);
        $volunteer->save();

        return $volunteer->refresh()->load(['committee', 'geographicScope']);
    }

    public function delete(Volunteer $volunteer): void
    {
        $volunteer->delete();
    }
}
