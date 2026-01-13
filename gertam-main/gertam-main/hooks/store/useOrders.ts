import { useEffect, useState } from "react";

// Hook لجلب كل الطلبات
export function useAllOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/orders`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        setOrders(json);
      } catch (err: any) {
        setError(err.message || "حدث خطأ");
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, []);

  return { orders, isLoading, error };
}


export function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrderStatus = async ({ ordersIds, NewStatus }: { ordersIds: number[]; NewStatus: string }) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/ordersEdit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
  "Accept": "application/json",
  authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ ids:ordersIds, status:NewStatus }),
      });
      const json = await res.json();
      if (!json.ok) setError(json?.message || "فشل التحديث");
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return { updateOrderStatus, loading, error };
}
