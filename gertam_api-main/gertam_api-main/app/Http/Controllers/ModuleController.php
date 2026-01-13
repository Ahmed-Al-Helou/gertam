<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoremoduleRequest;
use App\Http\Requests\UpdatemoduleRequest;
use App\Models\Brands;
use App\Models\module;
use App\Models\ModuleDate;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        return module::with("moduleDate")->orderBy('created_at', 'desc')->get();
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
       $module = module::create([
            "ar_name" => $request->ar_name,
            "en_name" => $request->en_name,
            "make_by" => $request->brand_id
        ]);
        

        return response()->json(['message' => 'module created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(module $module)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(module $module)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
{
    // جلب الموديل الحالي
    $module = Module::findOrFail($id);

    // تحديث بيانات الموديل
    $module->update([
        "ar_name" => $request->ar_name,
        "en_name" => $request->en_name,
        "make_by" => $request->brand_id
    ]);

    // تحديث ModuleDate المرتبطة أو إنشاء واحدة جديدة إذا لم تكن موجودة
    $moduleDate = ModuleDate::firstOrNew(['module_by' => $module->id]);
    $moduleDate->date_form = $request->date_from;
    $moduleDate->date_to = $request->date_to;
    $moduleDate->save();

    return response()->json(['message' => 'Module updated successfully'], 200);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(module $module, $id)
    {
        $module = module::findOrFail($id);
        $module->delete();
        return response()->json(['message' => 'Module deleted successfully'], 200);
    }
}
