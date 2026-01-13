<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brands>
 */
class BrandsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $en_brands = ['Toyota', 'Nissan', 'Ford', 'BMW', 'Mercedes', 'Hyundai', 'Kia', 'Chevrolet', 'Honda', 'Mitsubishi'];
        return [
            "en_name" => $this->faker->randomElement($en_brands),
            "ar_name" => $this->faker->randomElement($en_brands),
        ];
    }
}
