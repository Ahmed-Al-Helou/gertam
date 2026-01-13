"use client";
import React, { useState } from 'react';
import Navbar from '@/componets/Navbar/Navbar';
import TooleBar from '@/componets/tooleBar/TooleBar';
import { Eye, Edit, Trash2 } from 'lucide-react';

const transactionsData = [
    { id: 1, type: 'دفعة طلب', amount: 50000, date: '2025-09-30', status: 'مكتمل' },
    { id: 2, type: 'راتب موظف', amount: 300000, date: '2025-09-25', status: 'قيد التنفيذ' },
    { id: 3, type: 'دفعة طلب', amount: 75000, date: '2025-09-28', status: 'ملغي' },
];

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState(transactionsData);
    const [search, setSearch] = useState('');

    const handleView = (id:number) => alert(`عرض بيانات المعاملة رقم ${id}`);
    const handleEdit = (id:number) => alert(`تعديل بيانات المعاملة رقم ${id}`);
    const handleDelete = (id:number) => {
        if(confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
            setTransactions(transactions.filter(t => t.id !== id));
        }
    };

    const filteredTransactions = transactions.filter(t =>
        t.type.toLowerCase().includes(search.toLowerCase()) ||
        t.status.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toString().includes(search)
    );

    return (
        <>
            <Navbar />
            <TooleBar />
            <div className="Container mx-auto p-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6">إدارة المعاملات المالية</h1>
                    <div className="mb-6 w-full max-w-sm relative">
                        <input
                            type="text"
                            placeholder="ابحث عن المعاملة..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">نوع المعاملة</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">المبلغ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">التاريخ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map(transaction => (
                                    <tr key={transaction.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{transaction.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{transaction.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{transaction.amount.toLocaleString()} ر.س</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{transaction.date}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${transaction.status === 'مكتمل' ? 'text-green-600' : transaction.status === 'قيد التنفيذ' ? 'text-yellow-600' : 'text-red-600'}`}>{transaction.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                            <button onClick={() => handleView(transaction.id)} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => handleEdit(transaction.id)} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(transaction.id)} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-gray-500">لا توجد معاملات مطابقة لعملية البحث</td>
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