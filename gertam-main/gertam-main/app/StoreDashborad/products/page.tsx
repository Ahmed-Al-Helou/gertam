"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import Sidebar from "@/components/slidebar/slidebar";
import { useAllProduct } from "@/hooks/store/useStoreProducts";
import Link from "next/link";

export default function ProductsPage() {
  const { products, loading, error } = useAllProduct();


  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try{
        const token = localStorage.getItem("token")
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/productDelete/${id}`, {
          method: "POST",
          headers:{
                authorization: `Bearer ${token || ""}`,
                }
        });
        const data = await res.json();
        if(res.ok){
          location.reload()
        }else{
        }
      }catch(err){
      }
    }
  };

  return (
    <Sidebar>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">المنتجات</h1>

<div className="flex flex-wrap gap-4 sm:gap-6 justify-start">
  {products.map((product) => (
    <div
      key={product.id}
      className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 w-[calc(50%-8px)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
    >
      <img
        src={product.thumbnail ?? "/no-image.jpeg"}
        alt={product.ar_name}
        className="w-full h-44 object-cover rounded-t-xl"
      />

      <div className="p-4 flex flex-col justify-between ">
        <div>
          <h2 className="text-base font-bold mb-1 text-gray-800">
            {product.ar_name}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.ar_description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-full text-sm border border-indigo-200">
            {Number(product.price).toFixed(2)} $
          </span>

          <div className="flex gap-2">
            <Link href={`/StoreDashborad/edit-product/${product.id}`}>
            <button
              className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
            </Link>
            <button
              onClick={() => handleDelete(product.id)}
              className="p-2 rounded-full hover:bg-red-50 text-red-600 transition"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


      </div>
    </Sidebar>
  );
}
