<?php

namespace Database\Factories;

use App\Models\Categories;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use League\CommonMark\Extension\CommonMark\Node\Inline\Strong;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Advertisements>
 */
class AdvertisementsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {        
        $seed = $this->faker->unique()->numberBetween(1, 100000);

        $type = ["diamond", "gold", "silver"];

        return [
            "image_url" => "https://picsum.photos/seed/{$seed}/800/600",
            "type" => fake()->randomElement($type),
            "posation" => fake()->numberBetween(1,10),
            "store_id" => Store::inRandomOrder()->first()?->id,
            "categorie_id" => Categories::inRandomOrder()->first()?->id
        ];
    }
}
