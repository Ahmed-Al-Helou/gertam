"use client"
import { getAllArticles } from "@/hooks/articles/getAllArticels";
import React, { useState } from "react";
import Loading from "../ui/loaders/Loading";


type articlesData = {
  id: number
  title: string
  subtitle?: string
  image_url: string
  content: string
  created_at?: string | number
}



export default  function ArticlesPage() {
  // البيانات يمكن استدعاؤها هنا مباشرة




  const {data:articles, loading} = getAllArticles();

if(loading) return <Loading />


  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6  md:p-12" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              مقالات
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              مجموعة من المقالات مرتبة بشكل عصري وقابلة للتخصيص.
            </p>
          </div>
        </header>
        {/* إعلان كبير في الأعلى */}
<section className="relative mb-10 rounded-3xl overflow-hidden shadow-lg">
  <img
    src="https://images.pexels.com/photos/7541343/pexels-photo-7541343.jpeg"
    alt="إعلان"
    className="w-full h-64 md:h-80 object-cover"
  />
  <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6">
    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
      اعلن هنا 
    </h2>
    <p className="text-gray-200 text-sm md:text-lg max-w-2xl">
      يمكنك وضع وصف مختصر أو عرض خاص أو رابط تسويقي هنا لجذب الانتباه.
    </p>
    <a
      href="#"
      className="mt-5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition"
    >
      شاهد التفاصيل
    </a>
  </div>
</section>


        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a:articlesData) => (
            <article
              key={a.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="relative h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={a.image_url}
                  alt={a.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    ثقافي
                </span>
              </div>

              <div className="p-4 md:p-5">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {a.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {a.subtitle}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      ادارة الموقع
                    </p>
                    <p className="text-xs">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString("ar-EG") : "غير محدد"}
                    </p>
                  </div>

                  <a
                    href={`/article/${a.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium"
                  >
                    اقرأ
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
