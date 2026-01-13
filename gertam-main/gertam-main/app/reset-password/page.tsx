'use client';
import {useTranslation} from "react-i18next";

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
    const params = useSearchParams();
    const token = params.get('token');
    const email = params.get('email');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');

    const {t} = useTranslation();
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token, email, password, password_confirmation: confirm }),
        });
        const data = await res.json();
        setMessage(data.message || data.error);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    {t("Set a new password")}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("New Password")}
                        </label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("Confirm password")}
                        </label>
                        <input
                            type="password"
                            placeholder="********"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
                    >
                        {t("Update password")}
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

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
