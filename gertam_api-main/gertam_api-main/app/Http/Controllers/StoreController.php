<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Alternative_parts;
use App\Models\ModuleDate;
use App\Models\Order;
use App\Models\Product_images;
use App\Models\product_units;
use App\Models\ProductCompatibility;
use App\Models\ProductDetail;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        

        $products = ProductDetail::where("store_id", $id)
        ->with("reviews")
        ->withCount("reviews")
        ->get();

        return $products;


    }

    public function getStoreInfo(){
        $user = auth()->user();
        $store = Store::where("user_id", $user->id)->first();
        if(!$store){
            return response()->json(['message' => 'المتجر غير موجود للمستخدم الحالي '], 404);
        }
        return $store;
    }

    public function getStoreOrders(){
        $user = auth()->user();
        $store = Store::where("user_id", $user->id)->first();
        if(!$store){
            return response()->json(['message' => 'المتجر غير موجود للمستخدم الحالي '], 404);
        }
        $orders = $store->orders()->get();
        return $orders;
    }

    public function getOrderByIdForStore($id){
        $user = auth()->user();
        if(!$user){
            return response()->json(["message" => "لا يوجد مستخدم مسجل "]);
        }
        $store = Store::where("user_id", $user->id)->first();
        if(!$store){
            return response()->json(["message" => "لا يوجد متجر لهذا المستخدم "]);
        }
        $orders = $store->orders()->where("id", $id)->with("orderItem.product")->first();
        if(!$orders){
            return response()->json(["message" => "لا يوجد طلبات مسجله "]);
        }
        return $orders;
    }

    public function getStoreById($id){

        return Store::find($id);
    }


    public function showAll(){
        return Store::all();
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
        //

        $user_id = $request->user_id;
        $user = User::find($user_id);
        if(!$user){
            return response()->json(['message' => 'لا يوجد مستخدم بهذا المعرف '], 404);
        }

        $store = Store::create([
            "name" => $request->name,
            "logo" => "",
            "store_picture" => "",
            "user_id" => $request->user_id
        ]);

        if ($request->hasFile("logo")) {
            $path = $request->file("logo")->store("store_logos", "public");
            $fullUrl = asset("storage/" . $path);
            $store->logo = $fullUrl;
            $store->save();
        }
        if ($request->hasFile("store_picture")) {
            $path = $request->file("store_picture")->store("store_pictures", "public");
            $fullUrl = asset("storage/" . $path);
            $store->store_picture = $fullUrl;
            $store->save();
        }

        return response()->json(['store' => $store], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store, $id)
    {
        //
        $store = Store::findOrFail($id);
        if(!$store){
            return response()->json(['message' => 'المتجر غير موجود '], 404);
        }

        $store->update([
            "name" => $request->name,
            "logo" => $store->logo ?? "",
            "store_picture" => $store->store_picture ?? "",
            "user_id" => $request->user_id
        ]);

        if ($request->hasFile("logo")) {
            $path = $request->file("logo")->store("store_logos", "public");
            $fullUrl = asset("storage/" . $path);
            $store->logo = $fullUrl;
            $store->save();
        }
        if ($request->hasFile("store_picture")) {
            $path = $request->file("store_picture")->store("store_pictures", "public");
            $fullUrl = asset("storage/" . $path);
            $store->store_picture = $fullUrl;
            $store->save();
        }

        return response()->json(['store' => $store], 200);
    }

        public function updateStoreForWoner(Request $request, Store $store)
    {
        $user = auth()->user();
        $store = Store::where("user_id", $user->id)->first();
        if(!$store){
            return response()->json(['message' => 'المتجر غير موجود للمستخدم الحالي '], 404);
        }
        

        $store->update([
            "name" => $request->name,
            "logo" => $store->logo ?? "",
            "store_picture" => $store->store_picture ?? "",
            "user_id" => $user->id
        ]);

        if ($request->hasFile("logo")) {
            $path = $request->file("logo")->store("store_logos", "public");
            $fullUrl = asset("storage/" . $path);
            $store->logo = $fullUrl;
            $store->save();
        }
        if ($request->hasFile("store_picture")) {
            $path = $request->file("store_picture")->store("store_pictures", "public");
            $fullUrl = asset("storage/" . $path);
            $store->store_picture = $fullUrl;
            $store->save();
        }

        return response()->json(['store' => $store], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store, $id)
    {
        $store = Store::findOrFail($id);
        if(!$store){
            return response()->json(['message' => 'المتجر غير موجود '], 404);
        }
        $store->delete();
        return response()->json(['sucsess' => 'Store deleted successfully'], 200);
    }


    // store owener controller
    public function addProduct(Request $request)
    {

        $user = auth()->user();
        $store = Store::where("user_id", $user->id)->first();

        if(!$store){
            return response()->json([
                "error" => "المتجر غير موجود للمستخدم الحالي."
            ], 404);
        }

    $validator = Validator::make($request->all(), [
        "arName"        => "required|string|max:255",
        "enName"        => "required|string|max:255",
        "arDescription" => "required|string",
        "enDescription" => "required|string",
        "price"         => "required|numeric|min:1",
        "old_price"     => "nullable|numeric",
        "categories_id" => "required|exists:categories,id",
        "Images"        => "required",
        "Images.*"      => "image|mimes:jpg,jpeg,png|max:2048",
        "compatibilities" => "nullable|array",
        "compatibilities.*.brand_id" => "required_with:compatibilities|numeric",
        "compatibilities.*.model_id" => "nullable|numeric",
        "compatibilities.*.year_from" => "nullable|numeric",
        "compatibilities.*.year_to" => "nullable|numeric",
    ], [
        "arName.required"        => "الاسم بالعربية مطلوب.",
        "enName.required"        => "الاسم بالإنجليزية مطلوب.",
        "arDescription.required" => "الوصف بالعربية مطلوب.",
        "enDescription.required" => "الوصف بالإنجليزية مطلوب.",
        "price.required"         => "يجب إدخال السعر.",
        "price.numeric"          => "السعر يجب أن يكون رقمًا.",
        "price.min"              => "السعر يجب أن يكون أكبر من صفر.",
        "old_price.numeric"      => "السعر القديم يجب أن يكون رقمًا.",
        "categories_id.required" => "يجب اختيار القسم.",
        "categories_id.exists"   => "القسم غير موجود.",
        "Images.required"        => "يجب رفع صورة واحدة على الأقل.",
        "Images.*.image"         => "كل ملف يجب أن يكون صورة.",
        "Images.*.mimes"         => "الصورة يجب أن تكون بصيغة jpg أو jpeg أو png.",
        "Images.*.max"           => "حجم الصورة يجب ألا يتجاوز 2MB.",
        "compatibilities.required" => "يجب إدخال التوافقات.",
    ]);

    if ($validator->fails()) {
        return response()->json([
            "error" => $validator->errors()->first()
        ], 422);
    }

    $old_price = $request->old_price && $request->old_price >= $request->price 
        ? $request->old_price 
        : 0;

    $product = ProductDetail::create([
        "ar_name"        => $request->arName,
        "en_name"        => $request->enName,
        "ar_description" => $request->arDescription,
        "en_description" => $request->enDescription,
        "price"          => $request->price,
        "old_price"      => $old_price,
        "thumbnail"      => "",
        "categories_id"  => $request->categories_id,
        "store_id"       => $store->id,
    ]);

    // تخزين التوافقات
    if ($request->has("compatibilities") && !empty($request->compatibilities)) {
        foreach ($request->compatibilities as $c) {

            // Only process dates if both year_from and year_to are provided
            if (!empty($c['year_from']) && !empty($c['year_to']) && !empty($c['model_id'])) {
                $modelDate = ModuleDate::where('module_by', $c['model_id'])
                            ->where('date_form', "<=", $c['year_from'])
                            ->where('date_to', ">=", $c['year_to'])
                            ->first();

                // إذا لم يوجد، أنشئ سجل جديد
                if (!$modelDate) {
                    $modelDate = ModuleDate::create([
                        'date_form' => $c['year_from'],
                        'date_to'   => $c['year_to'],
                        'module_by' => $c['model_id'],
                    ]);
                }
                $modelDateId = $modelDate->id;
            } else {
                $modelDateId = null;
            }

            // ثم أنشئ الـ compatibility
            ProductCompatibility::create([
                'product_detail_id' => $product->id,
                'brand_id'          => $c['brand_id'],
                'model_id'          => $c['model_id'] ?? null,
                'model_date_id'     => $modelDateId,
                'engine_id'         => $c['engine_id'] ?? null,
            ]);
        }
    }

    // تخزين الصور
    if ($request->hasFile("Images")) {
        $first = true;
        foreach ($request->file("Images") as $image) {
            $path = $image->store("products_images", "public");
            $fullUrl = asset("storage/" . $path);
            if ($first) {
                $product->thumbnail = $fullUrl;
                $product->save();
                $first = false;
            }

            Product_images::create([
                "product_id" => $product->id,
                "image_url"  => $fullUrl,
            ]);
        }
    }

    // تخزين الأجزاء البديلة
    if ($request->alternative_parts) {
        $pairs = explode("|", $request->alternative_parts);
        foreach ($pairs as $pair) {
            $pair = trim($pair);
            if (!$pair) continue;

            [$company, $numbers] = array_pad(explode(":", $pair, 2), 2, null);

            if ($company && $numbers) {
                foreach (explode(",", $numbers) as $num) {
                    Alternative_parts::create([
                        "product_id"  => $product->id,
                        "company"     => trim($company),
                        "part_number" => trim($num)
                    ]);
                }
            }
        }
    }

    // تخزين الوحدة والكمية
    product_units::create([
        "product_id" => $product->id,
        "unit_id"    => $request->unit_id,
        "stock"      => $request->stock,
        "price"      => $product->price
    ]);

    return response()->json(["message" => "تم إنشاء المنتج بنجاح."]);
}

public function editProduct(Request $request, $id)
{

    $user = auth()->user();
    $store = Store::where("user_id", $user->id)->first();
    if(!$store){
        return response()->json([
            "error" => "المتجر غير موجود للمستخدم الحالي."
        ], 404);
    }
    $products = ProductDetail::where("store_id", $store->id)
        ->where("id", $id)
        ->first();
    if (!$products) {
        return response()->json([
            "error" => "المنتج غير موجود في متجرك."
        ], 404);
    }
    $validator = Validator::make($request->all(), [
        "arName"        => "required|string|max:255",
        "enName"        => "required|string|max:255", 
        "arDescription" => "required|string",
        "enDescription" => "required|string",
        "price"         => "required|numeric|min:1",
        "old_price"     => "nullable|numeric",
        "categories_id" => "required|exists:categories,id",
        "Images.*"      => "image|mimes:jpg,jpeg,png|max:2048",
        "compatibilities" => "nullable|array",
        "compatibilities.*.brand_id" => "required_with:compatibilities|numeric",
        "compatibilities.*.model_id" => "nullable|numeric",
        "compatibilities.*.year_from" => "nullable|numeric",
        "compatibilities.*.year_to" => "nullable|numeric",
    ], [
        "arName.required"        => "الاسم بالعربية مطلوب.",
        "enName.required"        => "الاسم بالإنجليزية مطلوب.",
        "arDescription.required" => "الوصف بالعربية مطلوب.",
        "enDescription.required" => "الوصف بالإنجليزية مطلوب.",
        "price.required"         => "يجب إدخال السعر.",
        "price.numeric"          => "السعر يجب أن يكون رقمًا.",
        "price.min"             => "السعر يجب أن يكون أكبر من صفر.",
        "old_price.numeric"      => "السعر القديم يجب أن يكون رقمًا.",
        "categories_id.required" => "يجب اختيار القسم.",
        "categories_id.exists"   => "القسم غير موجود.",
        "compatibilities.required" => "يجب إدخال التوافقات.",
    ]);

    if ($validator->fails()) {
        return response()->json([
            "error" => $validator->errors()->first()
        ], 422);
    }

    $product = ProductDetail::findOrFail($id);

    $old_price = $request->old_price && $request->old_price >= $request->price 
        ? $request->old_price 
        : 0;

    $product->update([
        "ar_name"        => $request->arName,
        "en_name"        => $request->enName,
        "ar_description" => $request->arDescription,
        "en_description" => $request->enDescription,
        "price"          => $request->price,
        "old_price"      => $old_price,
        "categories_id"  => $request->categories_id,
    ]);

    // Update compatibilities
    ProductCompatibility::where('product_detail_id', $product->id)->delete();
    if ($request->has("compatibilities") && !empty($request->compatibilities)) {
        foreach ($request->compatibilities as $c) {
            $modelDate = ModuleDate::where('module_by', $c['model_id'])
                        ->where('date_form', "<=", $c['year_from'])
                        ->where('date_to', ">=",  $c['year_to'])
                        ->first();

            if (!$modelDate) {
                $modelDate = ModuleDate::create([
                    'date_form' => $c['year_from'],
                    'date_to'   => $c['year_to'],
                    'module_by' => $c['model_id'],
                ]);
            }

            ProductCompatibility::create([
                'product_detail_id' => $product->id,
                'brand_id'          => $c['brand_id'],
                'model_id'          => $c['model_id'] ?? null,
                'model_date_id'     => $modelDate->id,
                'engine_id'         => $c['engine_id'] ?? null,
            ]);
        }
    }


if ($request->has('deletedImages')) {
    foreach ($request->deletedImages as $imageId) {
        $image = Product_images::find($imageId);
        if ($image) {
            // نحذف الملف من التخزين أولاً
            $relativePath = str_replace(asset('storage/') . '/', '', $image->image_url);
            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }

            // نتحقق إن كانت الصورة المحذوفة هي الصورة المصغرة في جدول products
            $mainProduct = ProductDetail::find($image->product_id);
            if ($mainProduct && $mainProduct->thumbnail === $image->image_url) {
                // نجيب صورة بديلة من الصور المتبقية (أول صورة متوفرة)
                $newImage = Product_images::where('product_id', $mainProduct->id)
                    ->where('id', '!=', $image->id)
                    ->first();

                // نحدث الصورة المصغّرة أو نضع null إذا ماكو بديلة
                $mainProduct->thumbnail = $newImage ? $newImage->image_url : "/no-image.jpeg";
                $mainProduct->save();
            }

            // نحذف السجل من قاعدة البيانات
            $image->delete();
        }
    }
}



    // Update images
    if ($request->hasFile("Images")) {
        foreach ($request->file("Images") as $image) {
            $path = $image->store("products_images", "public");
            $fullUrl = asset("storage/" . $path);
            
            Product_images::create([
                "product_id" => $product->id,
                "image_url"  => $fullUrl,
            ]);
        }
    }

    // Update alternative parts
    Alternative_parts::where("product_id", $product->id)->delete();
    if ($request->alternative_parts) {
        $pairs = explode("|", $request->alternative_parts);
        foreach ($pairs as $pair) {
            $pair = trim($pair);
            if (!$pair) continue;

            [$company, $numbers] = array_pad(explode(":", $pair, 2), 2, null);

            if ($company && $numbers) {
                foreach (explode(",", $numbers) as $num) {
                    Alternative_parts::create([
                        "product_id"  => $product->id,
                        "company"     => trim($company),
                        "part_number" => trim($num)
                    ]);
                }
            }
        }
    }

    // Update product units
    product_units::where("product_id", $product->id)->delete();
    product_units::create([
        "product_id" => $product->id,
        "unit_id"    => $request->unit_id,
        "stock"      => $request->stock,
        "price"      => $product->price
    ]);

    return response()->json(["message" => "تم تعديل المنتج بنجاح."]);
}

public function getProducts(){
    $user = auth()->user();
    if(!$user){
        return response()->json(["message" => "لا يوجد مستخدم حالي"], 422);
    }
    $store = Store::where("user_id", $user->id)->first();
    if(!$store){
        return response()->json(["message"=> "لا يوجد متجر للمستخدم الحالي "], 422);
    }
    $products = $store->products()->get();

    return $products;
}

public function storePrevew(){
    $store = Store::where("user_id", auth()->id())->first();
    if(!$store){
        return response()->json(["message" => "لا يوجد متجر لهذا المستخدم "]);
    }

    $totle = $store->orders()->sum("totlePrice");
    $profits = $totle - ($totle * 0.2);
        $ordersCount = $store->orders()->count();
    $lastOrders = $store->orders()
    ->latest()       // ترتيب حسب created_at تنازلي (أحدث أولاً)
    ->take(5)       // عدد الطلبات
    ->get();
    $ordersCountByStatus = $store->orders()
    ->select('status', DB::raw('count(*) as total'))
    ->groupBy('status')
    ->pluck('total', 'status')
    ->mapWithKeys(function ($count, $status) {
        $statusMap = [
            'قيد التنفيذ' => 'processing',
            'مكتمل' => 'completed',
            'ملغي' => 'canceled',
        ];
        $key = $statusMap[$status] ?? $status;
        return [$key => $count];
    });

    return response()->json([
        "totle" => $totle,
        "profits" => $profits,
        "ordersCountByStatus" => $ordersCountByStatus,
        "lastOrders" => $lastOrders,
        "ordersCount" => $ordersCount
    ]);
}
}
