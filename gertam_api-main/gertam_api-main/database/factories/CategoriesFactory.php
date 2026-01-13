<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Categories>
 */
class CategoriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $seed = $this->faker->unique()->numberBetween(1, 100000);
        return [
            "name" => fake()->word(2, true),
            "description" => fake()->paragraph(),
            "ad_imae_url" => "https://picsum.photos/seed/{$seed}/800/600",
        ];
    }
}
