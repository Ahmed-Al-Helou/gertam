<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use App\Models\ProductDetail;


class SliderController extends Controller
{
    //
    public function index(){
       $products = ProductDetail::take(25)
       ->get();
        return [
            "title" => "افضل المنتجات ",
            "description" => " اكثر المنتجات مبيعا هذا الشهر",
            "cardsData" => $products
        ];
    }
public function slider($id){
    // تحقق من وجود الـ category، إذا لم يوجد استبدل بـ 1
    $categorie = Categories::find($id) ?? Categories::find(1);

    $products = ProductDetail::where("categories_id", $categorie->id)
        ->take(25)
        ->with("reviews")
        ->withCount("reviews")
        ->get();

    return [
        "title" => $categorie->name,
        "description" => $categorie->description,
        "cardsData" => $products,
        "categorie_id" => $categorie->id
    ];
}

}
