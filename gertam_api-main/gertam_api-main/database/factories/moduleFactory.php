<?php

namespace Database\Factories;

use App\Models\Brands;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\module>
 */
class ModuleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $models = ['Corolla', 'Camry', 'Civic', 'Accord', 'Sonata', 'Elantra', 'Mustang', 'Altima', 'Pajero', 'Optima'];
        return [
            'ar_name' => $this->faker->randomElement($models),
            'en_name' => $this->faker->randomElement($models),
            'make_by' => Brands::inRandomOrder()->first()->id ?? Brands::factory(),
        ];
    }
}
