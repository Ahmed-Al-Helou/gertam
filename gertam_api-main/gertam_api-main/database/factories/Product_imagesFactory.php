<?php

namespace Database\Factories;

use App\Models\ProductDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product_images>
 */
class Product_imagesFactory extends Factory
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
            "product_id" => \App\Models\ProductDetail::inRandomOrder()->first()?->id ?? ProductDetail::factory(),
            "image_url" => "https://picsum.photos/seed/{$seed}/800/600",
        ];
    }
}
