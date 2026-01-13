<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreBrandsRequest;
use App\Http\Requests\UpdateBrandsRequest;
use App\Models\Brands;
use Illuminate\Http\Request;

class BrandsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Brands::take(6)->get();

    
    }
    public function showAllBrands()
    {
        return Brands::orderBy('created_at', 'desc')->get();

    
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
        $barnd = Brands::create([
            'ar_name' => $request->ar_name,
            'en_name' => $request->en_name,
        ]);
        return response()->json(['message' => 'Brand created successfully', 'brand' => $barnd], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brands $brands)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brands $brands)
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
{
    // التحقق من وجود البراند
    $brand = Brands::findOrFail($id);

    // التحقق من البيانات المرسلة
    $request->validate([
        'ar_name' => 'required|string|max:255',
        'en_name' => 'required|string|max:255',
    ]);

    // تحديث الاسم
    $brand->ar_name = $request->ar_name;
    $brand->en_name = $request->en_name;



    // حفظ التعديلات
    $brand->save();

    return response()->json([
        'message' => 'تم تحديث الشركة بنجاح',
        'brand'   => $brand,
    ], 200);
}

    /**
     * Remove the specified resource from storage.
     */
public function destroy($id)
{
    $brand = Brands::findOrFail($id);
    $brand->delete();

    return response()->json(['message' => 'Brand and related data deleted successfully']);
}


}
