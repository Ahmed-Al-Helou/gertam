<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
    ];
    use HasFactory;
    public function users (){
        return $this->belongsTo(User::class);
    }
    public function product (){
        return $this->belongsTo(ProductDetail::class);
    }
}
