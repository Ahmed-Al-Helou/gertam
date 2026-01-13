"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
    id: number;
    product_id: number;
    user_id: number;
    quantity: number;
    price: number | string;
};

type CartContextType = {
    cart: CartItem[];
    loading: boolean;
    error: string | null;
    addToCart: (product_id: number, quantity?: number) => Promise<void>;
    updateQuantity: (product_id: number, quantity: number) => Promise<void>;
    removeItem: (cart_id: number) => Promise<void>;
    refetch: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/getCart`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const json = await res.json();
            setCart(Array.isArray(json) ? json : json.cart ?? []);
        } catch (err: any) {
            setError(err.message || "خطأ في جلب السلة");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Optimistic Add
    const addToCart = async (product_id: number, quantity = 1) => {
        const prevCart = [...cart];
        const existing = cart.find(item => item.product_id === product_id);
        if (existing) {
            setCart(cart.map(item => item.product_id === product_id ? { ...item, quantity: item.quantity + quantity } : item));
        } else {
            setCart([...cart, { id: Date.now(), product_id, user_id: 0, quantity, price: 0 }]); // مؤقتًا
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/addToCart`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ product_id, quantity }),
            });
            const json = await res.json();
            const normalized = Array.isArray(json) ? json : json.cart ?? [];
            setCart(normalized);
        } catch (err: any) {
            setError(err.message || "خطأ في إضافة المنتج");
            setCart(prevCart);
        }
    };

    const updateQuantity = async (product_id: number, quantity: number) => {
        const prevCart = [...cart];
        setCart(cart.map(item => item.product_id === product_id ? { ...item, quantity } : item));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/editCart`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ id: product_id, quantity }),
            });
            const json = await res.json();
            const normalized = Array.isArray(json) ? json : json.cart ?? [];
            setCart(normalized);
        } catch (err: any) {
            setError(err.message || "خطأ في تحديث الكمية");
            setCart(prevCart);
        }
    };

    const removeItem = async (cart_id: number) => {
        const prevCart = [...cart];
        setCart(cart.filter(item => item.id !== cart_id));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/deleteCart`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ id: cart_id }),
            });
            const json = await res.json();
            const normalized = Array.isArray(json) ? json : json.cart ?? [];
            setCart(normalized);
        } catch (err: any) {
            setError(err.message || "خطأ في حذف المنتج");
            setCart(prevCart);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, error, addToCart, updateQuantity, removeItem, refetch: fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCartContext must be used within CartProvider");
    return context;
};
