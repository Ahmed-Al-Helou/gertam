<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGarageRequest;
use App\Http\Requests\UpdateGarageRequest;
use App\Models\Garage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;



class GarageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $id = auth()->id();
        $cars = Garage::where('user_id', $id)->get();
        return response()->json($cars);
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
    try {
        $garage = Garage::create([
            "user_id"  => auth()->id(),
            "car_name" => $request->car_name,
            "brand"    => $request->brand,
            "module"   => $request->module,
            "date"     => $request->date,
            "engaine"  => $request->engaine,
            "image_url" => ""
        ]);

        if (!$garage) {
            return response()->json(['error' => 'فشل إنشاء السجل'], 500);
        }

        if ($request->hasFile('image_url')) {
            $path = $request->file('image_url')->store('garage_cars_image', 'public');
            $garage->image_url = asset('storage/' . $path);
        }

        if (!$garage->save()) {
            return response()->json(['error' => 'فشل حفظ البيانات'], 500);
        }

        return response()->json($garage, 201);

    } catch (\Exception $e) {
        return response()->json(['error' => 'حدث خطأ أثناء الحفظ', 'details' => $e->getMessage()], 500);
    }
}



    /**
     * Display the specified resource.
     */
    public function show(Garage $garage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Garage $garage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGarageRequest $request, Garage $garage)
    {
        if($garage->user_id !== auth()->id()){
            return response()->json(["message" => "وصول غير مصرح "]);
        }
            $garage->car_name = $request->car_name ?? $garage->car_name;
    $garage->brand    = $request->brand ?? $garage->brand;
    $garage->module   = $request->module ?? $garage->module;
    $garage->date     = $request->date ?? $garage->date;
    $garage->engaine  = $request->engaine ?? $garage->engaine;

    if ($request->hasFile('image_url')) {
        $path = $request->file('image_url')->store('garage_cars_image', 'public');
        $garage->image_url = asset('storage/' . $path);
    }

    $garage->save();

    return response()->json($garage, 200);    
}


public function destroy(Garage $garage)
{
    // التحقق أن السيارة تنتمي للمستخدم الحالي
    if ($garage->user_id !== auth()->id()) {
        return response()->json(['message' => 'غير مصرح لك بحذف هذه السيارة'], 403);
    }

    // حذف الصورة إذا موجودة (اختياري)
    if ($garage->image_url) {
        $imagePath = str_replace(asset('storage/'), '', $garage->image_url);
        if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
    }

    $garage->delete();

    return response()->json(['message' => 'تم حذف السيارة بنجاح'], 200);
}

}
