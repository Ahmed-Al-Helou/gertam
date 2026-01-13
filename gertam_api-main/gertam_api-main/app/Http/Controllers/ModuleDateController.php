<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreModuleDateRequest;
use App\Http\Requests\UpdateModuleDateRequest;
use App\Models\ModuleDate;

class ModuleDateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        return ModuleDate::all();
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
    public function store(StoreModuleDateRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ModuleDate $moduleDate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ModuleDate $moduleDate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateModuleDateRequest $request, ModuleDate $moduleDate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ModuleDate $moduleDate)
    {
        //
    }
}
