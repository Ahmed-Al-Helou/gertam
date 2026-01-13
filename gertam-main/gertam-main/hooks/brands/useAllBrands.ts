import { useEffect, useState } from "react";

export function useAllBrands() {
    const [isLoading, setIsLoading] = useState(true); // يبدأ true
    const [error, setError] = useState("");
    const [data, setData] = useState<any[]>([]); // array مباشرة

    const getALlBrands = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/showAllBrands`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();
            setData(json);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getALlBrands()
    }, []);

    return { data, error, isLoading };
}
