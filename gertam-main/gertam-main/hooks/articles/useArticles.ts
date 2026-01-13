import {useState, useEffect} from 'react';

export type articlesData = {
    id: number;
    title: string;
    subTitle: string;
    image_url: string;
    content: string;
}

export const usegetThereArticles = () => {
    const [data, setData] = useState<articlesData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/articles`);
                const json = await res.json();
                setData(json);

            } catch (error:any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, []);
    return {data, error, loading};
}

export const useGetArticleById = (id:number) => {
    const [data, setData] = useState<articlesData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/articles/${id}`);
                const json = await res.json();
                setData(json);

            } catch (error:any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, []);
    return {data, error, loading};
}

