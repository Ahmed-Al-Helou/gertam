import { useEffect, useState } from "react";

export function useSlider(id: number) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState<any>(null);

    const getSliderData = async () => {
        setIsLoading(true); // هنا يبدأ اللودينغ بس عند وجود id
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/section/${id}`
            );
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
        getSliderData();
    }, [id]);

    return { data, error, isLoading };
}
