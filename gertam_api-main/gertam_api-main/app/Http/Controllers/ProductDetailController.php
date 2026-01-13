<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductDetailRequest;

use App\Models\Alternative_parts;
use App\Models\Brands;
use App\Models\ModuleDate;
use App\Models\Product_images;
use App\Models\product_units;
use App\Models\ProductCompatibility;
use App\Models\ProductDetail;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    // ProductController.php
    public function search(Request $request)
    {
        $query = $request->input('q'); 

        $results = ProductDetail::where('ar_name', 'LIKE', "%{$query}%")
                    ->orWhere('en_name', 'LIKE', "%{$query}%")
                    ->with("reviews")
                    ->withCount("reviews")
                    ->get();

        return response()->json($results);
    }
    public function searchCompany(Request $request)
{
    $query = $request->input('company'); 

    // الخطوة 1: البحث عن البراند حسب الاسم أو الـ ID
    $brand_ids = Brands::where('id', $query)
        ->orWhere('ar_name', 'LIKE', "%{$query}%")
        ->orWhere('en_name', 'LIKE', "%{$query}%")
        ->pluck('id'); // نأخذ فقط الـ IDs

    // الخطوة 2: جلب كل المنتجات التابعة لتلك البراندات من جدول ProductCompatibility
    $product_ids = ProductCompatibility::whereIn('brand_id', $brand_ids)
        ->pluck('product_detail_id');

    // الخطوة 3: جلب تفاصيل المنتجات
    $products = ProductDetail::whereIn('id', $product_ids)
        ->with('reviews')
        ->withCount('reviews')
        ->get();

    return response()->json($products);
}


    public function index($id)
    {
        return ProductDetail::find($id);
        
    }

public function allProducts(Request $request) {
    $search = $request->input('search');

    $query = ProductDetail::with(['Categories', 'productUnits']);

    if ($search) {
        $query->where('ar_name', 'like', "%{$search}%")
              ->orWhere('ar_description', 'like', "%{$search}%");
    }

    return $query->paginate(20);
}



    /**
     * Show the form for creating a new resource.
     */

public function create(Request $request)
{
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
        "supported_payment_methods" => "nullable|array",
        "supported_payment_methods.*" => "in:cod,directpay",
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

    // تحديد طرق الدفع المدعومة (افتراضياً: الدفع عند الاستلام)
    $supportedPaymentMethods = $request->supported_payment_methods ?? ["cod"];

    $product = ProductDetail::create([
        "ar_name"        => $request->arName,
        "en_name"        => $request->enName,
        "ar_description" => $request->arDescription,
        "en_description" => $request->enDescription,
        "price"          => $request->price,
        "old_price"      => $old_price,
        "thumbnail"      => "",
        "categories_id"  => $request->categories_id,
        "store_id"       => 1,
        "supported_payment_methods" => $supportedPaymentMethods,
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





    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductDetailRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */


public function show($id)
{
    try {
        $product = ProductDetail::with([
            'reviews',
            'productUnits.products', 
            'part_number',
            'images'
        ])
        ->withCount('reviews')
        ->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // تأكد من أن supported_payment_methods موجود وهو array
        if (!isset($product->supported_payment_methods) || !is_array($product->supported_payment_methods)) {
            $product->supported_payment_methods = ["cod"];
        }

        return response()->json($product);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error retrieving product',
            'error' => $e->getMessage()
        ], 500);
    }
}






    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductDetail $productDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
public function update(Request $request, $id)
{
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
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
{
    $product = ProductDetail::with('images')
    ->with("product")
    ->with("favorites")
    ->with("productUnits")
    ->with("reviews")
    ->with("cart")
    ->with("part_number")
    ->find($id);

    if (!$product) {
        return response()->json(['error' => 'المنتج غير موجود'], 404);
    }

    try {
        // 1- حذف الصور من التخزين وقاعدة البيانات
        foreach ($product->images as $img) {
            if (Storage::disk('public')->exists($img->image_url)) {
                Storage::disk('public')->delete($img->image_url);
            }
            $img->forceDelete();
        }

        // 2- حذف المنتج نفسه
        $product->forceDelete();

        return response()->json(['message' => 'تم حذف المنتج وكل ما يرتبط به بنجاح'], 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'فشل الحذف: ' . $e->getMessage()
        ], 500);
    }
}

public function deleteProductForStore($id)
{
    $user = auth()->user();
    if (!$user) {
        return response()->json(["message" => "هذا الحساب غير موجود"], 422);
    }

    $store = Store::where("user_id", $user->id)->first();
    if (!$store) {
        return response()->json(["message" => "لا يوجد متجر مرتبط بهذا المستخدم"], 422);
    }

    $product = ProductDetail::where("store_id", $store->id)
        ->with(['images', 'product', 'productUnits', 'reviews', 'part_number'])
        ->where("id", $id)
        ->first();

    if (!$product) {
        return response()->json(['error' => 'المنتج غير موجود أو لا يخص هذا المتجر'], 404);
    }

    try {
        // حذف الصور من التخزين وقاعدة البيانات
        foreach ($product->images as $img) {
            if (Storage::disk('public')->exists($img->image_url)) {
                Storage::disk('public')->delete($img->image_url);
            }
            $img->forceDelete();
        }

        // حذف المراجعات والمفضلة والسلة (اختياري حسب بنية النظام)
     

        // حذف المنتج نفسه
        $product->forceDelete();

        return response()->json(['message' => 'تم حذف المنتج وجميع البيانات المرتبطة به بنجاح'], 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'حدث خطأ أثناء الحذف: ' . $e->getMessage()
        ], 500);
    }
}

}
