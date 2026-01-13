<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enginee extends Model
{
    use HasFactory;

    protected $fillable = [
        "ar_name",
        "en_name",
        "size",
        "module_date_by"
    ];
    public function moduleDate(){
        return $this->belongsTo(ModuleDate::class);
    }
}
