<?php

use App\Models\Advertisements;
use App\Models\Alternative_parts;
use App\Models\Articles;
use App\Models\Brands;
use App\Models\Categories;
use App\Models\Category;
use App\Models\Enginee;
use App\Models\module;
use App\Models\ModuleDate;
use App\Models\Order;
use App\Models\Product_images;
use App\Models\product_units;
use App\Models\ProductCompatibility;
use App\Models\ProductDetail;
use App\Models\Review;
use App\Models\Store;
use App\Models\unit;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->count(20)->create();
        Store::factory()->count(10)->create();
        unit::factory()->count(10)
            ->create();
        Categories::factory()
            ->count(5)
            ->create()
            ->each(function($category){
                ProductDetail::factory()
                    ->count(20)
                    ->for($category)
                    ->create()
                    ->each(function($product){
                        Product_images::factory()
                        ->count(3)
                        ->create([
                            'product_id' => $product->id
                        ]);
                        Review::factory()
                        ->count(3)
                        ->create([
                            'product_id' => $product->id
                        ]);
                        product_units::factory()
                        ->count(3)
                        ->create([
                            'product_id' => $product->id
                        ]);
                    });
                    
            });
            Brands::factory()->count(10)->create()
            ->each(function(){
                module::factory()
                ->count(5)
                ->create()
                ->each(function($modle_by){
                    ModuleDate::factory()
                    ->count(1)
                    ->create([
                        "module_by" => $modle_by
                    ])
                    ->each(function(){
                        Enginee::factory()
                        ->count(2)
                        ->create()
                        ->each(function(){
                            ProductCompatibility::factory()->count(1)->create();
                        });
                    })
                    ->each(function(){
                        Alternative_parts::factory()
                        ->count(2)
                        ->create();
                        
                    });
                });
            });
            Order::factory()->count(100)->create();
            Advertisements::factory()->count(10)->create();
            Articles::factory()->count(10)->create();
            
            
            
    }
}
