import { useEffect, useState } from "react";

type Product = {
    id: number;
    ar_name: string;
    en_name: string;
    ar_description: string;
    en_description: string;
    price: string;
    old_price: string;
    thumbnail: string;
};

type CartData = {
    id: number;
    product_id: number;
    user_id: number;
    quantity: number;
    price: string | number;
    product: Product;
};

export function useCart() {
    const [cartData, setCartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getCartData = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/getCart`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const json = await res.json();
            setCartData(Array.isArray(json) ? json : json.cart ?? []);
        } catch (err: any) {
            setError(err.message || "خطأ في جلب السلة");
        } finally {
            setLoading(false);
        }
    };

    // Optimistic Update
    const addToCart = async (product_id: number, quantity: number) => {

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/addToCart`,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ product_id: product_id, quantity: quantity }),
                }
            );
            if (!res.ok) throw new Error("فشل في تحديث الكمية");
            const json = await res.json();

            // إذا السيرفر رجع Array مختلف، حدث state
            const normalized = Array.isArray(json) ? json : json.cart ?? [];
            setCartData(normalized);
        } catch (err: any) {
            setError(err.message || "خطأ في تحديث الكمية");
            // إذا فشل الطلب، نرجع البيانات القديمة

        }
    };    const updateQuantity = async (product_id: number, quantity: number) => {
        // تحديث محلي سريع
        const previousData = [...cartData];
        setCartData((prev) =>
            prev.map((item) =>
                item.id === product_id ? { ...item, quantity } : item
            )
        );

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/editCart`,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ id: product_id, quantity }),
                }
            );
            if (!res.ok) throw new Error("فشل في تحديث الكمية");
            const json = await res.json();

            // إذا السيرفر رجع Array مختلف، حدث state
            const normalized = Array.isArray(json) ? json : json.cart ?? [];
            setCartData(normalized);
        } catch (err: any) {
            setError(err.message || "خطأ في تحديث الكمية");
            // إذا فشل الطلب، نرجع البيانات القديمة
            setCartData(previousData);
        }
    };

    const removeItem = async (cart_id: number) => {
        const previousData = [...cartData];
        setCartData((prev) => prev.filter((item) => item.id !== cart_id));

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/deleteCart`,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ id: cart_id }),
                }
            );
            if (!res.ok) throw new Error("فشل في حذف المنتج");
            const json = await res.json();
            const normalized = Array.isArray(json) ? json : json.cart ?? [];
            setCartData(normalized);
        } catch (err: any) {
            setError(err.message || "خطأ في حذف المنتج");
            setCartData(previousData); // استرجاع الحالة الأصلية إذا فشل
        }
    };

    useEffect(() => {
        getCartData();
    }, []);

    return {
        data: cartData,
        loading,
        error,
        updateQuantity,
        removeItem,
        addToCart,
        refetch: getCartData,
    };
}
