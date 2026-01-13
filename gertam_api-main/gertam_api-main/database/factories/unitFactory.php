<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\unit>
 */
class unitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => fake()->word(2, true),
            "ar_name" => fake()->word(4, true),
            "en_name" => fake()->word(4, true),

        ];
    }
}
