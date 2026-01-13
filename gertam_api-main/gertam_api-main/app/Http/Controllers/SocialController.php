<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function callback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();

            $email = $socialUser->getEmail();
            $name = $socialUser->getName() ?? $socialUser->getNickname();
            $avatar = $socialUser->getAvatar();
            $phone = $socialUser->user['phone'] ?? null;

            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'avatar_url' => $avatar,
                    'phone' => $phone ?? '0000000000',
                    'password' => Hash::make(uniqid()), // كلمة مرور عشوائية
                ]
            );

            $token = $user->createToken('api_token')->plainTextToken;

            return redirect("https://www.gertam.sa/saveToken?token=$token");
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ أثناء تسجيل الدخول.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
