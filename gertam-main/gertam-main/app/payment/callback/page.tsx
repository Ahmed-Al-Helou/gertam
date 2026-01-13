"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navabr";
import Footer from "@/components/Footer/footer";
import Loading from "@/app/ui/loaders/Loading";

const PaymentCallback = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("جاري معالجة الدفع...");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the raw search string and handle %26 encoding
        const rawSearch = window.location.search;
        let orderId: string | null = null;
        let paymentId: string | null = null;

        if (rawSearch) {
          // Remove the leading ?
          const params = rawSearch.substring(1);
          
          // Split by & or %26
          const paramPairs = params.split(/[&%26]+/);
          
          for (const pair of paramPairs) {
            const [key, value] = pair.split('=');
            if (key === 'order_id') {
              orderId = decodeURIComponent(value || '');
            } else if (key === 'payment_id') {
              paymentId = decodeURIComponent(value || '');
            }
          }
        }

        setOrderId(orderId);

        if (!orderId || !paymentId) {
          setStatus("failed");
          setMessage("بيانات الدفع غير صحيحة");
          return;
        }

        // Call backend to verify payment status
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/payment/callback?order_id=${orderId}&payment_id=${paymentId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === "success" || response.ok) {
          setStatus("success");
          setMessage("تم الدفع بنجاح! شكراً لك على طلبك.");
          setTimeout(() => {
            router.push("/order-success");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage("فشل في تأكيد الدفع. يرجى التواصل مع الدعم.");
        }
      } catch (error) {
        setStatus("failed");
        setMessage("حدث خطأ في معالجة الدفع.");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6">
          {status === "loading" && (
            <div className="text-center">
              <Loading />
              <p className="text-gray-600 mt-4">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                تم الدفع بنجاح
              </h2>
              <p className="text-gray-600">{message}</p>
              {orderId && (
                <p className="text-sm text-gray-500 mt-4">
                  رقم الطلب: {orderId}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                جاري التوجيه إلى صفحة تأكيد الطلب...
              </p>
            </div>
          )}

          {status === "failed" && (
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-red-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0-6a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                خطأ في الدفع
              </h2>
              <p className="text-gray-600">{message}</p>
              {orderId && (
                <p className="text-sm text-gray-500 mt-4">
                  رقم الطلب: {orderId}
                </p>
              )}
              <button
                onClick={() => router.push("/Checkout")}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                العودة للدفع
              </button>
              <button
                onClick={() => router.push("/")}
                className="mt-3 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentCallback;
