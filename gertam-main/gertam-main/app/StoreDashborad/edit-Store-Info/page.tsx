"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditStorePage() {
  const [store, setStore] = useState({ name: "", logo: "", store_picture: "" });
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [tempName, setTempName] = useState("");
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // جلب بيانات المتجر
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/storeInfo`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const data = await res.json();
      setStore({
        name: data?.name || "متجري الجميل",
        logo: data?.logo || "/no-image.jpeg",
        store_picture: data?.store_picture || "/no-image.jpeg",
      });
      setTempName(data?.name || "متجري الجميل");
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", store.name);
      if (newLogo) formData.append("logo", newLogo);
      if (newPicture) formData.append("store_picture", newPicture);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/editStoreInfo`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("خطأ أثناء الحفظ");
      setToast({ type: "success", msg: "تم حفظ التعديلات ✅" });
      setChanged(false);
    } catch {
      setToast({ type: "error", msg: "تعذر الحفظ ❌" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-white shadow-sm px-6 py-3 sticky top-0 z-50 max-w-7xl mx-auto rounded-b-xl">
  {/* اليسار: اللوغو واسم لوحة التحكم */}
  <div className="flex items-center gap-3">
    <img
      src={newLogo ? URL.createObjectURL(newLogo) : store.logo || "/no-image.jpeg"}
      alt="logo"
      className="w-10 h-10 rounded-full object-cover border border-gray-200"
    />
    <span className="font-semibold text-gray-700 text-lg">لوحة إدارة المتجر</span>
  </div>

  {/* الوسط: البحث */}
  <div className="flex-1 mx-6 max-w-md">
    <input
      type="text"
      placeholder="ابحث عن منتج، طلب أو إعداد..."
      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm bg-white"
    />
  </div>

  {/* اليمين: اسم المتجر */}
  <div className="font-semibold text-gray-700 text-lg whitespace-nowrap">{store.name}</div>
</header>


      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 px-5 py-3 rounded-xl text-white shadow-md ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Cover Image */}
<div className="relative h-60 bg-gray-100">
  <img
    src={newPicture ? URL.createObjectURL(newPicture) : store.store_picture || "/no-image.jpeg"}
    alt="store cover"
    className="object-cover w-full h-full"
  />

  {/* زر تغيير الغلاف في الزاوية اليمنى */}
  <div className="absolute bottom-3 right-3 w-36">
    {/* input يغطي كامل مساحة الزر وشفاف */}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        setNewPicture(e.target.files?.[0] || null);
        setChanged(true);
      }}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
    />
    {/* العنصر المرئي أسفل الـ input */}
    <div className="relative bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-md text-center text-sm">
      تغيير الغلاف
    </div>
  </div>
</div>




          {/* Logo & Editable Name */}
          <div className="relative -mt-16 flex flex-col items-center pb-10 px-6">
           <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-200 cursor-pointer">
  <img
    src={newLogo ? URL.createObjectURL(newLogo) : store.logo || "/no-image.jpeg"}
    alt="Logo"
    className="object-cover w-full h-full"
  />
  {/* زر يغطي الصورة كاملة */}
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      setNewLogo(e.target.files?.[0] || null);
      setChanged(true);
    }}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  />
</div>


            {/* تعديل الاسم مباشر */}
            <div className="mt-6 text-center w-full">
              <input
                type="text"
                value={tempName}
                onChange={(e) => {
                  setTempName(e.target.value);
                  setStore((prev) => ({ ...prev, name: e.target.value }));
                  setChanged(true);
                }}
                className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 outline-none bg-transparent text-center focus:border-blue-600 transition w-full"
              />
              <p className="text-gray-500 text-sm mt-1">اسم المتجر</p>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <AnimatePresence>
          {changed && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={handleSave}
              disabled={saving}
              className="mt-8 bg-blue-600 text-white font-medium px-8 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
            >
              {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
