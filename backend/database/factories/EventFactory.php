<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\GeoArea;
use App\Models\Team;

/** @extends Factory<\App\Models\Event> */
class EventFactory extends Factory
{
    protected $model = \App\Models\Event::class;

    public function definition(): array
    {
        $types = ['مؤتمر شعبي', 'جولة ميدانية', 'اجتماع فريق', 'لقاء شبابي'];

        return [
            'campaign_id' => Campaign::factory(),
            'title' => $this->faker->randomElement($types) . ' ' . $this->faker->citySuffix(),
            'event_type' => $this->faker->randomElement($types),
            'location' => $this->faker->randomElement(['قاعة النصر', 'سرادق الحي', 'مركز شباب المدينة', 'مقر الحملة الرئيسي']),
            'geo_area_id' => GeoArea::factory(),
            'starts_at' => $this->faker->dateTimeBetween('-1 week', '+4 weeks'),
            'ends_at' => $this->faker->optional(0.6)->dateTimeBetween('+1 hour', '+2 days'),
            'status' => $this->faker->randomElement(['scheduled', 'completed', 'cancelled']),
            'description' => $this->faker->paragraph(3, true),
            'team_id' => Team::factory(),
        ];
    }
}
