<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdvertisementsRequest;
use App\Http\Requests\UpdateAdvertisementsRequest;
use App\Models\Advertisements;

class AdvertisementsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $diamond_ad = Advertisements::find(1);

        return $diamond_ad;
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
    public function store(StoreAdvertisementsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Advertisements $advertisements)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Advertisements $advertisements)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdvertisementsRequest $request, Advertisements $advertisements)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Advertisements $advertisements)
    {
        //
    }
}
