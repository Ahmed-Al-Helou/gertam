"use client";
import { useState, useEffect } from "react";

export default function useLiveSearch(apiUrl: string, query: string) {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await fetch(`${apiUrl}?q=${query}`);
                const data = await res.json();
                setResults(data);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, apiUrl]);

    return { results, loading };
}
