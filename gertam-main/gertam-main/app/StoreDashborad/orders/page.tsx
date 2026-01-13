"use client";
import Sidebar from "@/components/slidebar/slidebar";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/store/useOrders";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AllordersPage() {
  const { orders, error, isLoading } = useAllOrders();
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const { updateOrderStatus, loading, error:updateError } = useUpdateOrderStatus(); // ✅ هنا فقط


  if (isLoading) return <div>جاري التحميل...</div>;
 const handleChangeStatus = async (ids: number[]) => {
  const status = prompt("اختر الحالة الجديدة...");
  if (!status) return;

  await updateOrderStatus({ ordersIds: ids, NewStatus: status }); // ✅ هذا صحيح
};

  const toggleSelect = (id: number) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };



  return (
    <Sidebar>
      <div className="bg-white shadow-md rounded-xl overflow-hidden space-y-4">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
          <h2 className="text-xl font-semibold text-gray-800">كل الطلبات</h2>
          <div className="flex gap-2 w-full sm:w-auto">
           {selectedOrders.length > 0 && (
             <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition flex-1"
              onClick={() => handleChangeStatus(selectedOrders)}
              disabled={selectedOrders.length === 0}
            >
              تعديل الحالة للمحدد
            </button>
           )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length}
                    onChange={selectAll}
                  />
                </th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">#</th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">الاسم</th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">المنتج</th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">السعر</th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">الحالة</th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">التاريخ</th>
                <th className="px-4 py-3 text-center font-medium whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((req, idx) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(req.id)}
                      onChange={() => toggleSelect(req.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">{idx + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800 text-center">{req.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">{req.country}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">{Number(req.totlePrice).toFixed(2)}$</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === "مكتمل"
                          ? "bg-green-100 text-green-700"
                          : req.status === "قيد التنفيذ"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-center">{new Date(req.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap flex gap-2 justify-center ">
                    <Link href={`/StoreDashborad/order/${req.id}`} >
                      <button className="p-2 text-indigo-600 hover:text-indigo-800" title="عرض">
                        <Eye size={14} color="#333"/>
                      </button>
                    </Link>
                    <button
                      className="p-2 text-yellow-600 hover:text-yellow-800"
                      title="تعديل الحالة"
                      onClick={() => handleChangeStatus([req.id])}
                    >
                      <Edit size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}