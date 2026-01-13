<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    public function User(){
        return $this->belongsTo(User::class);
    }
    public function productDitiles(){
        return $this->belongsTo(ProductDetail::class);
    }
}
