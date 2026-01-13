"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import { Edit, PlusCircle, X } from "lucide-react";
import {RiDeleteBin2Fill} from "react-icons/ri";

type Category = {
    id?: number;
    name: string;
    description: string;
    image?: File | string;
    ad_imae_url?: string;
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState<number>(1);
    const [formData, setFormData] = useState<Category>({
        name: "",
        description: "",
        image: "",
        ad_imae_url: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    // جلب الأقسام من السيرفر (Laravel)
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/allcategoire`)
            .then((res) => res.json())
            .then((data) => setCategories(data || []))
    }, [refresh]);

    // فتح المودال للإضافة
    const handleAdd = () => {
        setIsEditing(false);
        setFormData({ name: "", description: "", image: "" });
        setPreview(null);
        setShowModal(true);
    };

    // فتح المودال للتعديل
    const handleEdit = (category: Category) => {
        setIsEditing(true);
        setFormData({
            id: category.id,
            name: category.name,
            description: category.description,
            ad_imae_url: "",
        });
        setPreview(typeof category.image === "string" ? category.image : null);
        setShowModal(true);
    };

    // تغيير قيم الحقول
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // رفع الصورة
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    // إرسال البيانات إلى Laravel
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        if (formData.image instanceof File) data.append("ad_image", formData.image);

        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/edit-categorie/${formData.id}`
            : `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/add-categorie`;

        const method = isEditing ? "POST" : "POST"; // ممكن PUT إذا السيرفر يدعمها

        const res = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}` },
            body: data,
        });

        if (res.ok) {
            setShowModal(false);
            const updated = await res.json();
            setRefresh(refresh + 1)
            // تحديث القائمة بدون إعادة تحميل الصفحة
            if (isEditing) {
                setCategories((prev) =>
                    prev.map((cat) => (cat.id === updated.id ? updated : cat))
                );
            } else {
                setCategories((prev) => [...prev, updated]);
            }
        } else {
            alert("حدث خطأ أثناء الحفظ");
        }
    };

    const handleDelete = async (id:number) => {
        const token = localStorage.getItem("token")
        if(!confirm("حذف القسم يعني حذف جميع المنتجات اللتي فيه !")) return;
        if(id === 1){
            return alert("لا يمكن حذف قسم العام");
        }
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/categorie/${id}`,{
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const json = await res.json();


                setCategories((prev) => prev.filter((c) => c.id !== id));

        }catch (error) {
        }
    }

    return (
        <>
            <Navbar />
            <TooleBar />

            <div className="Container mx-auto p-6">
                {/* زر إضافة قسم */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">الأقسام</h1>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
                    >
                        <PlusCircle className="w-5 h-5" />
                        أضف قسم جديد
                    </button>
                </div>

                {/* عرض الأقسام */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category:any, idx:number) => (
                        <div
                            key={idx}
                            className="relative h-64 rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
                        >
                            <img
                                src={category.ad_imae_url || "/images/default.jpg"}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-end p-4">
                                <h2 className="text-xl font-bold text-white mb-1">
                                    {category.name}
                                </h2>
                                <p className="text-sm text-white mb-3">{category.description}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="px-3 py-1 bg-white text-black rounded flex items-center gap-1 w-max hover:bg-gray-200 transition"
                                    >
                                        <Edit className="w-4 h-4" /> تعديل
                                    </button>

                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded flex items-center gap-1 w-max hover:bg-red-700 transition"
                                    >
                                        <RiDeleteBin2Fill className="w-4 h-4" /> حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* النافذة المنبثقة */}
            {showModal && (
                <div className="fixed inset-0 bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-xl shadow-lg flex items-center justify-center z-50">
                    <div className="bg-white/80 w-full max-w-lg rounded-2xl p-6 relative shadow-lg">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                            onClick={() => setShowModal(false)}
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            {isEditing ? "تعديل القسم" : "إضافة قسم جديد"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    الاسم
                                </label>
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
                                <label className="block text-gray-700 font-medium mb-1">
                                    الوصف
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    الصورة
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2"
                                />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="mt-3 w-full h-40 object-cover rounded-xl shadow"
                                    />
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                            >
                                {isEditing ? "تحديث القسم" : "إضافة القسم"}
                            </button>
                        </form>
                    </div>
                </div>

            )}
        </>
    );
}
