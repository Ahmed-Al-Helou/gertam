<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class unit extends Model
{

    
    use HasFactory;

     public function productUnits(){
        return $this->hasMany(product_units::class);
    }
}
