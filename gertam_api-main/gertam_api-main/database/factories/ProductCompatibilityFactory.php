<?php

namespace Database\Factories;

use App\Models\Brands;
use App\Models\Enginee;
use App\Models\module;
use App\Models\ModuleDate;
use App\Models\ProductDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductCompatibility>
 */
class ProductCompatibilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "product_detail_id" => ProductDetail::inRandomOrder()->first()?->id,
            "brand_id" => Brands::inRandomOrder()->first()?->id,
            "model_id" => module::inRandomOrder()->first()?->id,
            "model_date_id" => ModuleDate::inRandomOrder()->first()?->id,
            "engine_id" => Enginee::inRandomOrder()->first()?->id,
        ];
    }
}
