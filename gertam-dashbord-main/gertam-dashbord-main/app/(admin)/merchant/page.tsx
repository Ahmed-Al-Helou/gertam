'use client';
import TooleBar from "@/componets/tooleBar/TooleBar";
import { useEffect, useState } from "react";

type Merchant = {
  id: number;
  full_name: string;
  store_name: string;
  email: string;
  phone: string;
  address: string;
  pledge: number;
  created_at: string;
};

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/merchants?approved=1`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMerchants(data.merchants || []);
      }
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
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
        <h1 className="text-2xl font-bold mb-4">التجار المعتمدين</h1>

        {loading ? (
          <p>جاري التحميل...</p>
        ) : merchants.length === 0 ? (
          <p className="text-gray-500">لا يوجد تجار معتمدين</p>
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
                  <th className="py-3 px-4 text-center border-b">العنوان</th>
                  <th className="py-3 px-4 text-center border-b">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr
                    key={merchant.id}
                    className="hover:bg-gray-50 border-b"
                  >
                    <td className="py-3 px-4 text-center">{merchant.id}</td>
                    <td className="py-3 px-4 text-center">{merchant.full_name}</td>
                    <td className="py-3 px-4 text-center">{merchant.store_name}</td>
                    <td className="py-3 px-4 text-center">{merchant.email}</td>
                    <td className="py-3 px-4 text-center">{merchant.phone}</td>
                    <td className="py-3 px-4 text-center">{merchant.address}</td>
                    <td className="py-3 px-4 text-center">
                      {new Date(merchant.created_at).toLocaleDateString("ar-SA")}
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
