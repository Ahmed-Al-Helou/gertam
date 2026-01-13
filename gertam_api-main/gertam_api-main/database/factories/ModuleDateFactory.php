<?php

namespace Database\Factories;

use App\Models\module;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ModuleDate>
 */
class ModuleDateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "date_form" => fake()->numberBetween(1935, 2015),
            "date_to" => fake()->numberBetween(2015, 2025),
            "module_by" => module::inRandomOrder()->first()?->id ?? module::factory()
        ];
    }
}
