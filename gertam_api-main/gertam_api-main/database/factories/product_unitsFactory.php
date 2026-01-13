<?php

namespace Database\Factories;

use App\Models\ProductDetail;
use App\Models\unit;
use Illuminate\Database\Eloquent\Factories\Factory;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\product_units>
 */
class product_unitsFactory extends Factory
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
            "unit_id" => unit::inRandomOrder()->first()?->id,
            "price" => fake()->numberBetween(10,500),
            "stock" => fake()->numberBetween(0,500)
        ];
    }
}
