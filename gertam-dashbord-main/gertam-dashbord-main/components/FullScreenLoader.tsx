"use client";
import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export function FullScreenLoader({ text = "جاري المعالجة..." }: { text?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white/90 dark:bg-slate-800/90 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4 w-[90%] max-w-sm">
                <LoadingSpinner size="xl" />
                <div className="text-sm text-slate-700 dark:text-slate-200">{text}</div>
            </div>
        </div>
    );
}