<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\CustomResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;


    public function favorites(){
        return $this->hasMany(Favorite::class);
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }
    public function orders(){
        return $this->hasMany(Order::class);
    }
    public function cart(){
        return $this->hasMany(Cart::class);
    }
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        "role",
        "country",
        "avatar",
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function sendPasswordResetNotification($token)
{
    $this->notify(new CustomResetPasswordNotification($token));
}

}
