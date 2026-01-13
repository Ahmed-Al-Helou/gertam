<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductDetail;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Cart;
use App\Models\StoreWallets;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user_id = auth()->id();
        if (!$user_id) {
            return response()->json(["message" => "يجب تسجيل الدخول قبل إتمام الشراء"], 401);
        }
    
        $requiredFields = ['city', 'country', 'email', 'name', 'phone', 'streetAddress'];
        foreach ($requiredFields as $field) {
            if (!$request->filled($field)) {
                return response()->json([
                    "message" => "الحقل {$field} مطلوب"
                ], 422);
            }
        }
    
        $cart = [];

        if ($request->has('cart') && is_array($request->cart)) {
            $cart = $request->cart;
        } elseif ($request->has('product_id')) {
            // طلب مباشر
            $cart[] = [
                "product_id" => $request->product_id,
                "quantity" => $request->quantity ?? 1
            ];
        } else {
            return response()->json(["message" => "لم يتم تحديد أي منتج"], 400);
        }
        
        $total_price = 0;
        $order_items = [];
        
        foreach ($cart as $item) {
            $product = ProductDetail::find($item['product_id']);
            if (!$product) {
                return response()->json([
                    "message" => "المنتج غير موجود: " . $item['product_id']
                ], 404);
            }
        
            $quantity = max(1, (int)($item['quantity'] ?? 1)); // ضمان الكمية
            $product_total = $product->price * $quantity;
            $total_price += $product_total;
        
            $order_items[] = [
                "product_id" => $product->id,
                "quantity" => $quantity,
                "price" => $product->price,
                "total" => $product_total
            ];
        
            \Log::debug('order_item added', [
                'product_id' => $product->id,
                'quantity' => $quantity,
                'total' => $product_total
            ]);
        }
        
        \Log::debug('order_items', $order_items);

    
        DB::beginTransaction();
        try {
            $order = Order::create([
                "user_id" => $user_id,
                "name" => $request->name,
                "country" => $request->country,
                "email" => $request->email,
                "city" => $request->city,
                "orderNotes" => $request->orderNotes,
                "phone" => $request->phone,
                "streetAddress" => $request->streetAddress,
                "totlePrice" => $total_price
            ]);
    
            foreach ($order_items as $item) {
                $product = ProductDetail::find($item['product_id']);
                $store_id = $product->store_id;
            
                OrderItem::create([
                    "order_id" => $order->id,
                    "product_id" => $item['product_id'],
                    "quantity" => $item['quantity'],
                    "price" => $item['price'],
                    "total" => $item['total']
                ]);
            
                // تحديث المحفظة بطريقة آمنة (increment). إذا لم توجد محفظة ننشئها.
                $affected = DB::table('store_wallets')
                    ->where('store_id', $store_id)
                    ->increment('balance', $item['total']);
            
                if ($affected === 0) {
                    // لم توجد صفوف لتحديث، ننشئ صفاً جديداً ثم نزيد الرصيد (atomic-ish)
                    DB::table('store_wallets')->insert([
                        'store_id' => $store_id,
                        'balance' => $item['total'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                \Log::debug('wallet after update', [
                    'store_id' => $store_id,
                    'wallet' => DB::table('store_wallets')->where('store_id', $store_id)->first(),
                ]);
            
                // حذف المنتج من السلة (إن وجد)
                Cart::where("user_id", $user_id)
                    ->where("product_id", $item['product_id'])
                    ->delete();
            }
    
            DB::commit();
    
            return response()->json([
                "message" => "تم حفظ الطلب وتوزيع الأرباح بنجاح",
                "order_id" => $order->id
            ], 200);
    
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                "message" => "حدث خطأ أثناء حفظ الطلب",
                "error" => $e->getMessage()
            ], 500);
        }
    }
    



    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
    'name' => 'required|string',
    'email' => 'required|email',
    'phone' => 'required|string',
    'country' => 'required|string',
    'city' => 'required|string',
    'streetAddress' => 'required|string',
    'totlePrice' => 'required|numeric',
]);

        $order = Order::create([
        "user_id" => $request->user_id ?? 1,
        "name" => $request->name,
        "country" => $request->country ,
        "email" => $request->email,
        "city" => $request->city,
        "orderNotes" => $request->orderNotes, // اختياري
        "phone" => $request->phone,
        "status" => $request->status ?? "قيد التنفيذ",
        "streetAddress" => $request->streetAddress,
        "totlePrice" => $request->totlePrice
        ]);

        return response()->json(["message" => "تم حفظ الطلب بنجاح", "order_id" => $order->id], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        //
    }


    public function userOrdesrDetails()
    {
        $user_id = auth()->id();
        if (!$user_id) {
            return response()->json([
                "message" => "يجب تسجيل الدخول لعرض الطلبات"
            ], 401);
        }
        $orders = Order::with("orderItem")->where("user_id", $user_id)->orderBy("created_at", "desc")->get();
        return response()->json($orders, 200);
    }

    /**
     * Display the specified resource.
     */

    public function show(Order $order, $id)
    {
        $order = Order::with("orderItem")->findOrFail($id);
        return response()->json($order, 200);
        
    }
    public function allOrders()
    {
        return Order::with("orderItem")->orderBy("created_at", "desc")->take(100)->get();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order, $id)
    {
        //

        $order = Order::findOrFail($id);

        $order->update([
        "user_id" => $request->user_id ?? 1,
        "name" => $request->name,
        "country" => $request->country ,
        "email" => $request->email,
        "city" => $request->city,
        "orderNotes" => $request->orderNotes, // اختياري
        "phone" => $request->phone,
        "status" => $request->status ?? "قيد التنفيذ",
        "streetAddress" => $request->streetAddress,
        "totlePrice" => $request->totlePrice
        ]);

        return response()->json(["message" => "تم تحديث الطلب بنجاح", "order_id" => $order->id], 200);
    }

public function editOrdersForStore(Request $request)
{
    // 1. التحقق من البيانات
    $data = $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:orders,id', // كل id لازم يكون موجود في جدول الطلبات
        'status' => 'required|string|in:قيد التنفيذ,مكتمل,ملغي',
    ]);

    $user = auth()->user();
    if(!$user){
        return response()->json(["message" => "لا يوجد مستخدم مسجل"]);
    }

    $store = Store::where("user_id", $user->id)->first();
    if(!$store){
        return response()->json(["message" => "لا يوجد متجر لهذا المستخدم"]);
    }

    // 2. التحديث الجماعي فقط للطلبات التابعة للمتجر
    Order::whereIn('id', $data['ids'])
        ->where('store_id', $store->id) // هذا يضمن التعديل للمتجر الحالي فقط
        ->update(['status' => $data['status']]);

    return response()->json([
        'message' => 'تم تحديث حالة الطلبات بنجاح',
        'updated_ids' => $data['ids'],
        'status' => $data['status'],
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order, $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(["message" => "تم حذف الطلب بنجاح", "order_id" => $order->id], 200);
    }
}
