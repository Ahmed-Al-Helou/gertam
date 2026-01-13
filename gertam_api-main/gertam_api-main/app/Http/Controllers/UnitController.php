<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreunitRequest;
use App\Http\Requests\UpdateunitRequest;
use App\Models\unit;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return unit::all();
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
    public function store(StoreunitRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(unit $unit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateunitRequest $request, unit $unit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(unit $unit)
    {
        //
    }
}
