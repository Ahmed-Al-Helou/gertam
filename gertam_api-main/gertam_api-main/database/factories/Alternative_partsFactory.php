<?php

namespace Database\Factories;

use App\Models\ProductDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alternative_parts>
 */
class Alternative_partsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "product_id" => ProductDetail::inRandomOrder()->first()?->id,
            "company" => fake()->company(),
            "part_number" => fake()->phoneNumber()
        ];
    }
}
