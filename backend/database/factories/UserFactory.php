<?php

namespace Database\Factories;

use App\Models\User;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $firstNames = ['أحمد', 'محمد', 'فاطمة', 'سارة', 'خالد', 'ليلى', 'مها', 'يوسف'];
        $lastNames = ['العتيبي', 'الهاشمي', 'الغامدي', 'الشريف', 'العنزي', 'السبيعي'];

        return [
            'name' => $this->faker->randomElement($firstNames) . ' ' . $this->faker->randomElement($lastNames),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('Password@123'),
            'status' => $this->faker->randomElement(['active', 'onboarding', 'inactive']),
            'last_login_at' => $this->faker->boolean(60) ? now()->subDays($this->faker->numberBetween(1, 10)) : null,
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): Factory
    {
        return $this->state(fn () => ['email_verified_at' => null]);
    }
}
