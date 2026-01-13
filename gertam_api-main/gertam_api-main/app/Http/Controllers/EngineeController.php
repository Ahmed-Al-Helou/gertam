<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEngineeRequest;
use App\Http\Requests\UpdateEngineeRequest;
use App\Models\Enginee;
use Illuminate\Http\Request;

class EngineeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Enginee::orderBy('created_at', 'desc')->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
         $enginee = Enginee::create([
            "ar_name" => $request->ar_name,
            "en_name" => $request->en_name,
            "size" => "1.6L",
            "module_date_by" => $request->year_id
        ]);

        return response()->json($enginee, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Enginee $enginee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enginee $enginee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Enginee $enginee, $id)
    {
        //

        $engine = Enginee::findOrFail($id);

        if(!$engine){
            return response()->json(['message' => 'Engine not found'], 404);
        }

        $engine->update([
            "ar_name" => $request->ar_name,
            "en_name" => $request->en_name,
            "size" => $request->size ?? "1.6L",
            "module_date_by" => $request->year_id
        ]);

        return response()->json($engine, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enginee $enginee, $id)
    {
        $engine = Enginee::findOrFail($id);
        if(!$engine){
            return response()->json(['message' => 'Engine not found'], 404);
        }
        $engine->delete();
        return response()->json(['message' => 'Engine deleted successfully'], 200);
    }
}
