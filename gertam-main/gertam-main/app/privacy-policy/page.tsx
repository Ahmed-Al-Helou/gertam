"use client";

import Navbar from "@/components/Navbar/Navabr";
import Footer from "@/components/Footer/footer";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            سياسة الخصوصية
          </h1>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700" dir="rtl">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. مقدمة
              </h2>
              <p>
                نحن نلتزم بحماية خصوصيتك وضمان فهمك لكيفية استخدام بيانات الموقع.
                تغطي سياسة الخصوصية هذه جميع المعلومات التي قد تجمعها منصتنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. المعلومات التي نجمعها
              </h2>
              <p>
                نجمع المعلومات التالية عندما تستخدم خدماتنا:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>المعلومات الشخصية: الاسم والبريد الإلكتروني ورقم الهاتف والعنوان</li>
                <li>معلومات الحساب: اسم المستخدم وكلمة المرور</li>
                <li>معلومات المعاملات: سجل الشراء وطرق الدفع</li>
                <li>معلومات الجهاز: نوع المتصفح والعنوان IP ونوع الجهاز</li>
                <li>بيانات الاستخدام: سلوك التصفح والصفحات التي تزارها</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. كيفية استخدام معلوماتك
              </h2>
              <p>
                نستخدم المعلومات التي نجمعها للأغراض التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>توفير وتحسين خدماتنا</li>
                <li>معالجة المعاملات والدفع</li>
                <li>إرسال التنبيهات والتحديثات والإخطارات</li>
                <li>الرد على استفساراتك والدعم العملاء</li>
                <li>تحليل الاستخدام وتحسين أداء الموقع</li>
                <li>الامتثال للالتزامات القانونية</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. أمان البيانات
              </h2>
              <p>
                نتخذ احتياطات معقولة لحماية معلوماتك من الفقدان والسرقة والاستخدام غير المصرح.
                ومع ذلك، لا يمكن لأي نظام أن يكون آمنًا تماماً. إذا كنت قلقًا بشأن أمان
                معلوماتك، يرجى الاتصال بنا على الفور.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. مشاركة المعلومات
              </h2>
              <p>
                نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقتك،
                باستثناء الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>عندما يكون ذلك ضروريًا لتقديم الخدمة</li>
                <li>امتثالاً للقانون أو الأوامر القانونية</li>
                <li>حماية حقوقنا والآخرين</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. ملفات تعريف الارتباط
              </h2>
              <p>
                يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم. يمكنك تعطيل ملفات
                تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. حقوقك
              </h2>
              <p>
                لديك الحق في:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>الوصول إلى بياناتك الشخصية</li>
                <li>تصحيح البيانات غير الدقيقة</li>
                <li>حذف بياناتك</li>
                <li>الاعتراض على معالجة بياناتك</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. التغييرات على هذه السياسة
              </h2>
              <p>
                قد نحدث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة
                مع تاريخ التحديث.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                9. تواصل معنا
              </h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على:
              </p>
              <ul className="list-none mt-4">
                <li>البريد الإلكتروني: privacy@alfaraa.com</li>
                <li>الهاتف: +966 XX XXX XXXX</li>
              </ul>
            </section>

            <section className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                آخر تحديث لهذه السياسة: نوفمبر 2025
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
