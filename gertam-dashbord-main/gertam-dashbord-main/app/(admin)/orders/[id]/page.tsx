"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/order/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();
                setOrder(json);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("ar-IQ", {
            dateStyle: "long",
            timeStyle: "short",
        });
    };

    if (loading) return <p className="text-center mt-20 text-gray-500">جارِ تحميل البيانات...</p>;
    if (!order) return <p className="text-center mt-20 text-red-500">لم يتم العثور على الطلب</p>;

    return (
        <>
            <Navbar />
            <TooleBar />

            <div className="Container mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold text-slate-800">
                            تفاصيل الطلب رقم <span className="text-blue-600">#{order.id}</span>
                        </h1>
                        <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                order.status === "مكتمل"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "قيد التنفيذ"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                            }`}
                        >
                            {order.status === "مكتمل"
                                ? "مكتمل"
                                : order.status === "قيد التنفيذ"
                                    ? "قيد التنفيذ"
                                    : "ملغي"}
                        </span>
                    </div>

                    {/* معلومات العميل */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <p><span className="font-semibold text-slate-600">اسم العميل:</span> {order.name}</p>
                            <p><span className="font-semibold text-slate-600">البريد الإلكتروني:</span> {order.email}</p>
                            <p><span className="font-semibold text-slate-600">رقم الهاتف:</span> {order.phone}</p>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-semibold text-slate-600">الدولة:</span> {order.country}</p>
                            <p><span className="font-semibold text-slate-600">المدينة:</span> {order.city}</p>
                            <p><span className="font-semibold text-slate-600">العنوان:</span> {order.streetAddress}</p>
                        </div>
                    </div>

                    {/* معلومات الطلب */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 text-center ">
                            <p className="text-sm text-slate-500 mb-1">إجمالي المبلغ</p>
                            <p className="text-xl font-bold text-slate-800">
                                {Number(order.totlePrice).toFixed(2)} <span className="text-sm">دولار </span>
                            </p>
                        </div>
                        <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 text-center ">
                            <p className="text-sm text-slate-500 mb-1">تاريخ الإنشاء</p>
                            <p className="font-medium text-slate-700">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 text-center ">
                            <p className="text-sm text-slate-500 mb-1">آخر تحديث</p>
                            <p className="font-medium text-slate-700">{formatDate(order.updated_at)}</p>
                        </div>
                    </div>

                    {/* ملاحظات الطلب */}
                    {order.orderNotes && (
                        <div className="mb-8 bg-blue-50 border border-blue-100 p-5 rounded-xl">
                            <p className="font-semibold text-blue-700 mb-2">ملاحظات الطلب:</p>
                            <p className="text-slate-700 leading-relaxed">{order.orderNotes}</p>
                        </div>
                    )}

                    {/* جدول العناصر */}
                    <h2 className="text-lg font-bold mb-4 text-slate-800">عناصر الطلب</h2>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">#</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">رقم المنتج</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">الكمية</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">السعر</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">الإجمالي</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                            {order.order_item && order.order_item.length > 0 ? (
                                order.order_item.map((item: any, index: number) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 text-sm text-slate-700">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                                            {item.product_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{item.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700">
                                            {Number(item.price).toLocaleString()} د.ع
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 font-semibold">
                                            ${Number(item.total).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-4 text-gray-500">
                                        لا توجد عناصر في هذا الطلب
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
