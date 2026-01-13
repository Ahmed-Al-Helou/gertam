"use client"

import TooleBar from "@/componets/tooleBar/TooleBar";
import { useState, useMemo } from "react";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  image: string;
  content: string;
}

interface FormData {
  title: string;
  image: string;
  content: string;
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: "مقدمة في أمن المعلومات",
    image: "https://picsum.photos/seed/1/400/250",
    content: "هذا نص تجريبي يشرح أساسيات أمن المعلومات وكيف تحمي نظامك من الهجمات الشائعة."
  },
  {
    id: 2,
    title: "كيف تبدأ تعلم لغة C",
    image: "https://picsum.photos/seed/2/400/250",
    content: "شرح خطوة بخطوة للمبتدئين. تغطية المدخلات والمخرجات والعمليات الحسابية والمنطقية."
  },
  {
    id: 3,
    title: "دليل تركيب سيرفر VPS",
    image: "https://picsum.photos/seed/3/400/250",
    content: "إرشادات سريعة لتثبيت بيئة عمل، جدار ناري، وإعدادات أمان أساسية على VPS."
  },
  {
    id: 4,
    title: "أدوات اختبار الاختراق",
    image: "https://picsum.photos/seed/4/400/250",
    content: "نظرة على الأدوات المشهورة لاختبار الاختراق وكيفية استخدامها بشكل أخلاقي."
  }
];

function truncate(text: string, n: number = 50): string {
  if (!text) return "";
  return text.length > n ? text.slice(0, n) + "..." : text;
}

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Article | null>(null);
  const [viewing, setViewing] = useState<Article | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ title: "", image: "", content: "" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
    );
  }, [articles, query]);

  function handleDelete(id: number): void {
    if (!confirm("هل تريد حذف المقال؟")) return;
    setArticles(prev => prev.filter(a => a.id !== id));
  }

  function openEdit(article: Article): void {
    setEditing(article);
    setForm({ title: article.title, image: article.image, content: article.content });
    setNewOpen(false);
  }

  function saveEdit(): void {
    if (!editing) return;
    setArticles(prev =>
      prev.map(a => (a.id === editing.id ? { ...a, ...form } : a))
    );
    setEditing(null);
    setForm({ title: "", image: "", content: "" });
  }

  function openNew() {
    setNewOpen(true);
    setEditing(null);
    setForm({ title: "", image: "", content: "" });
  }

  function saveNew() {
    if (!form.title.trim()) {
      alert("العنوان مطلوب");
      return;
    }
    const id = Math.max(0, ...articles.map(a => a.id)) + 1;
    setArticles(prev => [{ id, ...form, image: form.image || `https://picsum.photos/seed/${id}/400/250` }, ...prev]);
    setNewOpen(false);
    setForm({ title: "", image: "", content: "" });
  }

  return (
    <>
    <TooleBar />
    <div className="min-h-screen bg-gray-50 p-6 Container">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">لوحة إدارة المقالات</h1>

          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالعنوان أو النص..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="px-4 py-2 border rounded-md w-72 focus:outline-none focus:ring"
              />
            </div>

            <button
              onClick={openNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              أضف مقال جديد
            </button>
          </div>
        </header>

        {/* Edit / New form */}
        {(editing || newOpen) && (
          <div className="mb-6 p-4 bg-white border rounded-md shadow-sm">
            <h2 className="font-medium mb-3">{editing ? "تعديل المقال" : "مقال جديد"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="col-span-1 md:col-span-1 px-3 py-2 border rounded"
                placeholder="العنوان"
                value={form.title}
                onChange={e => setForm(s => ({ ...s, title: e.target.value }))}
              />
              <input
                className="col-span-1 md:col-span-1 px-3 py-2 border rounded"
                placeholder="رابط الصورة (اختياري)"
                value={form.image}
                onChange={e => setForm(s => ({ ...s, image: e.target.value }))}
              />
              <input
                className="col-span-1 md:col-span-1 px-3 py-2 border rounded"
                placeholder="المحتوى"
                value={form.content}
                onChange={e => setForm(s => ({ ...s, content: e.target.value }))}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={editing ? saveEdit : saveNew}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                حفظ
              </button>
              <button
                onClick={() => { setEditing(null); setNewOpen(false); setForm({ title: "", image: "", content: "" }); }}
                className="px-3 py-2 border rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Grid of articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <article key={article.id} className="bg-white rounded shadow-sm overflow-hidden flex flex-col">
              <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-1">{truncate(article.content, 50)}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setViewing(article)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    عرض
                  </button>

                  <Link
                    href={`/articeles/edit/${article.id}`}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    تعديل
                  </Link>

                  <button
                    onClick={() => handleDelete(article.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              لا يوجد مقالات مطابقة للبحث.
            </div>
          )}
        </div>
      </div>

      {/* View modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white max-w-2xl w-full rounded p-4">
            <div className="flex justify-between items-start gap-3">
              <h3 className="text-xl font-semibold">{viewing.title}</h3>
              <button onClick={() => setViewing(null)} className="text-gray-500">اغلاق</button>
            </div>
            <img src={viewing.image} alt="" className="w-full h-48 object-cover mt-3 rounded" />
            <p className="mt-3 text-gray-700">{viewing.content}</p>
            <div className="mt-4 text-right">
              <button onClick={() => setViewing(null)} className="px-3 py-2 border rounded">اغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>

  );
}
