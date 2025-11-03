<?php

namespace App\Services\Auth;

use App\Models\Activity;
use App\Models\Observation;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class RoleIntelligenceService
{
    public function evaluate(User $user, array $context = []): ?Role
    {
        $roles = Role::query()->with('permissions')->get();
        $managedRoleNames = $roles
            ->filter(fn (Role $role) => ! ($role->auto_assign_rules['manual_only'] ?? false))
            ->pluck('name')
            ->all();

        $metrics = $this->collectMetrics($user, $context);

        $candidate = $this->selectRole($roles, $metrics, $context);

        if (! $candidate) {
            return null;
        }

        if ($user->hasRole($candidate->name)) {
            return null;
        }

        $staticRoles = $user->roles
            ->pluck('name')
            ->reject(fn (string $name) => in_array($name, $managedRoleNames, true))
            ->values()
            ->all();

        $user->syncRoles(array_merge($staticRoles, [$candidate->name]));

        return $candidate;
    }

    protected function selectRole(Collection $roles, array $metrics, array $context): ?Role
    {
        $preferredScope = $context['preferred_scope'] ?? $metrics['dominant_scope'] ?? null;

        return $roles
            ->filter(function (Role $role) use ($metrics, $preferredScope) {
                $rules = $role->auto_assign_rules ?? [];

                if (($rules['manual_only'] ?? false) === true) {
                    return false;
                }

                if (isset($rules['scope']) && $preferredScope && $rules['scope'] !== $preferredScope) {
                    return false;
                }

                foreach (Arr::get($rules, 'thresholds', []) as $metric => $value) {
                    if (($metrics[$metric] ?? 0) < $value) {
                        return false;
                    }
                }

                return true;
            })
            ->sortByDesc(fn (Role $role) => Arr::get($role->auto_assign_rules ?? [], 'priority', 0))
            ->first();
    }

    protected function collectMetrics(User $user, array $context = []): array
    {
        $activitiesCount = Activity::query()->where('created_by', $user->id)->count();

        $teams = Team::query()->withCount('volunteers')->where('supervisor_id', $user->id)->get();
        $committeesAssigned = $teams->count();
        $volunteersManaged = (int) $teams->sum('volunteers_count');

        $observations = Observation::query()
            ->whereHas('volunteer.team', fn ($query) => $query->where('supervisor_id', $user->id))
            ->count();

        $campaignsManaged = (int) ($context['campaigns_managed']
            ?? count($context['campaign_ids'] ?? []));

        $dominantScope = $context['preferred_scope']
            ?? ($campaignsManaged > 0 ? 'election'
                : ($committeesAssigned > 0 ? 'committee' : 'system'));

        return [
            'activities_created' => $activitiesCount,
            'committees_assigned' => $committeesAssigned,
            'volunteers_managed' => $volunteersManaged,
            'observations_submitted' => $observations,
            'campaigns_managed' => $campaignsManaged,
            'dominant_scope' => $dominantScope,
        ];
    }
}
