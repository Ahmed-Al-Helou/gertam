import { useEffect, useState } from "react";

// Hook لجلب كل الطلبات
export function useOverView() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/overViewData`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "حدث خطأ");
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, []);

  return { data, isLoading, error };
}

