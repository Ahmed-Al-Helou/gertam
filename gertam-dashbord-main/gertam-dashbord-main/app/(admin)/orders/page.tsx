"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import { Eye, Edit, Trash2, PlusCircle, X } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Link from "next/link";
import {FullScreenLoader} from "@/components/FullScreenLoader";

dayjs.locale("ar");

interface Order {
    id: number;
    name: string;
    totlePrice: number;
    status: string;
    updated_at: string;
    user_id?: number;
    country?: string;
    email?: string;
    city?: string;
    orderNotes?: string;
    phone?: string;
    streetAddress?: string;
    order_item?: any[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [resfrsh, setResfrsh] = useState<Order | number>(1);
    const [formData, setFormData] = useState<Order>({
        id: 0,
        user_id: 0,
        name: "",
        country: "",
        email: "",
        city: "",
        status: "",
        orderNotes: "",
        phone: "",
        streetAddress: "",
        totlePrice: 0,
        updated_at: dayjs().format(),
        order_item: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/orders`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();
                const formatted = json.map((order: any) => ({
                    ...order,
                    updated_at: dayjs(order.updated_at).format("YYYY/MM/DD - hh:mm A"),
                }));
                setOrders(formatted);
                setLoading(false);
            } catch (error: any) {
            }
        };
        fetchData();
    }, [resfrsh]);

    const handleView = (id: number) => alert(`عرض تفاصيل الطلب رقم ${id}`);
    const handleEdit = (order: Order) => {
        setEditingOrder(order);
        setFormData(order);
        setShowModal(true);
    };
    const handleDelete = async (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/delete-order/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const json = await res.json();


                if (json.order_id || json.ok) {
                    // إنشاء نسخة جديدة تمامًا لتفادي مشاكل React state
                    setResfrsh(Number(resfrsh) + 1);
                    setShowModal(false);
                } else {
                }
            } catch (error: any) {
            }

        }
    };
    const handleAddNew = () => {
        setEditingOrder(null);
        setFormData({
            id: 0,
            user_id: 1,
            name: "",
            country: "",
            email: "",
            city: "",
            status: "",
            orderNotes: "",
            phone: "",
            streetAddress: "",
            totlePrice: 0,
            updated_at: dayjs().format(),
            order_item: [],
        });
        setShowModal(true);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingOrder) {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/edit-order/${formData.id}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const json = await res.json();


                if (json.order_id || json.ok) {
                    // إنشاء نسخة جديدة تمامًا لتفادي مشاكل React state
                    setResfrsh(Number(resfrsh) + 1);
                    setShowModal(false);
                } else {
                }
            } catch (error: any) {
            }

        } else {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/createAnminOrder`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const json = await res.json();


                if (json.order_id || json.ok) {
                    // إنشاء نسخة جديدة تمامًا لتفادي مشاكل React state
                   setResfrsh(Number(resfrsh) + 1);
                   setShowModal(false);
                } else {
                }
            } catch (error: any) {
            }
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const filteredOrders = orders.filter(
        (order) =>
            order.name.toLowerCase().includes(search.toLowerCase()) ||
            order.status.toLowerCase().includes(search.toLowerCase()) ||
            order.id.toString().includes(search)
    );

    if(loading) return <FullScreenLoader text={"جاري تحميل الطلبات "}/>

    return (
        <>
            <Navbar />
            <TooleBar />
            <div className="Container m-10">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-xl font-bold mb-4">إدارة الطلبات</h1>

                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            placeholder="ابحث عن عميل أو حالة..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                        />
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            <PlusCircle className="w-5 h-5" /> اضف طلب جديد
                        </button>
                    </div>

                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                اسم العميل
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                التاريخ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                المبلغ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                الحالة
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        {order.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        {order.updated_at}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        ${Number(order.totlePrice).toFixed(2)}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                            order.status === "مكتمل"
                                                ? "text-green-600"
                                                : order.status === "قيد التنفيذ"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                        }`}
                                    >
                                        {order.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                        <Link href={`/orders/${order.id}`}>
                                            <button

                                                className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleEdit(order)}
                                            className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center p-4 text-gray-500">
                                    لا توجد طلبات مطابقة لعملية البحث
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* نافذة منبثقة */}
            {showModal && (<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {editingOrder ? "تعديل الطلب" : "إضافة طلب جديد"}
                        </h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="اسم العميل"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                            />
                            <input
                                type="text"
                                name="email"
                                placeholder="البريد الإلكتروني"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="رقم الهاتف"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="الدولة"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="المدينة"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                                />
                            </div>
                            <input
                                type="text"
                                name="streetAddress"
                                placeholder="العنوان"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    name="totlePrice"
                                    placeholder="المبلغ الإجمالي"
                                    value={formData.totlePrice}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                                />
                                <input
                                    type="text"
                                    name="status"
                                    placeholder="الحالة"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                                />
                            </div>
                            <textarea
                                name="orderNotes"
                                placeholder="ملاحظات الطلب"
                                value={formData.orderNotes}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                                rows={4}
                            />
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition shadow-md"
                            >
                                {editingOrder ? "حفظ التعديلات" : "إضافة الطلب"}
                            </button>
                        </form>
                    </div>
                </div>

            )}
        </>
    );
}
