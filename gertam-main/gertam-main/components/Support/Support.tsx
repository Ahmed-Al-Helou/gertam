import React, { useEffect, useRef, useState } from "react";
import { useSupport } from "@/hooks/Support/useSupport";
import { useUser } from "@/hooks/auth/useAuth";

export default function FloatingSupportChat({

                                                lang = "ar",
                                                storageKey = "floating_support_chat_messages",
                                            }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });
    const [text, setText] = useState("");
    const { Messages, loading, addNewMessage } = useSupport();
    const { userData: currentUser } = useUser();

    // نوع ref صحيح لـ textarea
    const inputRef = useRef<HTMLTextAreaElement>(null);



    useEffect(() => {
        setMessages(Array.isArray(Messages) ? Messages : []);
        localStorage.setItem(storageKey, JSON.stringify(Messages));
        if (open) setTimeout(() => inputRef.current?.focus(), 120);
    }, [open, JSON.stringify(Messages), storageKey]);

    const t = {
        en: {
            support: "Support",
            header: "Technical Support",
            placeholder: "Write a message...",
            send: "Send",
            empty: "No messages yet. Say hi.",
            close: "Close",
        },
        ar: {
            support: "الدعم",
            header: "الدعم الفني",
            placeholder: "اكتب رسالة...",
            send: "إرسال",
            empty: "لا توجد رسائل بعد. ابدأ الحديث.",
            close: "إغلاق",
        },
    }[lang ?? "en"];

    const handleSend = async () => {
        const body = text.trim();
        if (!body) return;

        const lastMsg = Messages[Messages.length - 1];
        const newMsg = {
            id: Date.now(),
            conversation_id: lastMsg?.conversation_id || 1,
            sender_id: currentUser?.id,
            message: body,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sender: {
                ...currentUser,
                role: "user",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        };

        setMessages((prev: any) => {
            const updated = [...prev, newMsg];
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
        });

        setText("");
        await addNewMessage(newMsg.conversation_id, body);
    };

    const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-50">
            {/* زر الدردشة */}
            <button
                aria-label={t?.support || "Support"}
                onClick={() => setOpen((v) => !v)}
                className="w-24 h-24 rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 hover:bg-indigo-700"
                title={t?.support || "الدعم الفني "}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.85L3 21l1.85-3.15A7.968 7.968 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
            </button>

            {open && (
                <div className="fixed inset-0 bg-wi/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div
                        className="w-[700px] h-[80vh] bg-gray-200 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-700"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-200">
                            <div>
                                <div className="text-xl font-semibold mb-5 text-gray-950">
                                    {t?.header}
                                </div>
                                <div className="text-sm text-gray-400 text-gray-700 m-5">
                                    {lang === "en" ? "Online" : "متصل"}
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-base px-3 text-gray-800 py-1 rounded hover:bg-gray-700"
                                aria-label={t?.close}
                            >
                                {t?.close}
                            </button>
                        </div>

                        <div className="p-5 flex-1 overflow-auto bg-gray-200" id="chatArea">
                            {messages.length === 0 ? (
                                <div className="text-base text-gray-400">{t?.empty}</div>
                            ) : (
                                messages.map((m:any) => {
                                    const isUser = m.sender_id === currentUser?.id;

                                    return (
                                        <div
                                            key={m.id}
                                            className={`mb-4 flex ${
                                                isUser ? "justify-end" : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`${
                                                    isUser
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-700 text-gray-100"
                                                } rounded-2xl px-5 py-3 max-w-[80%] text-50`}
                                            >
                                                <div>{m.message}</div>
                                                <div className="text-[12px] opacity-70 mt-1 text-right">
                                                    {m.created_at
                                                        ? new Date(m.created_at).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="px-5 py-4 border-t border-gray-200 bg-gray-300">
                            <div className="flex gap-3">
                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={t?.placeholder}
                    className="flex-1 resize-none h-20 rounded-xl border px-4 py-3 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                                <button
                                    onClick={handleSend}
                                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-base font-medium flex items-center justify-center disabled:opacity-50"
                                    disabled={!text.trim()}
                                >
                                    {t?.send}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
