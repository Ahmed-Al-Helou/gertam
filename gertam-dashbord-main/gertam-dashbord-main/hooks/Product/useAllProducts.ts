"use client";
import { useState, useEffect } from "react";
import UseIsAdmin from "../IsAdmin/useIsAdmin";
import { FullScreenLoader } from "@/components/FullScreenLoader";

interface Brand {
  id: number;
  ar_name: string;
  en_name: string;
}

interface Module {
  id: number;
  ar_name: string;
  en_name: string;
  make_by: number;
}

interface ModuleDate {
  id: number;
  date_form: string;
  date_to: string;
  module_by: number;
}

interface Engine {
  id: number;
  ar_name: string;
  en_name: string;
  module_date_by: number;
  size: string;
}

export type SelectdDataType = {
  brands: Brand[];
  module: Module[];
  ModuleDate: ModuleDate[];
  enginees: Engine[];
};

interface ProductCompatibility {
  brand_id: number;
  model_id: number;
  model_date_id: number;
  engine_id: number;
}

interface Images {
  product_id: number;
  image_url: string;
}

export type Product = {
  id: number;
  ar_name: string;
  en_name: string;
  ar_description: string;
  en_description: string;
  price: string;
  old_price: string;
  thumbnail: string;
  categories_id: number;
  categories: any;
  store_id: number;
  product_units: any[];
  alternative_parts: string[];
  Images: Images[];
  ProductCompatibility: ProductCompatibility;
};

type Units = {
  id: number;
  ar_name: string;
  en_name: string;
  name: string;
};

export const useProducts = (page: number, search: string = "") => {
  const [units, setUnits] = useState<Units[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const { authenticated, loading: authLoading } = UseIsAdmin();

  useEffect(() => {
    if (!authLoading && !authenticated) {
      location.href = "/Login";
    }
  }, [authLoading, authenticated]);

const getProducts = async (searchParam: string = search) => {
  const token = localStorage.getItem("token");
  try {
    const query = searchParam ? `&search=${encodeURIComponent(searchParam)}` : "";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/allProducts?page=${page}&limit=20${query}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    const total = data.total || 0;
    const perPage = data.per_page || 20;
    setTotalPages(Math.ceil(total / perPage));

    if (res.ok) setProducts(data.data);
    else throw new Error(data.message || "فشل جلب البيانات");
  } catch (err) {
    if (err instanceof Error) setError(err);
  } finally {
    setLoading(false);
  }
};


  const DeleteProduct = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/delete-product/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      }

      return false;
    } catch (err) {
      if (err instanceof Error) setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [page]); // ← إضافة search هنا

  return { products, loading, DeleteProduct, totalPages, error, getProducts };
};
