<?php

namespace Database\Factories;

use App\Models\ModuleDate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enginee>
 */
class EngineeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "ar_name" => fake()->word(3, true),
            "en_name" => fake()->word(3, true),
            "size" => fake()->randomFloat(1, 2, 8),
            "module_date_by" => ModuleDate::inRandomOrder()->first()?->id ?? ModuleDate::factory()
        ];
    }
}
