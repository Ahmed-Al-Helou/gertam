<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Articles>
 */
class ArticlesFactory extends Factory
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
            "title" => fake()->title(),
            "subtitle" => fake()->title(),
            "image_url" => "https://picsum.photos/seed/{$seed}/800/600",
            "content" => fake()->paragraph()
        ];
    }
}
