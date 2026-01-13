<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
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
            "name" => fake()->name(),
            "country" => fake()->country(),
            "email" => fake()->email(),
            "city" => fake()->city(),
            "orderNotes" => fake()->paragraph(),
            "phone" => fake()->phoneNumber(),
            "streetAddress" => fake()->streetAddress(),
            "totlePrice" => fake()->numberBetween(30, 1000),
            "totlePrice" => Store::inRandomOrder()->first()?->id,
        ];
    }
}
