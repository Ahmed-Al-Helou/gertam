"use client";

import { useEffect, useState } from "react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

interface Brand {
    id: number;
    ar_name: string;
    en_name: string;
}

interface Model {
    id: number;
    ar_name: string;
    en_name: string;
    brand_id: number | string;
    make_by: number | string;

}


export default function ModelsPage() {
    const [activeModal, setActiveModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [search, setSearch] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [updated, setUpdated] = useState<number >(1);

    const [form, setForm] = useState({
        ar_name: "",
        en_name: "",
        brand_id: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const [brandsRes, modelsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/showAllBrands`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/showAllModules`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setBrands(await brandsRes.json());
                setModels(await modelsRes.json());
            } catch (err) {
            }
        };
        fetchData();
    }, [updated]);

    const handleInputChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage("");
        const token = localStorage.getItem("token");

        try {
            const url = isEditing
                ? `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/update-model/8`
                : `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/add-moudle`;

            const method = "POST"; // حسب إعدادات السيرفر

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(isEditing ? "✅ تم تعديل الموديل بنجاح" : "✅ تم إضافة الموديل بنجاح");

                    setUpdated(updated + 1);

                // تحديث القائمة مباشرة
                if (isEditing) {
                    setModels((prev) =>
                        prev.map((m) => (m.id === editingId ? { ...m, ...form, id: editingId } : m))
                    );
                } else {
                    setModels((prev) => [...prev, data]);
                }

                // إعادة ضبط النموذج وإغلاق المودال
                setForm({ ar_name: "", en_name: "", brand_id: ""});
                setIsEditing(false);
                setEditingId(null);
                setActiveModal(false);
            } else {
                setMessage(data.message || "❌ حدث خطأ");
            }
        } catch (err) {
            setMessage("⚠️ فشل الاتصال بالخادم");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/destroy-model/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setModels((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
        }
    };

    const handleEdit = (model: Model) => {
        setMessage("");
        setForm({
            ar_name: model.ar_name,
            en_name: model.en_name,
            brand_id: model.make_by.toString(),

        });
        setIsEditing(true);

        setEditingId(model.id);
        setActiveModal(true);
    };
    const handleadd = () => {
        setActiveModal(true);
        setMessage("");
        setForm({
            ar_name: "",
            en_name: "",
            brand_id: "",
        });

    };

    const filteredModels = models.filter((m) => {
        const brand = brands.find((b) => b.id === m.brand_id);
        const searchLower = search.toLowerCase();

        return (
            (m.ar_name?.toLowerCase().includes(searchLower) ?? false) ||
            (m.en_name?.toLowerCase().includes(searchLower) ?? false) ||
            (brand?.ar_name?.toLowerCase().includes(searchLower) ?? false)
        );
    });


    return (
        <>
            <Navbar />
            <TooleBar />
            <div className="p-8 Container">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">إدارة الموديلات</h1>
                    <button
                        onClick={() => handleadd()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
                    >
                        <FiPlus /> إضافة موديل
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="بحث عن موديل أو شركة..."
                    className="mb-4 p-3 border rounded-xl w-full focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="overflow-x-auto p-4 bg-white rounded-2xl m-5 shadow">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800">الموديلات</h2>
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الاسم بالعربية</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الاسم بالإنجليزية</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الشركة</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الإجراءات</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                        {models.map((model, idx) => {
                            const brand = brands.find((b) => b.id === model.make_by);
                            return (
                                <tr key={idx} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{model.id}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{model.ar_name}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{model.en_name}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{brand?.ar_name || "-"}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm flex justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(model)}
                                            className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        >
                                            <FiEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(model.id)}
                                            className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>


                {/* نافذة منبثقة */}
                {activeModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
                            <h2 className="text-xl font-bold mb-4 text-center">إضافة موديل جديد</h2>

                            <div className="grid gap-4">
                                <input
                                    type="text"
                                    placeholder="الاسم بالعربية"
                                    value={form.ar_name}
                                    onChange={(e) => handleInputChange("ar_name", e.target.value)}
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="الاسم بالإنجليزية"
                                    value={form.en_name}
                                    onChange={(e) => handleInputChange("en_name", e.target.value)}
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={form.brand_id}
                                    onChange={(e) => handleInputChange("brand_id", e.target.value)}
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">اختر الشركة</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.ar_name} ({b.en_name})
                                        </option>
                                    ))}
                                </select>
                                

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow"
                                >
                                    {loading ? "جاري الإضافة..." : "إضافة"}
                                </button>

                                {message && <p className="text-center text-sm mt-2">{message}</p>}

                                <button
                                    onClick={() => setActiveModal(false)}
                                    className="block mx-auto mt-4 text-sm text-gray-500 hover:text-black"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
