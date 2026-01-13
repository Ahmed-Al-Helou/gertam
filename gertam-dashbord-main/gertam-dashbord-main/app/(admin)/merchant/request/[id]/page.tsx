"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ToastProvider, { notifyError, notifySuccess } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";



type PopUpWindowProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  reason?: string;
  setReason?: React.Dispatch<React.SetStateAction<string>>;
};
const PopUpWindow = ({ open, onClose, title, message, confirmText, cancelText, onConfirm, reason, setReason }: PopUpWindowProps) => {

  if(!open) return null;
  return (
<div className="fixed inset-0 flex items-center justify-center z-50">
    {/* الخلفية */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />
    {/* المحتوى */}
    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        سبب رفض الطلب
      </h2>

      


      <textarea
          value={reason}
          onChange={(e) => setReason?.(e.target.value)}
          placeholder="اكتب سبب الرفض هنا..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 resize-none"
        />

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
        >
          إغلاق
        </button>
        {onConfirm && (
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            تأكيد
          </button>
        )}
      </div>
    </div>
  </div>
    );
}

export default function MerchantDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [reason, setReason] = useState("");
  useEffect(() => {
    async function fetchMerchant() {
      try {
        // استبدل هذا بعنوان API الحقيقي أو Firebase
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/merchant/request/${id}`, {
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        const data = await res.json();
        setMerchant(data.merchant);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchMerchant();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">جار التحميل...</p>
      </div>
    );

  if (!merchant)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">الطلب غير موجود</p>
      </div>
    );

    const approveMerchantRequset = async (id: number) =>{
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/merchant/approve/${id}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const data = await res.json();
        } catch (err) {
        }
    }

    const rejectMerchantRequset = async (id: number) =>{


        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/merchant/reject/${id}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ reason })
            });
            const data = await res.json();
            if(res.ok){
              notifySuccess("تمت العملية بنجاح!");
              setTimeout(() => {
                router.push("/merchant/request");
              }, 1000);
            }else{
              notifyError(data.message || "حدث خطأ في العملية!");
            }
        } catch (err) {
        }
    }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10 border border-gray-200">
      <ToastProvider />
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        تفاصيل طلب التاجر رقم {merchant.id}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p>
            <span className="font-semibold text-gray-700">الاسم الكامل:</span>{" "}
            {merchant.full_name}
          </p>
          <p>
            <span className="font-semibold text-gray-700">اسم المتجر:</span>{" "}
            {merchant.store_name}
          </p>
          <p>
            <span className="font-semibold text-gray-700">البريد الإلكتروني:</span>{" "}
            {merchant.email}
          </p>
          <p>
            <span className="font-semibold text-gray-700">الهاتف:</span>{" "}
            {merchant.phone}
          </p>
          <p>
            <span className="font-semibold text-gray-700">تاريخ الطلب:</span>{" "}
            {new Date(merchant.created_at).toLocaleString("ar-EG")}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-2">الوثائق:</h2>
          {merchant.documents.length === 0 ? (
            <p className="text-gray-500">لا توجد ملفات مرفقة</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {merchant.documents.map((doc: any, idx: number) => (
                <div key={idx} className="text-center">
                  {doc.type.includes("image") ? (
                    <img
                      src={doc.path}
                      alt={doc.name}
                      className="w-28 h-28 object-cover rounded-lg border"
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
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => approveMerchantRequset(merchant.id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          اعتماد
        </button>
        <button
          onClick={() => setOpenPopUp(true)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          رفض
        </button>
        <PopUpWindow open={openPopUp} onClose={() => setOpenPopUp(false)} title="هل أنت متأكد من رفض هذا الطلب؟" message="سبب رفض الطلب" confirmText="تأكيد" cancelText="إلغاء" onConfirm={() => rejectMerchantRequset(merchant.id)} reason={reason} setReason={setReason} />
      </div>
    </div>
  );
}
