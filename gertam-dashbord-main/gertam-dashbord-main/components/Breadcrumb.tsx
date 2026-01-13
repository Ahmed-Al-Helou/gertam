// components/Breadcrumb.tsx
"use client"
import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
    label: string;
    href?: string; // لو فيه رابط نقدر نضغط عليه
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="text-gray-500 text-sm mb-6">
            {items.map((item, index) => (
                <span key={index}>
                    {item.href ? (
                        <Link href={item.href} className="hover:text-blue-600">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-semibold text-gray-800">{item.label}</span>
                    )}
                    {index < items.length - 1 && <span className="mx-2">›</span>}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;
