<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brands;
use App\Models\Enginee;
use App\Models\module;
use App\Models\ModuleDate;

class DataSearchController extends Controller
{
    public function index(){

        return response()->json([
            "brands" => Brands::all(),
            "module" => module::all(),
            "ModuleDate" => ModuleDate::all(),
            "enginees" => Enginee::all(),
        ]);
    }
}
