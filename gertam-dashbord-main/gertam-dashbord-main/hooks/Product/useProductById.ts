import {useEffect, useState} from "react";
import {ParamValue} from "next/dist/server/request/params";

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
    ar_name : string;
    en_name : string;
    ar_description : string;
    en_description : string;
    price : string;
    old_price : string;
    thumbnail: string;
    categories_id: number;
    store_id: number;
    alternative_parts: string[];
    images: Images[];
    ProductCompatibility: ProductCompatibility;
    brand_id: number;
    model_id: number;
    engine_id: number;
    model_date_id: number;
    part_number: string[] | number[];
    product_units: any[];

}

type Units = {
    id: number;
    ar_name: string;
    en_name: string;
    name: string;
}

export const useProductById = (id: ParamValue) => {
    const [loading, setLoading] = useState(true);
    const [ProductByIdData, setProductByIdData] = useState<any>();
    const [error, setError] = useState<unknown>();

    const fetchProductById = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/product/${id}`);
            if (!res.ok) {
                throw new Error("Failed to fetch product");
            }
            const json = await res.json();
            setProductByIdData(json);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductById(id as string);
    }, [id]);

    return { ProductByIdData, error, loading };
};
