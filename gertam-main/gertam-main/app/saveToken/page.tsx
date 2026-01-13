"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SaveToken() {
    const router = useRouter();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");
        if (token) {
            localStorage.setItem("token", token);
            router.push("/"); // أو أي صفحة تريد الانتقال إليها بعد تسجيل الدخول
        } else {
            router.push("/login"); // في حال لم يوجد توكن
        }
    }, [router]);

    return <p>جاري حفظ الجلسة...</p>;
}
