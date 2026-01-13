<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConversationRequest;
use App\Http\Requests\UpdateConversationRequest;
use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        return Conversation::orderBy('created_at', 'desc')
            ->with(['user:id,name,avatar_url', 'agent:id,name,avatar_url'])
            ->get();
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
    public function store(Request $request)
    {
        //
        $conversation = Conversation::create([
            "user_id" => $request->user_id,
            "agent_id" => $request->agent_id ?? null,
        ]);
        return response()->json($conversation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Conversation::where('id', $id)
            ->with(['user:id,name,avatar_url,role', 'agent:id,name,avatar_url', 'messages.sender:id,name,avatar_url,role'])
            ->first();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Conversation $conversation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConversationRequest $request, Conversation $conversation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Conversation $conversation)
    {
        //
    }
}
