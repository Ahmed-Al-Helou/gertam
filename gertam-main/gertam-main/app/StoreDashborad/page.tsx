"use client"

import { useStore } from "@/hooks/chackStore/useStore";
import Loading from "../ui/loaders/Loading";
import { useState } from "react";
import Slidebar from "@/components/slidebar/slidebar";
import { useOverView } from "@/hooks/store/useOvreView";

interface StoreOverviewData {
  profits?: number;
  totle?: number;
  ordersCount?: number;
  ordersCountByStatus?: {
    processing?: number;
    canceled?: number;
    completed?: number;
  };
  lastOrders?: Array<{
    id: number;
    name: string;
    status: string;
    totlePrice: number;
  }>;
}

const sidebarLinks = ["Dashboard", "Users", "Orders", "Products", "Settings"];



const notifications = [
  "  لا يوجد اشعارات ",

];

const Dashboard = () => {

  const {data, isLoading, error} = useOverView();

  if(isLoading) return "جار ي التحميل ";
  

  const storeData = (data as StoreOverviewData) || {};
  const statsData = [
    { title: "الرصيد", value: `$${Number(storeData.profits ?? 0).toFixed(2)}`, color: "bg-green-500" },
  { title: "المبيعات", value: `$${Number(storeData.totle ?? 0).toFixed(2)}`, color: "bg-blue-400" },
  { title: "الطلبات", value: `${Number(storeData.ordersCount ?? 0)}`, color: "bg-purple-500" },
  { title: "قيد المعالجه", value: `${Number(storeData.ordersCountByStatus?.processing ?? 0)}`, color: "bg-yellow-500" },
  { title: "ملغي", value: `${Number(storeData.ordersCountByStatus?.canceled ?? 0)}`, color: "bg-red-500" },
  { title: "مكتمل", value: `${Number(storeData.ordersCountByStatus?.completed ?? 0)}`, color: "bg-blue-900" },
];

  return (
   <>
   <Slidebar>
     <div className="flex h-screen bg-gray-100 font-sans" dir="rtl">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
       

        {/* Stats cards */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-gray-500">{stat.title}</h3>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <div className={`h-2 ${stat.color} rounded mt-4 w-1/2 animate-pulse`}></div>
            </div>
          ))}
        </main>

        {/* Notifications & Table */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications */}
          <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">الإشعارات</h3>
            <ul className="flex flex-col gap-2">
              {notifications.map((note, idx) => (
                <li
                  key={idx}
                  className="bg-indigo-50 text-indigo-700 p-2 rounded shadow-sm hover:bg-indigo-100 transition"
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">آخر الطلبات</h3>
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">الطلب</th>
                  <th className="p-2">المستخدم</th>
                  <th className="p-2">الحالة</th>
                  <th className="p-2">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {storeData.lastOrders && storeData.lastOrders.length > 0 && storeData.lastOrders.map((item: any) => item && (
                  <tr className="border-b hover:bg-gray-50 transition" key={item.id}>
                    <td className="p-2">#{item.id}</td>
                    <td className="p-2"> {item.name}</td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2">${Number(item.totlePrice).toFixed(2)}</td>
                  </tr>
                ))}
                
              </tbody>
            </table>
          </div>
        </div>

      
      </div>
    </div>
    </Slidebar>
   </>
  );
}



const DashboardPage = () => {

    const {authenticated, loading, error} = useStore();
    if(loading) return <Loading />
    if(!authenticated) location.href = "/Login";
    return (
        <div>
            <Dashboard />
        </div>
    );
};

export default DashboardPage;

