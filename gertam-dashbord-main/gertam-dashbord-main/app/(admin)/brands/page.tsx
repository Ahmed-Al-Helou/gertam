"use client";

import { useEffect, useState } from "react";
import { Building2, PlusCircle, Trash2, Edit2, X } from "lucide-react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";

export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [form, setForm] = useState({ id: null, ar_name: "", en_name: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // جلب جميع الشركات
    const fetchBrands = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/showAllBrands`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setBrands(Array.isArray(data) ? data : []);
        } catch (err) {
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // ✅ إضافة أو تعديل شركة
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);


        const token = localStorage.getItem("token");
        try {
            const url = isEditing
                ? `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/update-brand/${form.id}`
                : `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/add-brand`;

            const method = "POST"; // نفس طريقة إضافة شركة جديدة، حسب سيرفرك

            const formData = new FormData();
            formData.append("ar_name", form.ar_name);
            formData.append("en_name", form.en_name);

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(isEditing ? "✅ تم تعديل الشركة بنجاح" : "✅ تمت إضافة الشركة بنجاح");
                setForm({ id: null, ar_name: "", en_name: "" });
                fetchBrands(); // تحديث القائمة بعد التعديل أو الإضافة
                setTimeout(() => setIsModalOpen(false), 800); // إغلاق المودال بعد ثانيتين تقريبًا
            } else {
                setMessage(data.message || "❌ حدث خطأ أثناء العملية");
            }
        } catch (err) {
            setMessage("⚠️ فشل الاتصال بالخادم");
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };


    // ✅ فتح نافذة التعديل
    const handleEdit = (brand: any) => {

        setMessage("");
        setForm({
            id: brand.id,
            ar_name: brand.ar_name,
            en_name: brand.en_name,
        });
        setIsEditing(true);
        setIsModalOpen(true); // فتح النافذة المنبثقة
    };



    // ✅ حذف شركة
    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذه الشركة؟")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/delete-brand/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setBrands((prev) => prev.filter((b) => b.id !== id));
        } catch {
            alert("فشل الاتصال بالخادم");
        }
    };

    return (
        <>
            <Navbar />
            <TooleBar />

            <div className="p-8 Container">
                <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                    <Building2 className="w-7 h-7 text-blue-600" />
                    إدارة شركات السيارات
                </h1>

                {/* زر إضافة شركة */}
                <div className="flex justify-center mb-10">
                    <div
                        onClick={() => {
                            setIsEditing(false);
                            setForm({ id: null, ar_name: "", en_name: "" });
                            setIsModalOpen(true);
                        }}
                        className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-5 rounded-2xl shadow-lg flex items-center gap-3 transition-transform hover:scale-105"
                    >
                        <PlusCircle className="w-6 h-6" />
                        <span className="font-semibold text-lg">إضافة شركة جديدة</span>
                    </div>
                </div>

                {/* ✅ جدول الشركات */}
                <div className="overflow-x-auto p-4 bg-white rounded-2xl m-5 shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800">الشركات</h2>
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">#</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">الاسم بالعربية</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">الاسم بالإنجليزية</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">الإجراءات</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                        {brands.length > 0 ? (
                            brands.map((b, i) => (
                                <tr key={b.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-center text-sm text-slate-700">{i + 1}</td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-700">{b.ar_name}</td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-700">{b.en_name}</td>
                                    <td className="px-6 py-4 text-center text-sm flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEdit(b)}
                                            className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-6 text-gray-500 text-center">
                                    لا توجد شركات مسجلة حالياً
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ النافذة المنبثقة */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-5 text-center text-blue-700 flex items-center justify-center gap-2">
                            <Building2 className="w-5 h-5" />{" "}
                            {isEditing ? "تعديل الشركة" : "إضافة شركة جديدة"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">الاسم بالعربية</label>
                                <input
                                    type="text"
                                    value={form.ar_name}
                                    onChange={(e) => setForm({ ...form, ar_name: e.target.value })}
                                    required
                                    className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">الاسم بالإنجليزية</label>
                                <input
                                    type="text"
                                    value={form.en_name}
                                    onChange={(e) => setForm({ ...form, en_name: e.target.value })}
                                    required
                                    className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition"
                            >
                                {loading
                                    ? "جاري الحفظ..."
                                    : isEditing
                                        ? "حفظ التعديلات"
                                        : "إضافة الشركة"}
                            </button>
                        </form>

                        {message && <p className="text-center text-sm text-gray-700 mt-3">{message}</p>}
                    </div>
                </div>
            )}
        </>
    );
}
