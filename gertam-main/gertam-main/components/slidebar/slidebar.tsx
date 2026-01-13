import { useState } from "react";
import Link from "next/link";

// Sidebar-Component-Nextjs-Tailwind.jsx
// مكون شريط جانبي (Slide Bar) متوافق مع Next.js و Tailwind CSS
// ميزات:
// - متجاوب: يظهر كدرّاج (drawer) على الشاشات الصغيرة ويثبت على الشاشات الكبيرة
// - قائمة منسدلة مثال: الطلبات -> (إنشاء طلب، حذف طلب، كل الطلبات)
// - دعم RTL (يمكن تمرير dir="rtl" للمحتوى الأعلى أو تفعيل direction في html)
// - استخدمه داخل pages/_app.jsx أو في صفحة مباشرة لتغليف المحتوى

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false); // فتح السايدبار على الموبايل
  const [requestsOpen, setRequestsOpen] = useState(false); // قائمة الطلبات المنسدلة
  const [productOpen, setProductOpen] = useState(false); // قائمة الطلبات المنسدلة

  return (
    <div className="min-h-screen flex bg-gray-50" dir="rtl">
      {/* Overlay للهواتف */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 rigth-0 h-full w-72 transform bg-white border-r shadow-lg transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
        aria-label="الشريط الجانبي"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-semibold">ع</div>
            <div>
              <h1 className="text-lg font-semibold">لوحة التحكم</h1>
              <p className="text-sm text-gray-500">مرحباً بك</p>
            </div>
          </div>
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setOpen(false)}
            aria-label="إغلاق الشريط" 
          >
            {/* X icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="px-3 py-6 space-y-2">
          <Link href="/StoreDashborad" className="block px-3 py-2 rounded-md hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              <span className="text-gray-800">الرئيسية</span>
            </div>
          </Link>

          {/* Dropdown: الطلبات */}
          <div className="px-1">
            <button
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
              onClick={() => setRequestsOpen((s) => !s)}
              aria-expanded={requestsOpen}
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
                </svg>
                <span className="text-gray-800">الطلبات</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${requestsOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`mt-2 pl-7 pr-2 space-y-1 overflow-hidden transition-[max-height] duration-300 ${requestsOpen ? "max-h-40" : "max-h-0"}`}>
              <Link href="/StoreDashborad/orders" className="block px-3 py-2 rounded-md text-base text-gray-800 hover:bg-gray-100">كل الطلبات</Link>
            </div>
          </div>

          {/* Products*/}
          <div className="px-1">
            <button
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
              onClick={() => setProductOpen((s) => !s)}
              aria-expanded={productOpen}
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
                </svg>
                <span className="text-gray-800">المنتجات </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${productOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`mt-2 pl-7 pr-2 space-y-1 overflow-hidden transition-[max-height] duration-300 ${productOpen ? "max-h-40" : "max-h-0"}`}>
              <Link href="/StoreDashborad/add-product" className="block px-3 py-2 rounded-md text-base text-gray-800 hover:bg-gray-100"> اضافة منتج جديد </Link>
              <Link href="/StoreDashborad/products" className="block px-3 py-2 rounded-md text-base text-gray-800 hover:bg-gray-100"> كل المنتجات </Link>
            </div>
          </div>

          <Link href="#" className="block px-3 py-2 rounded-md hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2s3-.895 3-2s-1.343-2-3-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
              </svg>
              <span className="text-gray-800">الإعدادات</span>
            </div>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="text-sm text-gray-600">مسجل باسم:</div>
          <div className="text-sm font-medium"> مدير متجر </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 md:pr-72">
        {/* Topbar for small screens */}
        <header className="flex items-center justify-between bg-white shadow-sm px-4 py-3 md:hidden">
          <button
            className="p-2 rounded-md"
            onClick={() => setOpen(true)}
            aria-label="فتح الشريط الجانبي"
          >
            {/* Menu icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 text-center"> 
            <h2 className="text-lg font-semibold">لوحة التحكم</h2>
          </div>

          <div className="w-10" />
        </header>

        <main className="p-6">{children ?? <div className="text-gray-700">المحتوى هنا</div>}</main>
      </div>
    </div>
  );
}
