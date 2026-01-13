"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import { Edit, X } from "lucide-react";
import { RiDeleteBin2Fill } from "react-icons/ri";

interface Store {
    id: number;
    name: string;
    logo: string;
    store_picture: string;
    user_id: number;
}

export default function SmallStoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<Store | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        logo: null as File | null,
        store_picture: null as File | null,
        userId: "",
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [storePreview, setStorePreview] = useState<string | null>(null);

    useEffect(() => {
        // هنا يمكن جلب البيانات من لارفيل
        const fetchStores = async () => {
            // استبدل هذا بالـ fetch من API الخاص بك
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/allStores`,{
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            })
            const json = await res.json();

            setStores(json);
            setLoading(false);
        };
        fetchStores();
    }, []);

    const handleEdit = (store: Store) => {
        setError("")
        setModalData(store);
        setFormData({ name: store.name, logo: null, store_picture: null, userId: store.user_id.toString() });
        setLogoPreview(store.logo);
        setStorePreview(store.store_picture);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف المتجر؟")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/deleteStore/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setStores(prev => prev.filter(store => store.id !== id));
        } catch (err) {
            alert("حدث خطأ أثناء الحذف");
        }
    };

    const handleAdd = () => {
        setError("")
        setModalData(null);
        setFormData({ name: "", logo: null, store_picture: null, userId: "" });
        setLogoPreview(null);
        setStorePreview(null);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "store") => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (type === "logo") {
            setFormData(prev => ({ ...prev, logo: file }));
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setFormData(prev => ({ ...prev, store_picture: file }));
            setStorePreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setError("")
        const data = new FormData();
        data.append("name", formData.name);
        data.append("user_id", formData.userId);
        if (formData.logo) data.append("logo", formData.logo);
        if (formData.store_picture) data.append("store_picture", formData.store_picture);

        try {
            if (isEditing && modalData) {
                await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/editStore/${modalData.id}`, {
                    method: "POST", // أو PUT حسب API لارفيل
                    headers: { Authorization: `Bearer ${token}` },
                    body: data,
                });
                setStores(prev =>
                    prev.map(s =>
                        s.id === modalData.id
                            ? {
                                ...s,
                                name: formData.name,
                                logo: formData.logo ? URL.createObjectURL(formData.logo) : s.logo,
                                store_picture: formData.store_picture ? URL.createObjectURL(formData.store_picture) : s.store_picture,
                            }
                            : s
                    )
                );
            } else {
               const res =  await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/createStore`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: data,
                });

               const json = await res.json();
                if (json.message) {
                    setError(json.message);
                    return;
                }

                const newStore: Store = {
                    id: Date.now(),
                    name: formData.name,
                    logo: formData.logo ? URL.createObjectURL(formData.logo) : "/images/default.jpg",
                    store_picture: formData.store_picture ? URL.createObjectURL(formData.store_picture) : "/images/default.jpg",
                    user_id: 0,
                };
                setStores(prev => [...prev, newStore]);
            }
            setShowModal(false);
        } catch (err: any) {
            alert(err.message || "حدث خطأ");
        }
    };

    if (loading) return <p className="text-center mt-10">جاري تحميل البيانات...</p>;

    return (
        <>
            <Navbar />
            <TooleBar />
            <div className="Container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">إدارة المتاجر الصغيرة</h1>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                        إضافة متجر جديد
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map(store => (
                        <div
                            key={store.id}
                            className="relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-transform transform hover:-translate-y-1"
                        >
                            <img src={store.store_picture || store.logo || "no-image.png"} alt={store.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-opacity-30 flex flex-col justify-end p-4">
                                <h2 className="text-xl font-bold text-white mb-2">{store.name}</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(store)}
                                        className="px-3 py-1 bg-white text-black rounded flex items-center gap-1 w-max hover:bg-gray-200 transition"
                                    >
                                        <Edit className="w-4 h-4" /> تعديل
                                    </button>
                                    <button
                                        onClick={() => handleDelete(store.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded flex items-center gap-1 w-max hover:bg-red-700 transition"
                                    >
                                        <RiDeleteBin2Fill className="w-4 h-4" /> حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* نافذة منبثقة بزجاجية */}
                {showModal && (
                    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
                        <div className="backdrop-blur-md bg-white/50 w-full max-w-lg rounded-3xl p-6 relative shadow-2xl border border-gray-200">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-4 pt-8 text-gray-800">{isEditing ? "تعديل المتجر" : "إضافة متجر جديد"}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error !== "" && (
                                    <p className="text-red-500 text-sm mt-2">{error}</p>


                                )}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">اسم المتجر</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1"> معرف المستخدم | ID</label>
                                    <input
                                        type="text"
                                        name="userId"
                                        value={formData.userId ?? ""}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">شعار المتجر</label>
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, "logo")} />
                                    {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mt-2 w-32 h-32 object-cover rounded-lg shadow" />}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">صورة المتجر</label>
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, "store")} />
                                    {storePreview && <img src={storePreview} alt="Store Preview" className="mt-2 w-full h-40 object-cover rounded-lg shadow" />}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                                >
                                    {isEditing ? "تحديث المتجر" : "إضافة المتجر"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
