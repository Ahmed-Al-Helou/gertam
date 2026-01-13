<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use SebastianBergmann\CodeCoverage\Report\Xml\Unit;

class product_units extends Model
{
    use HasFactory;
    protected $fillable = [
        "product_id",
        "unit_id",
        "stock",
        "price"
    ];

    public function products(){
        return $this->belongsTo(ProductDetail::class);
    }

    public function Unit(){
        return $this->belongsTo(Unit::class);
    }
}
