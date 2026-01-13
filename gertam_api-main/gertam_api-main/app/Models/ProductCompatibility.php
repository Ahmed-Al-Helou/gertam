<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCompatibility extends Model
{
    use HasFactory;

    protected $fillable = [
             "product_detail_id",
            "brand_id",
            "model_id" ,
            "model_date_id" ,
            "engine_id",
    ];
    
     public function brands(){
        return $this->hasMany(brands::class);
    }

    public function model (){
        return $this->hasMany(module::class);
    }
    public function model_date (){
        return $this->hasMany(ModuleDate::class);
    }
    public function Enginee (){
        return $this->hasMany(Enginee::class);
    }

    public function ProductDetiles (){
        return $this->belongsTo(ProductDetail::class, "product_detail_id");
    }
}
