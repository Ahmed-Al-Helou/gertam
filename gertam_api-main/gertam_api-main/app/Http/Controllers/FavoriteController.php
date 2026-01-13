<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFavoriteRequest;
use App\Http\Requests\UpdateFavoriteRequest;
use App\Models\Favorite;


class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    
    public function index()
{
    $user_id = auth()->id();

    // جلب المفضلات مع بيانات المنتج
    $favorites = Favorite::with('product')
        ->where('user_id', $user_id)
        ->get();

    // نرجع فقط بيانات المنتجات
    $products = $favorites->map(function ($fav) {
        return $fav->product;
    });

    return response()->json($products);
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
    public function store(StoreFavoriteRequest $request)
{
    $user_id = auth()->id();

    $favorite = Favorite::firstOrCreate([
        "user_id"   => $user_id,
        "product_id"=> $request->product_id,
    ]);

    return response()->json([
        "message"  => "success",
        "favorite" => $favorite
    ], 201);
}


    /**
     * Display the specified resource.
     */
    public function show(Favorite $favorite)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Favorite $favorite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFavoriteRequest $request, Favorite $favorite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($product_id)
{
    $user_id = auth()->id();

    $favorite = Favorite::where('user_id', $user_id)
                        ->where('product_id', $product_id)
                        ->first();

    if (!$favorite) {
        return response()->json([
            'message' => 'Favorite not found'
        ], 404);
    }

    $favorite->delete();

    return response()->json([
        'message' => 'Deleted successfully'
    ]);
}

}
