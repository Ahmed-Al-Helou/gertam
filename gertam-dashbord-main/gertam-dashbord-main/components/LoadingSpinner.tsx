"use client";
import React from "react";

type Size = "sm" | "md" | "lg" | "xl";

export function LoadingSpinner({ size = "md", label }: { size?: Size; label?: string }) {
    const sizes: Record<Size, string> = {
        sm: "w-5 h-5 border-2",
        md: "w-8 h-8 border-2",
        lg: "w-12 h-12 border-4",
        xl: "w-16 h-16 border-4",
    };

    return (
        <div className="flex items-center gap-3">
            <svg
                role="status"
                className={`${sizes[size]} text-blue-600 border-t-transparent border-gray-200 rounded-full animate-spin`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label={label ?? "جاري التحميل"}
            >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>

            {label && <span className="text-sm text-slate-600">{label}</span>}
        </div>
    );
}