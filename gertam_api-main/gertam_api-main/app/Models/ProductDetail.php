<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDetail extends Model
{
    use HasFactory;

    protected $table = 'product_details'; // تأكد من هذا الاسم

    protected $fillable = [
        "ar_name",
        "en_name",
        "ar_description",
        "en_description",
        "price",
        "old_price",
        "store_id",
        "thumbnail",
        "categories_id",
        "supported_payment_methods",
    ];

    protected $casts = [
        'supported_payment_methods' => 'array',
    ];

    public function product (){
        return $this->hasMany(ProductCompatibility::class);
    }
    public function favorites (){
        return $this->hasMany(Favorite::class);
    }
    public function Categories (){
        return $this->belongsTo(Categories::class, "categories_id");
    }
    public function productUnits(){
        return $this->hasMany(product_units::class, "product_id");
    }
    public function reviews(){
        return $this->hasMany(Review::class, "product_id");
    }
    public function cart(){
        return $this->hasMany(Cart::class);
    }
    public function part_number(){
        return $this->hasMany(Alternative_parts::class, "product_id");
    }
    public function images(){
        return $this->hasMany(Product_images::class, "product_id");
    }

    public function orderItems(){
        return $this->hasMany(OrderItem::class, "product_id");
    }
    public function store(){
        return $this->belongsTo(Store::class);
    }

}
