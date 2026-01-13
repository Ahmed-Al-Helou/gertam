"use client";

import React, { useEffect, useState } from "react";

export default function OneTimeAdPopup({
                                           imageSrc = "/PremiumAd.png",
                                           title = "اضف سيارة الى الجراج",
                                           ctaText = "اذهب الى الجراج",
                                           daysToHide = 365,
                                           localStorageKey = "oneTimeAdSeen"}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(localStorageKey);
            if (!raw) {
                setShow(true);
                return;
            }
            const seenAt = Number(raw);
            if (Number.isNaN(seenAt)) {
                setShow(true);
                return;
            }
            const msPassed = Date.now() - seenAt;
            const msToHide = daysToHide * 24 * 60 * 60 * 1000;
            if (msPassed > msToHide) {
                setShow(true);
            }
        } catch (e) {
            setShow(true);
        }
    }, [daysToHide, localStorageKey]);

    const closeAndRemember = () => {
        try {
            localStorage.setItem(localStorageKey, String(Date.now()));
        } catch (e) {}
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={closeAndRemember} aria-hidden />

            <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 ease-out hover:scale-[1.02]">
                <div className="bg-black/70 backdrop-blur-lg border border-white/10 p-0 rounded-3xl">
                    <div className="w-full h-96 sm:h-[28rem] relative">
                        <img src={imageSrc} alt="إعلان" className="w-full h-full object-cover" draggable={false} />
                        <div className="absolute left-6 top-6 bg-black/70 backdrop-blur-md px-5 py-3 rounded-md text-blue-400 text-2xl font-bold shadow-md">
                            {title}
                        </div>

                        {/* زر اغلاق أكبر في الأعلى على جهة اليمين */}
                        <button
                            onClick={closeAndRemember}
                            aria-label="اغلاق الإعلان"
                            className="absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition text-3xl shadow-lg"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <p className="text-blue-300 text-3xl font-bold drop-shadow-lg">{title}</p>
                            <p className="text-blue-200 text-xl mt-3 drop-shadow-md">احصل على افضل القطع المتوافقه مع سيارتك</p>
                        </div>

                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <a
                                href="/garage"
                                onClick={(e) => {
                                    e.preventDefault();
                                    closeAndRemember();
                                }}
                                className="inline-block rounded-xl px-6 py-3 font-semibold text-lg text-black bg-blue-400 shadow-lg hover:scale-[1.03] transition-transform"
                            >
                                {ctaText}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 w-60 h-12 rounded-full bg-gradient-to-r from-transparent via-black/30 to-transparent blur-3xl opacity-70" />
            </div>
        </div>
    );
}