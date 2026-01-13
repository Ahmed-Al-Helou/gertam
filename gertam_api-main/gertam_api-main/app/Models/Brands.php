<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brands extends Model
{
    use HasFactory;

    // في موديل Brands
protected $fillable = ['ar_name', 'en_name', 'logo'];


    public function module(){
        return $this->hasMany(module::class);
    }
}
