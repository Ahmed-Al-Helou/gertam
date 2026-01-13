<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "logo",
        "store_picture",
        "user_id"
    ];
    public function advertisements(){
        return $this->hasMany(Advertisements::class);
    }
    public function orders(){
        return $this->hasMany(Order::class);
    }
    public function products(){
        return $this->hasMany(ProductDetail::class, "store_id");
    }

    public function storeWallet(){
        return $this->belongsTo(storeWallet::class);
    }
}
