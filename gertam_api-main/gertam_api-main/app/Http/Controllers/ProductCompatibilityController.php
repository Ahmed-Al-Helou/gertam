<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductCompatibilityRequest;
use App\Http\Requests\UpdateProductCompatibilityRequest;
use App\Models\Brands;
use App\Models\Enginee;
use App\Models\Garage;
use App\Models\module;
use App\Models\ModuleDate;
use App\Models\ProductCompatibility;
use App\Models\ProductDetail;
use Illuminate\Http\Request;

class ProductCompatibilityController extends Controller
{

public function search(Request $request)
{
    $brandId = Brands::where('id', $request->brand)->value('id');
    $modelId = Module::where('id', $request->model)->value('id');

    // 🔹 جلب جميع السنوات المطابقة للفترة
    $yearIds = ModuleDate::where('date_form', '<=', $request->year)
                         ->where('date_to', '>=', $request->year)
                         ->pluck('id'); // تجيب كل المعرفات وليس واحد فقط

$productDetails = ProductCompatibility::with(['ProductDetiles.reviews'])
    ->when(!empty($brandId), fn($q) => $q->where('brand_id', $brandId))
    ->when(!empty($modelId), fn($q) => $q->where('model_id', $modelId))
    ->when(!empty($yearIds) && count($yearIds) > 0, fn($q) => $q->whereIn('model_date_id', $yearIds))
    ->get()
    ->pluck('ProductDetiles');


    return $productDetails;
}



    /**
     * Display a listing of the resource.
     */
public function checkCompatibilityForGarage($productId)
{
    $user = auth()->user();
    $cars = Garage::where('user_id', $user->id)->get();
    $product = ProductDetail::findOrFail($productId);

    $compatibleCars = [];

    foreach ($cars as $car) {
        // تحويل الأسماء إلى IDs مثل دالة search
        $brandId  = Brands::where('ar_name', $car->brand)->value('id');
        $modelId  = Module::where('ar_name', $car->model)->value('id');
        
        $yearId = null;
        if (!empty($car->year)) {
            $yearId = ModuleDate::where('date_form', '<=', (int)$car->year)
                                ->where('date_to', '>=', (int)$car->year)
                                ->value('id');
        }

        $engineId = Enginee::where('en_name', $car->engine)->value('id');

        $match = ProductCompatibility::query()
            ->when($brandId, fn($q) => $q->where('brand_id', $brandId))
            ->when($modelId, fn($q) => $q->where('model_id', $modelId))
            ->when($yearId, fn($q) => $q->where('model_date_id', $yearId))
            ->when($engineId, fn($q) => $q->where('engine_id', $engineId))
            ->where('product_detail_id', $product->id)
            ->exists();

        if ($match) {
            $compatibleCars[] = $car->car_name;
        }
    }

    return !empty($compatibleCars)
        ? response()->json([
            'message' => 'القطعة متوافقة مع سياراتك التالية',
            'cars' => $compatibleCars
        ])
        : response()->json([
            'message' => 'لم يتم التاكد من توافق القطعه'
        ]);
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
    public function store(StoreProductCompatibilityRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCompatibility $productCompatibility)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCompatibility $productCompatibility)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductCompatibilityRequest $request, ProductCompatibility $productCompatibility)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCompatibility $productCompatibility)
    {
        //
    }
}
