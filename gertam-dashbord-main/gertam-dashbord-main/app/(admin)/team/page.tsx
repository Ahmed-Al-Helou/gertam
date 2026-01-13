"use client";
import React, {useEffect, useState} from "react";
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import { Eye, Edit, Trash2, CheckCircle2, PlusCircle, X } from "lucide-react";
import {error} from "next/dist/build/output/log";

const initialTeam = [
    { id: 1, name: "أحمد علي", role: "مسؤول", image: "/me.png" },
    { id: 2, name: "سارة محمد", role: "محاسب", image: "/team/sara.jpg" },
    { id: 3, name: "خالد حسن", role: "مسوق", image: "/team/khaled.jpg" },
];

export default function TeamPage() {
    const [team, setTeam] = useState(initialTeam);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        email: "",
        phone: "",
        country: "",
        password: "",
        password_confirmation: "",
        image: null as File | null,
        avatar_url: null as File | null,
    });

    useEffect(() => {
        const fetchData = async ()=>{
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/getAllAdmins`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });
                const json = await res.json();
                setTeam(json);
            }catch (error){
            }
        }

        fetchData();
    }, []);
    const borderColor = (role: string) => {
        if (role === "مسؤول") return "border-blue-500";
        if (role === "محاسب") return "border-green-500";
        if (role === "مسوق") return "border-purple-500";
        return "border-gray-300";
    };

    const handleView = (id: number) => alert(`عرض بيانات العضو رقم ${id}`);

    const handleEdit = (id: number) => {
        const member = team.find((m) => m.id === id);
        if (!member) return;
        setIsEditing(true);
        setCurrentMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            email: "",
            phone: "",
            country: "",
            password: "",
            password_confirmation: "",
            image: null,
            avatar_url: null,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) =>{
        if(!confirm("هل أنت متأكد من الحذف؟")) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/deleteAdmin/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            const json = await res.json();
            if(res.ok && json.message === "Admin user deleted successfully"){

                setTeam(team.filter((m) => m.id !== id));
            }
        }catch (error){
        }

    }


    const handleAdd = () => {
        setIsEditing(false);
        setCurrentMember(null);
        setFormData({
            name: "",
            role: "",
            email: "",
            phone: "",
            country: "",
            password: "",
            password_confirmation: "",
            image: null,
            avatar_url: null,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && currentMember) {
            setTeam(
                team.map((m) =>
                    m.id === currentMember.id
                        ? { ...m, name: formData.name, role: formData.role }
                        : m
                )
            );
        } else {



            const token = localStorage.getItem("token");

            try {
                const data = new FormData();
                data.append("name", formData.name);
                data.append("role", formData.role);
                data.append("email", formData.email);
                data.append("phone", formData.phone);
                data.append("country", formData.country);
                data.append("password", formData.password);
                data.append("password_confirmation", formData.password_confirmation);
                if (formData.image) data.append("image", formData.image);

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/createAdminAcount`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                });

                const json = await res.json();

                if (res.ok && json.status === true) {
                    const newMember = {
                        id: json.data.user.id,
                        name: json.data.user.name,
                        role: json.data.user.role,
                        image: json.data.user.avatar_url || "/me.png",
                    };
                    setTeam([...team, newMember]);
                    setShowModal(false);
                } else {
                    alert(Object.values(json.errors || { message: json.message }).join("\n"));
                }
            } catch (error) {
                alert("حدث خطأ أثناء الاتصال بالسيرفر");
            }
        }

    };

    return (
        <>
            <Navbar />
            <TooleBar />
            <div className="Container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">فريق العمل</h1>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusCircle className="w-5 h-5" />
                        إضافة حساب إداري جديد
                    </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {team.map((member) => (
                        <div
                            key={member.id}
                            className="relative group bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-lg"
                        >
                            <div
                                className={`w-28 h-28 rounded-full border-4 ${borderColor(
                                    member.role
                                )} overflow-hidden`}
                            >
                                <img
                                    src={member?.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h2 className="mt-4 text-lg font-bold flex items-center justify-center gap-1">
                                {member.name}
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            </h2>

                            <p className="text-gray-600">{member.role}</p>

                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleView(member.id)}
                                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                                >
                                    <Eye className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                    onClick={() => handleEdit(member.id)}
                                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                                >
                                    <Edit className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                                >
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* نافذة الإضافة / التعديل */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg relative shadow-xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            {isEditing
                                ? "تعديل بيانات الحساب الإداري"
                                : "إضافة حساب إداري جديد"}
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 text-right"
                        >
                            <div>
                                <label className="block mb-1 font-medium">
                                    الاسم الكامل
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    الدور الوظيفي
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            role: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            {!isEditing && (
                                <>
                                    <div>
                                        <label className="block mb-1 font-medium">
                                            البريد الإلكتروني
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full border rounded-lg p-2"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium">
                                            رقم الهاتف
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg p-2"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium">
                                            الدولة
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg p-2"
                                            value={formData.country}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    country: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block mb-1 font-medium">
                                                كلمة المرور
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full border rounded-lg p-2"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        password:
                                                        e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block mb-1 font-medium">
                                                تأكيد كلمة المرور
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full border rounded-lg p-2"
                                                value={formData.password_confirmation}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        password_confirmation:
                                                        e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    {isEditing ? "تحديث" : "إضافة"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
