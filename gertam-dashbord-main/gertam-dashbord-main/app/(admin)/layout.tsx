'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {FullScreenLoader} from "@/components/FullScreenLoader";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/check-admin`, {
                    method: 'POST',
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });
                const data = await res.json();

                if (data.authenticated) {
                    setAuthenticated(true);

                } else {
                    router.replace('/Login'); // إعادة التوجيه للـ Login
                }
            } catch (err) {
                router.replace('/Login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) return <FullScreenLoader text={"جاري التحقق .."}/>;
    if (!authenticated) return null; // حتى تتم إعادة التوجيه

    return <>{children}</>;
}
