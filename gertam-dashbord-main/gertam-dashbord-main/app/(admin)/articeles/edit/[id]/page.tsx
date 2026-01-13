"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Editor } from "@tinymce/tinymce-react"
import { useRouter } from "next/navigation"
import TooleBar from "@/componets/tooleBar/TooleBar"

interface ArticleData {
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
}

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default function EditArticlePage({ params: paramsPromise }: EditArticlePageProps) {
  const params = React.use(paramsPromise)
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    content: "",
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL + '/articles/' + params.id)
        if (!res.ok) throw new Error('فشل في جلب بيانات المقال')
        const data: ArticleData = await res.json()
        setForm({
          title: data.title,
          subtitle: data.subtitle || "",
          content: data.content,
          image: "",
        })
        if (data.image_url) {
          setPreview(data.image_url)
        }
      } catch (err) {
        alert('حدث خطأ في جلب بيانات المقال')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [params.id])

  const handleChange = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      handleChange("image", result)
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return
    
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL + '/deleteArticle/' + params.id, {
        method: 'DELETE',
        headers: {
          authorization: 'Bearer ' + token,
        }
      })
      if (!res.ok) throw new Error('فشل في حذف المقال')
      alert('تم حذف المقال بنجاح')
      router.push('/articeles')
    } catch (err) {
      alert('حدث خطأ في حذف المقال')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('subtitle', form.subtitle)
      formData.append('content', form.content)
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput?.files?.[0]) {
        formData.append('image', fileInput.files[0])
      }

      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL + '/editArticle/' + params.id, {
        method: 'POST',
        headers: {
          authorization: 'Bearer ' + token,
        },
        body: formData,
      })
      
      if (!res.ok) throw new Error('فشل في تحديث المقال')
      alert('تم تحديث المقال بنجاح')
      router.push('/articeles')
    } catch (err) {
      alert('حدث خطأ في تحديث المقال')
    }
  }

  if (loading) return <div className="text-center p-12">جاري التحميل...</div>

  return (
    <>
      <TooleBar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">تعديل المقال</h1>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              حذف المقال
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">العنوان الرئيسي</label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleChange("title", e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                placeholder="اكتب عنوان المقال"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">العنوان الفرعي</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={e => handleChange("subtitle", e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                placeholder="اكتب عنواناً فرعياً يوضح الفكرة"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">صورة المقال</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-56 object-cover mt-3 rounded border"
                />
              )}
            </div>

            <div>
              <label className="block font-medium mb-2">محتوى المقال</label>
              <Editor
                apiKey="trny08dtbokj9ns2r9cxtjlzettzez133scpxjdjkepw377y"
                value={form.content}
                init={{
                  height: 450,
                  directionality: "rtl",
                  menubar: "edit insert format table tools",
                  plugins: [
                    "advlist autolink lists link image charmap preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste help wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | fontselect fontsizeselect | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image link | removeformat | code",
                  fontsize_formats:
                    "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                  images_upload_handler: (blobInfo: any, success: any, failure: any) => {
                    const reader = new FileReader()
                    reader.onload = () => success(reader.result)
                    reader.onerror = () => failure("فشل رفع الصورة")
                    reader.readAsDataURL(blobInfo.blob())
                  },
                }}
                onEditorChange={value => handleChange("content", value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}