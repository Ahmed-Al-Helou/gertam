<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductDetail>
 */
class ProductDetailFactory extends Factory
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
            "ar_name" => fake()->word(3, true),
            "en_name" => fake()->word(3, true),
            "ar_description" => fake()->paragraph(),
            "en_description" => fake()->paragraph(),
            "price" => fake()->randomFloat(2,5,500),
            "old_price" => fake()->randomFloat(2,10,800),
            "thumbnail" => "https://picsum.photos/seed/{$seed}/800/600",
            "categories_id" => fake()->numberBetween(1,10),
            "store_id" => fake()->numberBetween(1,10)

        ];
    }
}
