import {useState, useEffect} from "react";

export type Product = {
    id: number,
    ar_name: string,
    en_name: string,
    ar_description: string,
    en_description: string,
    price: string,
    old_price: string,
    thumbnail:string

}
export const useGetProducts = (id: number) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>();

    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/getPorducts/${id}`);
                const json = await res.json();
                setProducts(json);
            }catch (error:any) {
                setError(error);
            }finally {
                setLoading(false);
            }
        }
        fetchProducts()
    }, [id])

    return {products, loading, error};
}