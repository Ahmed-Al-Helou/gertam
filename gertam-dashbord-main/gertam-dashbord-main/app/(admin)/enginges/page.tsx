"use client";

import { useEffect, useState } from "react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import {FullScreenLoader} from "@/components/FullScreenLoader";

interface ModelDate {
    id: number;
    module_by: number;
    date_from: string;
    date_to: string;
}

interface Model {
    id: number;
    ar_name: string;
    en_name: string;
    make_by: number | string;
    brand_id: number | string;
    module_date: ModelDate[];
}

interface Engine {
    id: number;
    ar_name: string;
    en_name: string;
    year_id: number | string;
    module_date_by: number | string;
}

export default function EnginesPage() {
    const [activeModal, setActiveModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [models, setModels] = useState<Model[]>([]);
    const [engines, setEngines] = useState<Engine[]>([]);
    const [search, setSearch] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState({
        ar_name: "",
        en_name: "",
        model_id: "",
        year_id: "",
    });

    // جلب البيانات
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const [modelsRes, enginesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/showAllModules`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/showAllEngines`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setModels(await modelsRes.json());
                setEngines(await enginesRes.json());
                setPageLoading(false);
            } catch (err) {
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddOrEdit = async () => {
        setLoading(true);
        setMessage("");
        const token = localStorage.getItem("token");

        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/update-engine/${editingId}`
            : `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/add-engiene`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(isEditing ? "✅ تم تعديل المحرك بنجاح" : "✅ تم إضافة المحرك بنجاح");

                // تحديث القائمة
                if (isEditing) {
                    setEngines((prev:Engine[]) =>
                        prev.map((e) => (e.id === editingId ? { ...e, ...form, id: editingId } : e))
                    );
                } else {
                    setEngines((prev) => [...prev, data]);
                }

                setForm({ ar_name: "", en_name: "", model_id: "", year_id: "" });
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
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/delete-engine/${id}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setEngines((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
        }
    };

    const handleEdit = (engine: Engine) => {
        setMessage("");
        setForm({
            ar_name: engine.ar_name,
            en_name: engine.en_name,
            model_id: models.find(m =>
                m.module_date.some(d => d.id === engine.year_id)
            )?.id.toString() || "",
            year_id: engine.module_date_by.toString(),
        });
        setIsEditing(true);
        setEditingId(engine.id);
        setActiveModal(true);
    };

    const handleAdd = () => {
        setActiveModal(true);
        setMessage("");
        setForm({ ar_name: "", en_name: "", model_id: "", year_id: "" });
        setIsEditing(false);
        setEditingId(null);
    };

    const filteredEngines = engines.filter((e) => {
        const searchLower = search.toLowerCase();
        return (
            e?.ar_name.toLowerCase().includes(searchLower) ||
            e?.en_name.toLowerCase().includes(searchLower)
        );
    });


    return (
        <>
            <Navbar />
            <TooleBar />
            <div className="p-8 Container">
                {pageLoading && (
                    <FullScreenLoader />
                )}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">إدارة المحركات</h1>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
                    >
                        <FiPlus /> إضافة محرك
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="بحث عن محرك..."
                    className="mb-4 p-3 border rounded-xl w-full focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="overflow-x-auto p-4 bg-white rounded-2xl m-5 shadow">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800">قائمة المحركات</h2>
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الاسم بالعربية</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الاسم بالإنجليزية</th>
                            <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الإجراءات</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                        {filteredEngines.map((engine, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 text-center">{engine.id}</td>
                                <td className="px-6 py-4 text-center">{engine.ar_name}</td>
                                <td className="px-6 py-4 text-center">{engine.en_name}</td>
                                <td className="px-6 py-4 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(engine)}
                                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                    >
                                        <FiEdit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(engine.id)}
                                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* المودال */}
                {activeModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
                            <h2 className="text-xl font-bold mb-4 text-center">
                                {isEditing ? "تعديل المحرك" : "إضافة محرك جديد"}
                            </h2>

                            <div className="grid gap-4">
                                {/* اختيار الموديل */}
                                <select
                                    value={form.model_id}
                                    onChange={(e) => handleInputChange("model_id", e.target.value)}
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">اختر الموديل</option>
                                    {models.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.ar_name} ({m.en_name})
                                        </option>
                                    ))}
                                </select>

                                {/* اختيار السنة */}
                                <select
                                    value={form.year_id}
                                    onChange={(e) => handleInputChange("year_id", e.target.value)}
                                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">اختر السنة</option>
                                    {models
                                        .find((m) => m.id === Number(form.model_id))
                                        ?.module_date?.map((year) => (
                                            <option key={year.id} value={year.id}>
                                                {year.date_from} - {year.date_to}
                                            </option>
                                        ))}
                                </select>

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

                                <button
                                    onClick={handleAddOrEdit}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow"
                                >
                                    {loading ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات" : "إضافة"}
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
