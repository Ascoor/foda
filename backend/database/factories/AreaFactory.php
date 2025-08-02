<?php

namespace Database\Factories; 
 
use App\Models\Area;
use Illuminate\Database\Eloquent\Factories\Factory;
  

/** @extends Factory<\App\Models\Area> */
class AreaFactory extends Factory
{
    protected $model = \App\Models\Area::class;
 

    public function definition(): array
    {
        return [ 
            'name' => $this->faker->city(),
            'description' => $this->faker->sentence(),
            'x' => $this->faker->latitude(),
            'y' => $this->faker->longitude(),
        ];
    }
 
 
}   
