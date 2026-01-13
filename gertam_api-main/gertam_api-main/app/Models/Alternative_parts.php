<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alternative_parts extends Model
{
    use HasFactory;

    protected $fillable = [
        "product_id",
        "company",
        "part_number"
    ];

    public function porduct(){
        return $this->belongsTo(ProductDetail::class);
    }
}
