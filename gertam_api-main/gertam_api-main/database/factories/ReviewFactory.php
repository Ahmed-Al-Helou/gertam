<?php

namespace Database\Factories;

use App\Models\ProductDetail;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => User::inRandomOrder()->first()?->id,
            "product_id" => ProductDetail::inRandomOrder()->first()?->id,
            "stars" => fake()->numberBetween(1,5),
            "comment" => fake()->word(5, true)
        ];
    }
}
