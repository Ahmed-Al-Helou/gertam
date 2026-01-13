import React from 'react';
import { usdToSAR } from '@/app/utils/currency';

const orders = [
    { id: 101, customer: 'أحمد علي', product: 'منتج 1', quantity: 2, price: 150, status: 'تم الشحن' },
    { id: 102, customer: 'سارة محمد', product: 'منتج 2', quantity: 1, price: 250, status: 'قيد الانتظار' },
    { id: 103, customer: 'خالد حسن', product: 'منتج 3', quantity: 5, price: 100, status: 'تم الدفع' },
    { id: 104, customer: 'ليلى كريم', product: 'منتج 4', quantity: 3, price: 300, status: 'ملغي' },
    { id: 105, customer: 'محمود نادر', product: 'منتج 5', quantity: 4, price: 200, status: 'تم الشحن' },
];

interface OrderData {
    id: number
    user_id: number
    name: string
    country: string
    email: string,
    city: string
    status: string,
    orderNotes: string[]
    phone: string
    streetAddress: string
    totlePrice: string
    created_at: string
    updated_at: string
}
export default function OrdersTable({orders} : {orders: OrderData[]}) {
    return (
        <div className="overflow-x-auto p-4 bg-white rounded-2xl shadow-md m-10">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">الطلبات الأخيرة</h2>
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">العميل</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">المنتج</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الكمية</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">السعر</th>
                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">الحالة</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{order.id}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{order.name}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{order.user_id}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{1}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">{usdToSAR(parseFloat(order.totlePrice))}</td>
                        <td className={`px-6 py-4 text-center whitespace-nowrap text-sm font-medium ${
                            order.status === 'تم الشحن' ? 'text-green-600' :
                                order.status === 'قيد الانتظار' ? 'text-yellow-600' :
                                    order.status === 'ملغي' ? 'text-red-600' : 'text-blue-600'
                        }`}>{order.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}