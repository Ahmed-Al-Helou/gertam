import { useEffect, useState } from "react";
import Sidebar from "@/components/slidebar/slidebar";


export default function OrderDetailPage({orderId}: {orderId: number | string}) {
  const [order, setOrder] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/order/${orderId}`, {
               headers: {
                    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                }
        });
        const json = await res.json()
        setOrder(json)
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) return <Sidebar><div className="p-6 text-gray-700">جارٍ تحميل البيانات...</div></Sidebar>;
  if (!order) return <Sidebar><div className="p-6 text-red-600">حدث خطأ في جلب الطلب.</div></Sidebar>;

  return (
    <Sidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">تفاصيل الطلب #{order.id}</h1>
            <p className="text-gray-500 mt-1">الحالة: <span className={`font-semibold ${order.status === 'مكتمل' ? 'text-green-600' : order.status === 'قيد التنفيذ' ? 'text-yellow-600' : 'text-red-600'}`}>{order.status}</span></p>
          </div>
          <p className="mt-2 sm:mt-0 text-gray-500">تاريخ الإنشاء: {new Date(order.created_at).toLocaleString()}</p>
        </div>

        {/* User Info */}
        <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-gray-700">معلومات العميل</h5>
            <p>الاسم: {order.name}</p>
            <p>البريد الإلكتروني: {order.email}</p>
            <p>الهاتف: {order.phone}</p>
          </div>
          <div>
            <h5 className="font-semibold text-gray-700">العنوان</h5>
            <p>الشارع: {order.streetAddress}</p>
            <p>المدينة: {order.city}</p>
            <p>الدولة: {order.country}</p>
          </div>
        </div>

        {/* Order Notes */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h5 className="font-semibold  text-gray-700 mb-2">ملاحظات الطلب</h5>
          <p className="text-gray-600">{order.orderNotes}</p>
        </div>

        {/* Order Items */}
        <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
          <h5 className="font-semibold text-gray-700 mb-4">المنتجات</h5>
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-center font-medium">#</th>
                <th className="px-4 py-2 text-center  font-medium">المنتج</th>
                <th className="px-4 py-2 text-center font-medium">الكمية</th>
                <th className="px-4 py-2 text-center font-medium">السعر</th>
                <th className="px-4 py-2 text-center font-medium">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.order_item.map((item:any, idx:any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">{idx + 1}</td>
                  <td className="px-4 py-2 flex items-center justify-center gap-2 ">
                    <img src={item.product.thumbnail} alt={item.product.ar_name} className="w-12 h-12 object-cover rounded" />
                    <span>{item.product.ar_name}</span>
                  </td>
                  <td className="px-4 text-center py-2">{item.quantity}</td>
                  <td className="px-4 text-center py-2">{item.price}$</td>
                  <td className="px-4 text-center py-2">{item.total}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Price */}
        <div className="bg-white p-4 rounded-xl shadow text-right">
          <h5 className="font-semibold text-gray-700">الإجمالي الكلي: <span className="text-indigo-600">{order.totlePrice}$</span></h5>
        </div>
      </div>
    </Sidebar>
  );
}
