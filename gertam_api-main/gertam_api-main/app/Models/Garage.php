<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Garage extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "car_name",
        "brand",
        "module",
        "date",
        "engaine",
        "image_url",
    ];
}
