<?php

namespace Database\Factories;

use App\Models\Sms;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SmsFactory extends Factory
{
    protected $model = Sms::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'sent', 'failed']);

        return [
            'user_id' => User::factory(),
            'message' => $this->faker->sentence,
            'recipient' => $this->faker->e164PhoneNumber,
            'status' => $status,
            'sent_at' => $status === 'sent' ? now() : null,
            'scheduled_for' => $status === 'pending' ? now()->addHour() : null,
        ];
    }
}
