import { useEffect, useState } from "react";

export type Messages = {
    id: number;
    conversation_id: string | number;
    sender_id: number | string;
    message: string;
};

export function useSupport() {
    const [Messages, setMessages] = useState<Messages[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/messages`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const json = await res.json();
            setMessages(json);

        } catch (err: any) {
            setError(err.message || "خطأ في جلب السلة");
        } finally {
            setLoading(false);
        }
    };

    // Optimistic Update
    const addNewMessage = async (conversation_id: string | number, message: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/createMessage`,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ conversation_id, message }),
                }
            );
            if (!res.ok) throw new Error("فشل في إرسال الرسالة");
            const json = await res.json();
            setMessages((prev) => [...prev, json]);
        } catch (err: any) {
            setError(err.message || "خطأ في إرسال الرسالة");
        }
    };


    useEffect(() => {
        getMessages();
    }, []);

    return {Messages, loading, addNewMessage}


}
