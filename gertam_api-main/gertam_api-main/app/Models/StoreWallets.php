<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreWallets extends Model
{
    use HasFactory;

    protected $fillable = [
        "store_id",
        "balance"
    ];
    public function store(){
        return $this->hasOne(Store::class);
    }

}
