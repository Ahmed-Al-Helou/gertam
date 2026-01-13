"use client"
import React, { useState } from 'react';
import Navbar from '@/componets/Navbar/Navbar';
import TooleBar from '@/componets/tooleBar/TooleBar';
import { Eye, Edit, Trash2 } from 'lucide-react';

const suppliersData = [
    { id: 1, name: 'شركة الفارس', contact: '07701234567', status: 'نشط', location: 'بغداد' },
    { id: 2, name: 'شركة المستقبل', contact: '07707654321', status: 'نشط', location: 'كربلاء' },
    { id: 3, name: 'شركة الرائد', contact: '07709876543', status: 'موقوف', location: 'بغداد' },
];

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState(suppliersData);
    const [search, setSearch] = useState('');

    const handleView = (id:number) => alert(`عرض بيانات المورد رقم ${id}`);
    const handleEdit = (id:number) => alert(`تعديل بيانات المورد رقم ${id}`);
    const handleDelete = (id:number) => {
        if(confirm('هل أنت متأكد من حذف هذا المورد؟')) {
            setSuppliers(suppliers.filter(s => s.id !== id));
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.contact.includes(search) ||
        supplier.status.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <TooleBar />
            <div className="Container mx-auto p-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6">إدارة الموردين</h1>
                    <div className="mb-6 w-full max-w-sm relative">
                        <input
                            type="text"
                            placeholder="ابحث عن المورد..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 "
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map(supplier => (
                                <div key={supplier.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between">
                                    <div>
                                        <h2 className="font-bold text-lg mb-2 text-gray-800">{supplier.name}</h2>
                                        <p className="text-gray-600"><span className="font-semibold">الهاتف:</span> {supplier.contact}</p>
                                        <p className="text-gray-600"><span className="font-semibold">الموقع:</span> {supplier.location}</p>
                                        <p className={`mt-1 font-semibold ${supplier.status === 'نشط' ? 'text-green-600' : 'text-red-600'}`}>الحالة: {supplier.status}</p>
                                    </div>
                                    <div className="flex gap-2 mt-4 justify-end">
                                        <button onClick={() => handleView(supplier.id)} className="px-3 py-1 text-sm border rounded flex items-center gap-1 hover:bg-gray-100">
                                            <Eye className="w-4 h-4" /> عرض
                                        </button>
                                        <button onClick={() => handleEdit(supplier.id)} className="px-3 py-1 text-sm border rounded flex items-center gap-1 hover:bg-gray-100">
                                            <Edit className="w-4 h-4" /> تعديل
                                        </button>
                                        <button onClick={() => handleDelete(supplier.id)} className="px-3 py-1 text-sm border rounded text-red-600 flex items-center gap-1 hover:bg-red-100">
                                            <Trash2 className="w-4 h-4" /> حذف
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-full">لا توجد موردين مطابقة لعملية البحث</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}