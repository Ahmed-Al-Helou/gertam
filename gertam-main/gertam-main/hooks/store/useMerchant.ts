import { useEffect, useState } from "react";

export function useMerchant() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/merchant`,{
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const json = await response.json();
                setData(json);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, error, isLoading };
}

export function useMerchantById(id: string | number | null) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError("");
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/merchant/${id}`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const json = await response.json();
                setData(json);
            } catch (err: any) {
                setError(err.message || "Unknown error");
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return { data, error, isLoading };
}