<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    use HasFactory;

        protected $fillable = [
        "user_id",
        'full_name',
        'store_name',
        'email',
        'phone',
        'address',
        'id_number',
        'tax_number',
        'national_address',
        'commercial_registration',
        'pledge',
        'documents',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

}
