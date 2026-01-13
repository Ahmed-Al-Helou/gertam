<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Models\Cart;
use App\Models\ProductDetail;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = auth()->id();

        $cart = Cart::where("user_id", $user_id)
        ->with("product")
        ->get();

        return $cart;
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
public function store(Request $request)
{
    $user_id = auth()->id();
    $product_id = $request->product_id;
    $quantity = $request->quantity ?? 1; // لو ما أرسلوا كمية، نعتبرها 1

    if (!$user_id || !$product_id) {
        return response()->json(["message" => "لا يوجد رقم منتج او معرف مستخدم"], 400);
    }

    // جلب المنتج للتأكد من السعر
    $product = ProductDetail::find($product_id);
    if (!$product) {
        return response()->json(["message" => "المنتج غير موجود"], 404);
    }

    // تحقق إذا المنتج موجود مسبقًا في السلة
    $cartItem = Cart::where("user_id", $user_id)
        ->where("product_id", $product_id)
        ->first();

    if ($cartItem) {
        // إذا موجود، نزيد الكمية فقط
        $cartItem->quantity += $quantity;
        $cartItem->save();
    } else {
        // إذا غير موجود، نضيفه للسلة
        Cart::create([
            "product_id" => $product_id,
            "user_id" => $user_id,
            "quantity" => $quantity,
            "price" => $product->price
        ]);
    }

    // جلب السلة الجديدة للمستخدم
    $newCart = Cart::where("user_id", $user_id)->get();

    return response()->json($newCart);
}


    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        $user_id = auth()->id();

        $id = $request->id;
        $quantity = $request->quantity;

        $cart = Cart::find($id);
        $cart->quantity = $quantity;
        $cart->save();

        $newCart = Cart::where("user_id", $user_id)->get();

        return $newCart;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCartRequest $request, Cart $cart)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $user_id = auth()->id();
        $id = $request->id;
        $cart = Cart::find($id);
        $cart->delete();

        $newCart = Cart::where("user_id", $user_id)->get();

        return $newCart;
    }
}
