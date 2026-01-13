"use client";

import { FullScreenLoader } from "@/components/FullScreenLoader";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  ar_name: string;
  en_name: string;
  price: number;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {






  const [selectedCategory, setSelectedCategory] = useState<number | null>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [targetCategory, setTargetCategory] = useState<number | null>(null);
 const [categoriesData, setCategoriesData] = useState<any[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (selectedCategory) {

        const fetchedProducts = async () => {

            try{
               const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/products/by-category/${selectedCategory}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        })
        const data = await res.json();
            if(res.ok){
                setCategoriesData(data.categories);
                setProducts(data.products);
            }else setError(data.message || "حدث خطأ أثناء جلب البيانات");
       
            }catch(err){
                setError("حدث خطأ في الاتصال بالخادم");
            }finally{
                setLoading(false);
            }
        }

        fetchedProducts();
    }
  }, [selectedCategory]);

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

const moveProducts = async () => {
  if (!targetCategory) return alert("اختر القسم الجديد أولاً");

  const newCategoryName = categoriesData.find(
    (c) => c.id === targetCategory
  )?.name;
  if (!newCategoryName) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/products/move-to-category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          product_ids: selectedProducts,
          target_category_id: targetCategory,
        }),
      }
    );

    if (res.ok) {

  // تحديث الجدول: إزالة المنتجات التي انتقلت
  setProducts((prev) =>
    prev.filter((p) => !selectedProducts.includes(p.id))
  );

  setSelectedProducts([]);
  setTargetCategory(null);
//   alert("تم نقل المنتجات بنجاح");
}
 else {
      const errorData = await res.json();
      alert("فشل النقل: " + errorData.message || "حدث خطأ ما");
    }
  } catch (err) {
    alert("حدث خطأ أثناء نقل المنتجات");
  }finally{
    setLoading(false);
  }
};

if(loading) return <FullScreenLoader text="جاري تحميل المنتجات..." />;


  return (
    <>
    <Navbar />
    <TooleBar />
    <div className="p-8 bg-gray-50 min-h-screen Container">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        المنتجات حسب القسم 
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="font-semibold mr-2">اختر القسم:</label>
          <div className="relative w-full md:w-64">
  <select
    value={selectedCategory || ""}
    onChange={(e) => setSelectedCategory(Number(e.target.value))}
    className="block w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  >
    <option value="">-- اختر قسم --</option>
    {categoriesData.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>

        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={targetCategory || ""}
              onChange={(e) => setTargetCategory(Number(e.target.value))}
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
            >
              <option value="">اختر القسم الجديد</option>
              {categoriesData
                .filter((cat) => cat.id !== selectedCategory)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            <button
              onClick={moveProducts}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 shadow transition"
            >
              نقل {selectedProducts.length} منتج
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-right text-sm flex item-center font-semibold text-gray-700">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(products.map((p) => p.id));
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                  checked={
                    products.length > 0 &&
                    selectedProducts.length === products.length
                  }
                />
                <span className="mr-6">تحديد الكل </span>
              </th>
              <th className="px-6 py-3 text-right  text-sm font-semibold text-gray-700">
                الاسم
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                السعر
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                القسم
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-50 transition ${
                  selectedProducts.includes(product.id)
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <td className="px-6 w-50 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                    className="w-5 h-5"
                  />
                  <span className="mr-6">{product.id}# </span>
                </td>
                <td className="px-6 py-4 w-60 font-medium text-gray-800">
                  {`${product.ar_name} (${product.en_name})`}
                </td>
                <td className="px-6 py-4 w-50 text-gray-600">{product.price}</td>
                <td className="px-6 w-50 py-4 text-gray-500">{product.category_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
