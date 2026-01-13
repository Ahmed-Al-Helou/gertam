import { useEffect, useState } from "react";

export function useStoreProducts(id:number) {
    const [isLoading, setIsLoading] = useState(true); // يبدأ true
    const [error, setError] = useState("");
    const [data, setData] = useState<any[]>([]); // array مباشرة

    const StoreProducts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/${id}`);
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
        StoreProducts()
    }, []);

    return { data, error, isLoading };
}


export function useAllProduct(){
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    
    const getAllProducts = async ()=>{
        try{
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/products`, {
                headers:{
                authorization: `Bearer ${token || ""}`,
                }
            });
           const data = await res.json();
           if(!res.ok){
            setError(data.message);
           }
           setProducts(data)
        }catch(error){
    }finally{
        setLoading(false)
    }
    }

    useEffect(()=>{
        getAllProducts();
    },[]);

    return {loading, products, error}
}