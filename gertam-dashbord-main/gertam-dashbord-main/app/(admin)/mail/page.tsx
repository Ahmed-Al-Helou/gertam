"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import { FaUserCircle } from "react-icons/fa";
import "../../globals.css";

interface Sender {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
}

interface Ticket {
    id: number;
    conversation_id: number;
    user_id: number;
    message: string;
    created_at: string | null;
    status: string;
    user: Sender;
}

export default function MailPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/allTikets`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data: Ticket[] = await res.json();
                setTickets(
                    data.sort(
                        (a, b) =>
                            Number(new Date(b.created_at || "")) -
                            Number(new Date(a.created_at || ""))
                    )
                );
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    if (loading) return <div className="p-4 text-center">جاري التحميل...</div>;

    return (
        <>
            <Navbar />
            <TooleBar />
            <div className="p-4 m-10 mr-70 bg-[#f5f5f5] min-h-screen">
                <h2 className="text-lg font-semibold mb-4 text-slate-800">تذاكر الدعم الفني</h2>
                <div className="flex flex-col gap-3">
                    {tickets.length === 0 && (
                        <div className="text-center text-slate-500">لا توجد تذاكر</div>
                    )}
                    {tickets.map(ticket => (
                        <a
                            key={ticket.id}
                            href={`/support/${ticket.id}`}
                            className="flex items-center gap-4 p-3 bg-white rounded-xl cursor-pointer hover:bg-white transition"
                        >
                            {ticket.user.avatar_url  !== "/no-image.jpeg" ? (
                                <img
                                    src={ticket.user.avatar_url}
                                    alt={ticket.user.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                                />
                            ) : (
                                <FaUserCircle className="w-12 h-12 text-blue-400" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1 z-99">
                                    <h3 className="font-semibold text-slate-800 truncate">{ticket.user.name}</h3>
                                    <span className={`text-base font-medium ${ticket.status === "open" ? "text-green-600" : "text-red-600"}`}>
                                        {ticket.status === "open" ? "تذكرة مفتوحه" : "تذكرة مغلقه "}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm truncate">{ticket.message}</p>
                                {ticket.created_at && (
                                    <span className="text-xs text-slate-400">
                                        {new Date(ticket.created_at).toLocaleString("ar-EG", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}
