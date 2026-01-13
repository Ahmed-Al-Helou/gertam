<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShopRequest;
use App\Http\Requests\UpdateShopRequest;
use App\Models\Advertisements;
use App\Models\Brands;
use App\Models\Categories;
use App\Models\ProductDetail;
use App\Models\Shop;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ad = Advertisements::where("type", "diamond")->first();
        $brands = Brands::all();
        $categories = Categories::all();
        $sectionAd = Advertisements::where("type", "gold")->first();

        $products = ProductDetail::where("categories_id", 1)->take(25)->get();
        $categorie = Categories::find(1);

        $slider = [
        "title" => $categorie->name,
        "description" => $categorie->description,
        "cardsData" => $products
        ];

        return response()->json([
            "ad" => $ad,
            "brands" => $brands,
            "categories" => $categories,
            "sectionAd" => $sectionAd,
            "slider" => $slider
        ]);
    }


public function allSections() {
    $categories = Categories::with(['ad'])->get(); // جلب الإعلان فقط هنا

    $result = $categories->map(function($categorie) {
        // المنتجات الأساسية: أول 25 منتج
        $cardsData = $categorie->products()
            ->with("reviews")
            ->withCount("reviews")
            ->take(25)
            ->get();

     
        $extraProducts = $categorie->products()
            ->with("reviews")
            ->withCount("reviews")
            ->skip(1)
            ->take(10)
            ->get();

        $adPhoto = $categorie->ad();

        $diamond_ad = Advertisements::where("type", "diamond")->first();

        return [
            "diamond_ad" => $diamond_ad,
            "title" => $categorie->name,
            "description" => $categorie->description,
            "ad_photo" => $categorie->ad_imae_url,
            "cardsData" => $cardsData,
            "extraProducts" => $extraProducts,
            "categorie_id" => $categorie->id
            
        ];
    });

    return response()->json($result);
}



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShopRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Shop $shop)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shop $shop)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShopRequest $request, Shop $shop)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shop $shop)
    {
        //
    }
}
