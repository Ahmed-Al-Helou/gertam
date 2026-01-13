<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateMessageRequest;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $user = auth()->user();

    // آخر محادثة مفتوحة للمستخدم
    $conversation = Conversation::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->orWhere('agent_id', $user->id);
        })
        ->where('status', 'open')
        ->latest('id')
        ->first();

    if (!$conversation) {
        return response()->json([]); // مصفوفة فارغة إذا لا توجد محادثة
    }

    // جلب الرسائل فقط كمصفوفة جاهزة للعرض
    $messages = Message::where('conversation_id', $conversation->id)
        ->with('sender:id,name,avatar_url,role') // اختصر بيانات المرسل للواجهة فقط
        ->orderBy('id', 'asc')
        ->get();

    return response()->json($messages); // الآن الواجهة الأمامية تستقبل مصفوفة مباشرة
}



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
   public function addMessage(Request $request)
{
    $user = auth()->user();
    $body = $request->input('message');

    if (!$body) {
        return response()->json(['error' => 'الرسالة فارغة'], 422);
    }

    // ابحث عن آخر محادثة مفتوحة للمستخدم
    $conversation = Conversation::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->orWhere('agent_id', $user->id);
        })
        ->where('status', 'open')
        ->latest('id')
        ->first();

    // إذا لم توجد محادثة مفتوحة، أنشئ واحدة جديدة
    if (!$conversation) {
        $conversation = Conversation::create([
            'user_id' => $user->id,
            'agent_id' => null, // أو تحدد وكيل حسب الحاجة
            'status' => 'open',
        ]);
    }

    // أضف الرسالة
    $message = Message::create([
        'conversation_id' => $conversation->id,
        'sender_id' => $user->id,
        'message' => $body,
    ]);

    // أرجع الرسالة الجديدة فقط
    return response()->json($message->load('sender:id,name,avatar_url'));
}

 public function supportAddMessage(Request $request)
{
    $agent = auth()->user();
    $body = $request->input('message');
    $conversationId = $request->input('conversation_id');

    if (!$body || !$conversationId) {
        return response()->json(['error' => 'الرسالة أو معرف المحادثة فارغ'], 422);
    }

    // تحقق من وجود المحادثة
    $conversation = Conversation::find($conversationId);
    if (!$conversation) {
        return response()->json(['error' => 'المحادثة غير موجودة'], 404);
    }

    // تحديث المحادثة
    $conversation->update([
        'agent_id' => $agent->id,
        'status' => 'open',
    ]);

    // أضف الرسالة
    $message = Message::create([
        'conversation_id' => $conversation->id,
        'sender_id' => $agent->id,
        'message' => $body,
    ]);

    // أرجع الرسالة الجديدة فقط مع بيانات المرسل
    return response()->json($message->load('sender:id,name,avatar_url'));
}



    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        return Message::orderBy('created_at', 'desc')
        ->with('sender')
        ->get();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMessageRequest $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        //
    }
}
