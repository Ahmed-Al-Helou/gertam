'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UseIsAdmin() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/check-admin`, {
                    method: 'POST',
                    headers:{Authorization: `Bearer ${localStorage.getItem('token')}`},
                });
                const data = await res.json();

                if (data.authenticated) {
                    setAuthenticated(true);

                } else {
                    router.replace('/Login'); // إعادة التوجيه إذا غير مسجّل
                }
            } catch (err) {
                router.replace('/Login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    return { loading, authenticated };
}
