"use client"
import TooleBar from "@/componets/tooleBar/TooleBar";
import Link from "next/link";
import { useEffect, useState } from "react";

type Document = {
  name: string;
  path: string;
  type: string;
};

type Merchant = {
  id: number;
  full_name: string;
  store_name: string;
  email: string;
  phone: string;
  address: string;
  id_number: string;
  tax_number: string;
  national_address: string;
  commercial_registration: string;
  pledge: boolean;
  documents: Document[];
  created_at: string;
};

export default function MerchantDashboard() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/merchants`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        // parse documents JSON
    
        setMerchants(data.merchants);
      }
    } catch (err) {
      alert("خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
   <>
   <TooleBar />
    <div className="p-6 Container">
      <h1 className="text-2xl font-bold mb-4">طلبات التاجر</h1>

      {loading ? (
        <p>جارٍ التحميل...</p>
      ) : (
        <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
    <thead>
      <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
        <th className="py-3 px-4 text-center border-b">ID</th>
        <th className="py-3 px-4 text-center border-b">الاسم الكامل</th>
        <th className="py-3 px-4 text-center border-b">اسم المتجر</th>
        <th className="py-3 px-4 text-center border-b">البريد الإلكتروني</th>
        <th className="py-3 px-4 text-center border-b">الهاتف</th>
        <th className="py-3 px-4 text-center border-b">الوثائق</th>
        <th className="py-3 px-4 text-center border-b">تاريخ الطلب</th>
        <th className="py-3 px-4 text-center border-b">الإجراءات</th>
      </tr>
    </thead>
    <tbody className="text-center text-gray-800">
      {merchants.map((m, i) => (
        <tr
          key={m.id}
          className={`hover:bg-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
        >
          <td className="py-2 px-4 border-b">{m.id}</td>
          <td className="py-2 px-4 border-b font-medium">{m.full_name}</td>
          <td className="py-2 px-4 border-b">{m.store_name}</td>
          <td className="py-2 px-4 border-b">{m.email}</td>
          <td className="py-2 px-4 border-b">{m.phone}</td>
          <td className="py-2 px-4 border-b">
            {m.documents.length === 0 ? (
              <span className="text-gray-500">لا توجد ملفات</span>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {m.documents.map((doc, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    {doc.type.includes("image") ? (
                      <img
                        src={doc.path}
                        alt={doc.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <a
                        href={doc.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        {doc.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </td>
          <td className="py-2 px-4 border-b text-sm text-gray-600">
            {new Date(m.created_at).toLocaleString("ar-EG")}
          </td>
          <td className="py-2 px-4 border-b space-x-2">
            <Link
              href={`/merchant/request/${m.id}`}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              عرض الطلب
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      )}
    </div>
   </>
  );
}
