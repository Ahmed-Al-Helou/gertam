import {useState, useEffect} from "react";
import {error} from "next/dist/build/output/log";

interface brand {
    id: number;
    ar_name : string;
    en_name : string;
}

interface module {
    id: number;
    ar_name : string;
    en_name : string;
    make_by: number
}
interface ModuleDate {
    id: number;
    date_form : string;
    date_to : string;
    module_by: number
}
interface enginees {
    id: number;
    ar_name : string;
    en_name : string;
    module_date_by: number
    size: string
}


export type SelectdDataType = {
    brands: brand[];
    module: module[];
    ModuleDate: ModuleDate[];
    enginees: enginees[];
}


interface  ProductCompatibility{
    brand_id: number;
    model_id: number;
    model_date_id: number;
    engine_id: number;
}

interface Images{
    product_id: number;
    image_url: string
}



export type Product = {
    arName : string;
    enName : string;
    arDescription : string;
    enDescription : string;
    price : string;
    old_price : string;
    thumbnail: string;
    categories_id: number;
    store_id: number;
    alternative_parts: string[];
    Images: Images[];
    ProductCompatibility: ProductCompatibility;

}

type Units = {
    id: number;
    ar_name: string;
    en_name: string;
    name: string;
}

export const useProduct = () => {
    const [selectedData, setSelectedData] = useState<SelectdDataType>();
    const [units, setUnits] = useState<Units[]>([]);
    const [loading, setLoading] = useState(true);
    const [ProductByIdData, setProductByIdData] = useState<Product>();
    const [error, setError] = useState<Error>();
    const getSelectData = async () =>{
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/searchData`);
            const json = await  res.json()
            setSelectedData(json);
        }catch (error: unknown) {
            throw error;
        }finally {
            setLoading(false);
        }
    }

    const getUints = async () => {
      const token = localStorage.getItem("token");

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/unit`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer ${token}`,
                }});

            const data = await res.json();

            if (res.ok) setUnits(data);
            else throw error;

        }catch (error: unknown) {
            throw error;
        }finally {
            setLoading(false);
        }
    }




    useEffect(() => {
        getSelectData();
        getUints();
    }, []);

    return {selectedData, getSelectData, units};

}