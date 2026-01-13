import {useState, useEffect} from 'react';



// get all Categories for the navbar
export type SectionsData = {
    id: number;
    name: string;
    ad_image_url: string;
}

export const useGetAllCategories = () => {
    const [data, setData] = useState<SectionsData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/allcategoire`);
                const json = await res.json();
                setData(json);
            }catch (err:any) {
                setError(err);
            }finally {
                setLoading(false);
            }

        }
        fetchData();
    }, []);
    return {data, error, loading};
}

export type CategorieData = {
    id: number,
    name: string
    ad_imae_url: string
}
export const useGetCategorieById = (id:number) => {

    const [data, setData] = useState<CategorieData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () =>{
            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/getCategorieById/${id}`);
                const json = await res.json();
                setData(json[0]);
            }catch (err:any) {
                setError(err)
            }finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    return {data, error, loading};
}