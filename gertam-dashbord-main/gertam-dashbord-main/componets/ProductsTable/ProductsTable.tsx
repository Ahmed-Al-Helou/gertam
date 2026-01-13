"use client";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useProducts } from "@/hooks/Product/useAllProducts";
import Link from "next/link";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import styles from "../search/search.module.css";
import { CiSearch } from "react-icons/ci";
import { usdToSAR } from "@/app/utils/currency";

export default function ProductsTable() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]); // IDs المختارة
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState<string>("");
  const {
    products: ProductsData,
    loading,
    DeleteProduct,
    totalPages,
    getProducts,
  } = useProducts(page, search);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      const allIds = (ProductsData ?? []).map((p) => p.id);
      setSelected(allIds);
      setSelectAll(allIds.length > 0);
    }
  };

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleView = (id: number) => {
    location.href = `https://www.gertam.sa/Product/${id}`;
  }

  const handleDelete = async (id?: number) => {
    if (id) {
      if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) await DeleteProduct(id);
      return;
    }

    if (selected.length === 0) return alert("اختر منتجات أولاً");
    if (!confirm(`هل أنت متأكد من حذف ${selected.length} منتج؟`)) return;

    for (const pid of selected) {
      await DeleteProduct(pid);
    }
    setSelected([]);
    setSelectAll(false);
  };

  if (loading) return <FullScreenLoader text="جاري تحميل المنتجات..." />;

  return (
    <div className="overflow-x-auto p-4 bg-white rounded-2xl m-5">
      <div className={styles.Search}>
        <Link href="/add-product" className={styles.addProduct}>
          اضافة منتج جديد{" "}
        </Link>
        <div className="flex items-center gap-2  max-w-md  p-2 bg-white rounded-lg shadow-md">
          <CiSearch size={24} className="text-gray-500" />
          <input
            type="search"
            placeholder="بحث ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => getProducts(search)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            بحث
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">المنتجات</h2>

        {selected.length > 0 && (
          <button
            onClick={() => handleDelete()}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
          >
            حذف المحدد ({selected.length})
          </button>
        )}
      </div>

      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              الصورة
            </th>
            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              الاسم
            </th>
            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              القسم
            </th>
            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              السعر
            </th>
            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              المخزون
            </th>
            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-slate-200">
          {ProductsData &&
            ProductsData.map((product) => (
              <tr
                key={product.id}
                className={`hover:bg-slate-50 transition ${
                  selected.includes(product.id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => handleSelect(product.id)}
                  />
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-700">
                  {product.id}
                </td>
                <td className="px-6 py-4 text-center">
                  <img
                    src={product.thumbnail ?? "no-image.jpeg"}
                    alt={product.ar_name}
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-700">
                  {product.ar_name}
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-700">
                  {product.categories.name}
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-700">
                  {usdToSAR(Number(product.price))}
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-700">
                  {product.product_units?.[0]?.stock ?? "غير معروف"}

                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm flex gap-2 justify-center">
                  <button
                    onClick={() => handleView(product.id)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    <AiOutlineEye size={16} />
                  </button>
                  <Link href={`edit-product/${product.id}`}>
                    <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition">
                      <AiOutlineEdit size={16} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* شريط التنقل بالأرقام */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            } transition`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
