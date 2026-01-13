
'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        setError('');

        // مثال للتحقق البسيط
        if (!email || !password) {
            setError('يرجى ملء جميع الحقول.');
            setLoading(false);
            return;
        }


        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                // نجاح تسجيل الدخول
                const data = await res.json();
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                setError('بيانات الدخول غير صحيحة.');
            }
        } catch (err) {
            setError('حدث خطأ أثناء تسجيل الدخول.');
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">تسجيل الدخول</h1>

                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-1">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading} 
                        className={`
                            w-full 
                            py-2 
                            rounded-lg 
                            text-white 
                            transition-colors 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                    >
                        {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
                    </button>

                </form>

                <p className="mt-4 text-center text-gray-500 text-sm">
                    نسيت كلمة المرور؟ <a href="/forgot-password" className="text-blue-600 hover:underline">استعادة</a>
                </p>
            </div>
        </div>
    );
}
