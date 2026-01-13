"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Editor } from "@tinymce/tinymce-react"

interface FormData {
  title: string;
  subtitle: string;
  image: string;
  content: string;
}

export default function NewArticlePage() {
  const [form, setForm] = useState<FormData>({
    title: "",
    subtitle: "",
    image: "",
    content: "",
  })
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (key: keyof FormData, value: string): void =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      handleChange("image", result) // تخزين الصورة كـ base64 (للاستخدام لاحقًا في التخزين الفعلي)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async(e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try{
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('subtitle', form.subtitle);
        formData.append('content', form.content);
        
        // Get the actual file from the input element
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            formData.append('image', fileInput.files[0]);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/createArticle`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
            },
            body: formData, // Send as FormData instead of JSON
        });
        if(!res.ok) throw new Error('فشل في إضافة المقال');
        alert('تم إضافة المقال بنجاح!');
        setForm({ title: "", subtitle: "", image: "", content: "" });
        setPreview(null);
    }catch(err: unknown){
        const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          إضافة مقال جديد
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* العنوان الرئيسي */}
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

          {/* العنوان الفرعي */}
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

          {/* رفع الصورة */}
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

          {/* محتوى المقال */}
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
                images_upload_handler: (blobInfo: any, success: (url: string) => void, failure: (err: string) => void) => {
                  // رفع الصورة داخل المحتوى (base64)
                  const reader = new FileReader()
                  reader.onload = () => success(reader.result as string)
                  reader.onerror = () => failure("فشل رفع الصورة")
                  reader.readAsDataURL(blobInfo.blob())
                },
              }}
              onEditorChange={value => handleChange("content", value)}
            />
          </div>

          {/* زر الحفظ */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              حفظ المقال
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
