<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends Factory<Role>
 */
class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        $scope = Arr::random(['system', 'election', 'committee']);

        return [
            'name' => $this->faker->unique()->jobTitle(),
            'guard_name' => 'web',
            'scope' => $scope,
            'permissions_json' => [
                'label' => $this->faker->unique()->words(2, true),
                'description' => $this->faker->sentence(),
            ],
            'auto_assign_rules' => [
                'priority' => $this->faker->numberBetween(1, 100),
                'min_activities' => $this->faker->numberBetween(0, 50),
                'scope' => $scope,
            ],
        ];
    }
}

