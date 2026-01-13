<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
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
            "name" => fake()->name(),
            "logo" => "https://picsum.photos/seed/{$seed}/800/600",
            "store_picture" => "https://picsum.photos/seed/{$seed}/800/600",
            "user_id" => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
