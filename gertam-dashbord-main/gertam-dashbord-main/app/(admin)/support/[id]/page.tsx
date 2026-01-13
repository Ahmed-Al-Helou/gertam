"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";

interface User {
    id: number;
    name: string;
    avatar_url: string | null;
    role: string;
}

interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    message: string;
    created_at: string;
    sender: User;
}

interface Conversation {
    id: number;
    user_id: number;
    agent_id: number | null;
    status: "open" | "closed";
    created_at: string;
    updated_at: string;
    user: User;
    agent: User | null;
    messages: Message[];
}

interface ConversationPageProps {
    params: Promise<{ id: string }>;
}

export default function ConversationPage({ params }: ConversationPageProps) {
    const conversationParams = React.use(params);
    const conversationId = conversationParams.id;

    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    const currentUserId = conversation?.user.id;

    useEffect(() => {
        const fetchConversation = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/conversation/${conversationId}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` } }
                );
                const data: Conversation = await res.json();
                setConversation(data);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [conversationId]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversation) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/support/addMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ message: newMessage,conversation_id: conversation.id }),
                }
            );

            if (res.ok) {
                const savedMessage: Message = await res.json();
                setConversation({
                    ...conversation,
                    messages: [...conversation.messages, savedMessage],
                });
                setNewMessage("");
            }
        } catch (err) {
        }
    };

    if (loading) return <div className="p-4 text-center">جاري التحميل...</div>;
    if (!conversation) return <div className="p-4 text-center">لا توجد محادثة</div>;

    return (
        <div>
            <Navbar />
            <TooleBar />

            <div className="p-4 max-w-3xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">
                    المحادثة #{conversation.id} - الحالة:{" "}
                    <span className={conversation.status === "open" ? "text-green-600" : "text-red-600"}>
            {conversation.status === "open" ? "مفتوحة" : "مغلقة"}
          </span>
                </h2>

                {/* قائمة الرسائل */}
                <div className="flex flex-col gap-4 mb-30">
                    {conversation.messages.map((msg) => {
                        const isUser = msg.sender.role === "user";
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex items-end gap-2 max-w-[70%]`}>
                                    {!isUser && (
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {msg.sender.avatar_url && msg.sender.avatar_url !== "/no-image.jpeg" ? (
                                                <img
                                                    src={msg.sender.avatar_url}
                                                    alt={msg.sender.name}
                                                    className="w-10 h-10 object-cover rounded-full"
                                                />
                                            ) : (
                                                msg.sender.name[0]
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={`p-3 rounded-lg ${
                                            !isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        <div className="font-semibold mb-1">{msg.sender.name}</div>
                                        <div>{msg.message}</div>
                                        <div className="text-xs text-gray-400 mt-1 text-right">
                                            {new Date(msg.created_at).toLocaleString("ar-EG", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>

                                    {isUser && (
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {msg.sender.avatar_url && msg.sender.avatar_url !== "/no-image.jpeg" ? (
                                                <img
                                                    src={msg.sender.avatar_url}
                                                    alt={msg.sender.name}
                                                    className="w-10 h-10 object-cover rounded-full"
                                                />
                                            ) : (
                                                msg.sender.name[0]
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {conversation.messages.length === 0 && (
                        <div className="text-center text-gray-500">لا توجد رسائل</div>
                    )}
                </div>

                {/* صندوق إرسال الرسالة */}
                {conversation.status === "open" && (
                    <form
                        onSubmit={handleSendMessage}
                        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-3xl flex gap-2 items-center bg-white p-4 rounded-lg shadow-lg"
                    >
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="اكتب رسالتك هنا..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            إرسال
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
