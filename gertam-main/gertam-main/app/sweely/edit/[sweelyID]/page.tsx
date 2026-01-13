"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useMerchantById } from "@/hooks/store/useMerchant";

export default function SweelyForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    storeName: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    taxNumber: "",
    nationalAddress: "",
    commercialRegistration: "",
    pledge: false,
    files: [] as File[],
  });

  const params = useParams();
  const sweelyID = params?.sweelyID as string;

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {data: merchantData, error: merchantError, isLoading: merchantLoading} = useMerchantById(sweelyID);

  const validate = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    if (!formData.storeName.trim()) newErrors.storeName = "اسم المتجر مطلوب";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "يرجى إدخال بريد إلكتروني صالح";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";
    if (!formData.idNumber.trim()) newErrors.idNumber = "رقم الهوية أو الجواز مطلوب";
    if (!formData.pledge)
      newErrors.pledge = "يجب تأكيد التعهد بصحة البيانات";

    return newErrors;
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? Array.from(files) : value,
    }));
  };

const handleSubmit = async (e: any) => {
  e.preventDefault();
  const newErrors = validate();
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  setLoading(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("storeName", formData.storeName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("idNumber", formData.idNumber);
    formDataToSend.append("taxNumber", formData.taxNumber || "");
    formDataToSend.append("nationalAddress", formData.nationalAddress || "");
    formDataToSend.append("commercialRegistration", formData.commercialRegistration || "");
    formDataToSend.append("pledge", formData.pledge ? "true" : "false");
    formDataToSend.append("_method", "POST");

    for (let i = 0; i < formData.files.length; i++) {
      formDataToSend.append("files[]", formData.files[i]);
    }

    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/merchant/${sweelyID}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type manually!
      },
      body: formDataToSend,
    });

    const json = await res.json();

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert(json.message || "خطأ في التحديث");
    }
  } catch (err) {
    alert("حدث خطأ في الاتصال بالخادم.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    if (merchantData && merchantData.merchant) {
      const merchant = merchantData.merchant;
      setFormData({
        fullName: merchant.full_name || "",
        storeName: merchant.store_name || "",
        email: merchant.email || "",
        phone: merchant.phone || "",
        address: merchant.address || "",
        idNumber: merchant.id_number || "",
        taxNumber: merchant.tax_number || "",
        nationalAddress: merchant.national_address || "",
        commercialRegistration: merchant.commercial_registration || "",
        pledge: merchant.pledge === 1 || merchant.pledge === true,
        files: [], // Files are already uploaded, empty array for new files
      });
    }
  }, [merchantData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-4xl w-full bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -z-0"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">
            تعديل بيانات التاجر في منصة Gertam
          </h1>
          <p className="text-gray-500 text-center mb-8">قم بتحديث البيانات أدناه</p>
          
          {merchantLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          )}
          
          {merchantError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600">خطأ في تحميل البيانات: {merchantError}</p>
            </div>
          )}

        {!merchantLoading && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-base md:text-lg relative z-10"
          dir="rtl"
        >
          {[
            { label: "الاسم الكامل للتاجر", name: "fullName" },
            { label: "اسم المتجر المقترح", name: "storeName" },
            { label: "البريد الإلكتروني الرسمي", name: "email", type: "email" },
            { label: "رقم الهاتف", name: "phone", type: "tel" },
            { label: "العنوان الكامل", name: "address", full: true },
            { label: "رقم الهوية أو جواز السفر", name: "idNumber" },
            { label: "الرقم الضريبي (اختياري)", name: "taxNumber" },
            { label: "العنوان الوطني", name: "nationalAddress" },
            { label: "السجل التجاري", name: "commercialRegistration" },
          ].map(({ label, name, type = "text", full }) => (
            <div key={name} className={full ? "md:col-span-2" : ""}>
              <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">{label}</label>
              <input
                name={name}
                type={type}
                value={(formData as any)[name]}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300 text-gray-800 placeholder-gray-400"
                placeholder={`أدخل ${label.toLowerCase()}`}
              />
              {errors[name] && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1.5 font-medium flex items-center gap-1"
                >
                  <span>⚠️</span>
                  {errors[name]}
                </motion.p>
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">
              تحميل المستندات الرسمية (PDF أو صورة واضحة)
            </label>
            <div className="relative">
              <input
                name="files"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            {formData.files.length > 0 && (
              <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                <span>📎</span>
                تم اختيار {formData.files.length} ملف جديد
              </p>
            )}
            {merchantData?.merchant?.documents && Array.isArray(merchantData.merchant.documents) && merchantData.merchant.documents.length > 0 && (
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                <span>📋</span>
                يوجد {merchantData.merchant.documents.length} ملف مرفوع مسبقاً
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all duration-200">
            <input
              type="checkbox"
              name="pledge"
              checked={formData.pledge}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-0.5 cursor-pointer flex-shrink-0"
            />
            <label className="text-gray-700 text-sm md:text-base cursor-pointer leading-relaxed">
              أتعهد بصحة جميع البيانات المقدمة وأتحمل المسؤولية القانونية في حال وجود أي
              تزوير أو تلاعب.
            </label>
          </div>
          {errors.pledge && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm md:col-span-2 font-medium flex items-center gap-1"
            >
              <span>⚠️</span>
              {errors.pledge}
            </motion.p>
          )}

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white text-lg md:text-xl font-semibold py-4 md:py-5 rounded-xl transition-all duration-300 transform ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري الإرسال...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>💾</span>
                  حفظ التغييرات
                </span>
              )}
            </button>
          </div>
        </form>
        )}
        </div>

        {/* ✅ Success Popup Animation */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSubmitted(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-md w-full relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative gradient background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.1 
                    }}
                    className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white text-4xl font-bold">✓</span>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3"
                  >
                    تم تحديث بياناتك بنجاح
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed"
                  >
                    تم حفظ التغييرات بنجاح. سيتم مراجعة البيانات المحدثة قريبًا.
                  </motion.p>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setSubmitted(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-3.5 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    حسناً
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
