"use client";
import { useState, useEffect } from "react";

interface DailyStat {
    today_count: number;
    yesterday_count: number;
    change_percent: number;
}

interface ChartData {
    name: string;
    uv: number;
    pv: number;
}

interface DailyStat {
    today_count: number;
    yesterday_count: number;
    change_percent: number;
}

interface DailyStatsType {
    confirmed: DailyStat;
    completed: DailyStat;
    canceled: DailyStat;
    hanging: DailyStat;
}

interface OrderData {
    id: number
    user_id: number
    name: string
    country: string
    email: string,
    city: string
    status: string,
    orderNotes: string[]
    phone: string
    streetAddress: string
    totlePrice: string
    created_at: string
    updated_at: string
}

interface ApiData {
    latest_orders: OrderData[];
    daily_stats: DailyStatsType;
    chart_data: ChartData[];
}

export const useOverviewData = (url: string) => {
    const [data, setData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token"); // إذا تستخدم auth
                const res = await fetch(url, {
                    headers: token
                        ? {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                        : { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message || "حدث خطأ أثناء جلب البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};
