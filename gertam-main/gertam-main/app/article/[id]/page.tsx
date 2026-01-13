"use client";
import React from "react";
import { useGetArticleById } from "@/hooks/articles/useArticles";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Article({ params }: Props) {
  const { id } = React.use(params);
  const { data } = useGetArticleById(Number(id));

  if (!data) return <p className="text-center text-gray-500 py-20">جاري التحميل...</p>;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-md overflow-hidden">
        {/* صورة الغلاف */}
        {data.image_url && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden">
            <img
              src={data.image_url}
              alt={data.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {data.title}
              </h1>
              {data.subTitle && (
                <p className="text-gray-200 text-sm md:text-base">{data.subTitle}</p>
              )}
            </div>
          </div>
        )}

        {/* محتوى المقال */}
        <div className="p-6 md:p-10">
          <article className="prose dark:prose-invert max-w-none prose-lg">
            <div dangerouslySetInnerHTML={{ __html: data.content }} />

          </article>

          {/* قسم الكاتب أو التذييل */}
          <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
            <div>
              <p>كاتب المقال: <span className="font-medium text-gray-700 dark:text-gray-200">إدارة الموقع</span></p>
              <p>تاريخ النشر: {new Date().toLocaleDateString("ar-EG")}</p>
            </div>
            <a
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              ← عودة للمقالات
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
