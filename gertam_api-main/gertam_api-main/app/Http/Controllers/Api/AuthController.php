<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{

public function register(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required|string|min:6|unique:users,phone',
        'password' => 'required|string|min:6|confirmed', // يستحسن تضيف حقل password_confirmation
    ]);

    try {
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'phone'    => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'status'  => true,
            'message' => 'User registered successfully',
            'data'    => [
                'user'  => $user,
                'token' => $token,
            ]
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'status'  => false,
            'message' => 'Registration failed',
            'error'   => $e->getMessage(),
        ], 500);
    }
}


    // تسجيل دخول
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'بيانات تسجيل الدخول غير صحيحة'], 401);
        }

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    // تسجيل خروج
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'تم تسجيل الخروج']);
    }

public function edit(Request $request)
{
    $user = $request->user();

    $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'phone' => 'sometimes|string|min:6',
        'country' => 'sometimes|string',
        'password' => 'sometimes|string|min:6|confirmed',
        'image' => 'sometimes|file|image|max:2048',
    ]);

    if ($request->has('name')) $user->name = $request->name;
    if ($request->has('email')) $user->email = $request->email;
    if ($request->has('phone')) $user->phone = $request->phone;
    if ($request->has('country')) $user->country = $request->country;
    if ($request->has('password')) $user->password = Hash::make($request->password);

    // رفع الصورة وتخزين الرابط
    if ($request->hasFile('avatar_url')) {
        $path = $request->file('avatar_url')->store('avatars', 'public');
        $fullurl = $request->getSchemeAndHttpHost();
        $user->avatar_url = $fullurl .'/storage/' . $path;
    }

    $user->save();

    return response()->json([
        'message' => 'تم تحديث الحساب بنجاح',
        'user' => $user
    ]);
}



public function adminLogin(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'بيانات تسجيل الدخول غير صحيحة'], 401);
    }

    // تأكد أن المستخدم لديه دور إداري
    if (!$user->role === 'admin') {
        return response()->json(['message' => 'ليس لديك صلاحيات للدخول إلى لوحة التحكم'], 403);
    }

    $token = $user->createToken('api_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
}

public function checkAdmin(Request $request)
{


    $user = auth()->user();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // تأكد أن المستخدم لديه دور إداري
    if (!$user->role === 'admin') {
        return response()->json(['message' => 'ليس لديك صلاحيات للدخول إلى لوحة التحكم'], 403);
    }

    return response()->json([
        'user' => $user,
        "authenticated" => true
    ]);
}
public function dashboardLogin(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'بيانات تسجيل الدخول غير صحيحة'], 401);
    }

    // تأكد أن المستخدم لديه دور إداري
    if (!$user->role === 'admin') {
        return response()->json(['message' => 'ليس لديك صلاحيات للدخول إلى لوحة التحكم'], 403);
    }

    $token = $user->createToken('api_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
}



public function createAdminAcount(Request $request)
{
    // إنشاء الفالديشن اليدوي حتى نتحكم في الردود
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'role' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required|string|min:6|unique:users,phone',
        'password' => 'required|string|min:6|confirmed', // لازم يكون عندك password_confirmation
    ]);

    // إذا فشل الفالديشن نرجع الأخطاء بالتفصيل
    if ($validator->fails()) {
        return response()->json([
            'status'  => false,
            'message' => 'Validation failed',
            'errors'  => $validator->errors(),
        ], 422);
    }

    try {
        $validated = $validator->validated();

        $role = $validated['role'] ?? 'user'; // إذا لم يوجد دور استخدم user

        $user = User::create([
            'name'     => $validated['name'],
            'role'     => $role,
            'email'    => $validated['email'],
            'phone'    => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'status'  => true,
            'message' => 'User registered successfully',
            'data'    => [
                'user'  => $user,
                'token' => $token,
            ]
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'status'  => false,
            'message' => 'Registration failed',
            'error'   => $e->getMessage(),
        ], 500);
    }
}


public function editAdminAccount(Request $request, $id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $request->validate([
        'name' => 'sometimes|string|max:255',
        'role' => 'sometimes|string|max:255',
        'email' => 'sometimes|email',
        'phone' => 'sometimes|string|min:6',
        'country' => 'sometimes|string',
        'password' => 'sometimes|string|min:6|confirmed',
        'avatar_url' => 'sometimes|file|image|max:2048',
    ]);

    if ($request->filled('name')) $user->name = $request->name;
    if ($request->filled('role')) $user->role = $request->role;
    if ($request->filled('phone')) $user->phone = $request->phone;
    if ($request->filled('country')) $user->country = $request->country;
    if ($request->filled('password')) $user->password = Hash::make($request->password);

    // تحديث البريد فقط إذا تغيّر فعلاً
    if ($request->filled('email') && $request->email !== $user->email) {
        $request->validate([
            'email' => 'email|unique:users,email',
        ]);
        $user->email = $request->email;
    }

    // رفع الصورة وتخزين الرابط
    if ($request->hasFile('avatar_url')) {
        $path = $request->file('avatar_url')->store('avatars', 'public');
        $user->avatar_url = asset('storage/' . $path);
    }

    $user->save();

    return response()->json([
        'message' => 'تم تحديث الحساب بنجاح',
        'user' => $user
    ]);
}

public function getAllAdmins()
{
    $admins = User::where('role', "!=", 'user')
    ->orWhere('role', "!=", 'merchant')
    ->get();
    return response()->json($admins);


}

public function deleteAdmin($id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    if ($user->role === 'user') {
        return response()->json(['message' => 'Cannot delete a regular user'], 403);
    }

    $user->delete();
    return response()->json(['message' => 'Admin user deleted successfully']);
}

// store woner coltoller 

public function checkStoreWoner(Request $request)
{


    $user = auth()->user();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // تأكد أن المستخدم لديه دور إداري
    if ($user->role === 'store_owner') {
        return response()->json([
        'user' => $user,
        "authenticated" => true
    ]);
    }else{
                return response()->json(['message' => 'ليس لديك صلاحيات للدخول إلى لوحة التحكم'], 403);
    }

    
}
}