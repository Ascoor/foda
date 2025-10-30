<?php

namespace Database\Factories;

use App\Enums\MembershipRole;
use App\Enums\MembershipScopeType;
use App\Models\Area;
use App\Models\Campaign;
use App\Models\Membership;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Membership>
 */
class MembershipFactory extends Factory
{
    protected $model = Membership::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'scope_type' => MembershipScopeType::Area->value,
            'scope_id' => fn () => Area::factory()->create()->id,
            'role' => $this->faker->randomElement(MembershipRole::values()),
        ];
    }

    public function forArea(Area $area, MembershipRole $role): self
    {
        return $this->state(fn () => [
            'scope_type' => MembershipScopeType::Area->value,
            'scope_id' => $area->id,
            'role' => $role->value,
        ]);
    }

    public function forCampaign(Campaign $campaign, MembershipRole $role): self
    {
        return $this->state(fn () => [
            'scope_type' => MembershipScopeType::Campaign->value,
            'scope_id' => $campaign->id,
            'role' => $role->value,
        ]);
    }
}
