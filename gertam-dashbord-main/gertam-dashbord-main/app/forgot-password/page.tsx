'use client';
import { useState } from 'react';


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setMessage(data.message || data.error);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    استعادة كلمة المرور
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-base font-medium text-end  text-gray-700 mb-1">
                            البريد اللكتروني
                        </label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border mt-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-200 focus:outline-none"
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

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.includes('نجاح') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
