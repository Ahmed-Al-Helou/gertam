"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar/Navabr";
import Footer from "@/components/Footer/footer";
import styles from "./help.module.css";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: "الحساب والتسجيل",
    question: "كيف أقوم بإنشاء حساب جديد؟",
    answer: "يمكنك إنشاء حساب جديد بالنقر على زر 'إنشاء حساب جديد' في صفحة تسجيل الدخول. ستحتاج إلى إدخال اسمك وبريدك الإلكتروني ورقم هاتفك وكلمة مرور آمنة.",
  },
  {
    id: 2,
    category: "الحساب والتسجيل",
    question: "هل نسيت كلمة المرور؟",
    answer: "إذا نسيت كلمة المرور، انقر على 'هل نسيت كلمة المرور؟' في صفحة تسجيل الدخول. أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور.",
  },
  {
    id: 3,
    category: "الحساب والتسجيل",
    question: "كيف يمكنني تحديث معلومات حسابي؟",
    answer: "انتقل إلى صفحة الملف الشخصي من خلال القائمة الرئيسية وانقر على 'تعديل الملف الشخصي'. يمكنك تحديث اسمك وصورتك ورقم هاتفك والعنوان.",
  },
  {
    id: 4,
    category: "الطلبات والشراء",
    question: "كيف أتتبع طلبي؟",
    answer: "يمكنك تتبع طلبك من خلال قسم 'تتبع الطلب' في الصفحة الرئيسية. أدخل رقم الطلب وستتمكن من رؤية حالته الحالية والموقع الجغرافي.",
  },
  {
    id: 5,
    category: "الطلبات والشراء",
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نقبل عدة طرق دفع آمنة منها: بطاقات الائتمان والخصم، التحويل البنكي، والدفع عند الاستلام في بعض المناطق.",
  },
  {
    id: 6,
    category: "الطلبات والشراء",
    question: "هل يمكنني إلغاء طلبي؟",
    answer: "نعم، يمكنك إلغاء طلبك قبل معالجته. انتقل إلى صفحة طلباتي واختر الطلب المراد إلغاؤه. إذا كان الطلب قد تم معالجته بالفعل، يرجى التواصل مع فريق الدعم.",
  },
  {
    id: 7,
    category: "المرتجعات والاسترداد",
    question: "ما هي سياسة الاسترجاع؟",
    answer: "يمكنك استرجاع المنتجات خلال 30 يوماً من تاريخ الاستلام بشرط أن تكون في حالة جديدة وغير مستخدمة مع جميع الملحقات الأصلية.",
  },
  {
    id: 8,
    category: "المرتجعات والاسترداد",
    question: "كيف أرسل منتجاً للاسترجاع؟",
    answer: "انتقل إلى صفحة طلباتي واختر المنتج المراد استرجاعه. املأ نموذج الاسترجاع وستتلقى عنوان إرسال المنتج برسالة بريد إلكتروني.",
  },
  {
    id: 9,
    category: "المرتجعات والاسترداد",
    question: "متى سأتلقى المبلغ المسترد؟",
    answer: "عادةً ما يتم استرجاع المبلغ خلال 5-10 أيام عمل بعد استلام المنتج والتحقق من حالته.",
  },
  {
    id: 10,
    category: "المنتجات",
    question: "كيف أبحث عن منتج معين؟",
    answer: "استخدم شريط البحث في الصفحة الرئيسية للبحث عن منتجات محددة. يمكنك أيضاً تصفح المنتجات حسب الفئات والعلامات التجارية.",
  },
  {
    id: 11,
    category: "المنتجات",
    question: "هل يمكنني حفظ منتجاتي المفضلة؟",
    answer: "نعم، انقر على رمز القلب على المنتج لإضافته إلى قائمة المفضلة. يمكنك الوصول إليها من صفحة المفضلة الخاصة بك.",
  },
  {
    id: 12,
    category: "التوصيل والشحن",
    question: "ما هي تكاليف الشحن؟",
    answer: "تختلف تكاليف الشحن حسب الموقع والوزن. ستتمكن من رؤية تكاليف الشحن قبل إكمال الطلب في صفحة الدفع.",
  },
  {
    id: 13,
    category: "التوصيل والشحن",
    question: "كم يستغرق التوصيل؟",
    answer: "يستغرق التوصيل عادةً من 3 إلى 7 أيام عمل حسب موقعك. يمكنك رؤية التاريخ المتوقع للتسليم عند الدفع.",
  },
  {
    id: 14,
    category: "الأمان والخصوصية",
    question: "هل بيانات حسابي آمنة؟",
    answer: "نعم، نستخدم تقنية التشفير الحديثة لحماية بيانات حسابك الشخصية. جميع المعاملات آمنة وسرية.",
  },
  {
    id: 15,
    category: "الأمان والخصوصية",
    question: "كيف تحمي منصتكم خصوصيتي؟",
    answer: "نحن نتبع سياسة خصوصية صارمة ولا نشارك بيانات حسابك مع أطراف ثالثة. اقرأ سياسة الخصوصية الكاملة على الموقع.",
  },
];

const FAQItem = ({ item }: { item: FAQItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}>
      <button
        className={styles.faqQuestion}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{item.question}</span>
        {isOpen ? (
          <MdExpandLess size={24} />
        ) : (
          <MdExpandMore size={24} />
        )}
      </button>
      {isOpen && (
        <div className={styles.faqAnswer}>
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
};

const CategorySection = ({
  category,
  items,
}: {
  category: string;
  items: FAQItem[];
}) => {
  return (
    <div className={styles.categorySection}>
      <h3 className={styles.categoryTitle}>{category}</h3>
      <div className={styles.faqList}>
        {items.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const Help = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  const filteredFaq = faqData.filter(
    (item) =>
      item.question.includes(searchQuery) ||
      item.answer.includes(searchQuery)
  );

  const categorizedFaq = categories.map((category) => ({
    category,
    items: filteredFaq.filter((item) => item.category === category),
  }));

  return (
    <>
      <Navbar />
      <div className={styles.helpContainer}>
        <div className={styles.heroSection}>
          <h1>مركز المساعدة والدعم الفني</h1>
          <p>نحن هنا لمساعدتك. اطرح أسئلتك واعثر على الإجابات التي تحتاجها</p>
        </div>

        <div className="container">
          {/* Search Bar */}
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="ابحث عن سؤال أو كلمة مفتاحية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Quick Links */}
          <div className={styles.quickLinksSection}>
            <h2>الفئات الرئيسية</h2>
            <div className={styles.quickLinks}>
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${category}`}
                  className={styles.quickLink}
                >
                  {category}
                </a>
              ))}
            </div>
          </div>

          {/* FAQ Sections */}
          <div className={styles.faqSections}>
            {categorizedFaq.map((section) =>
              section.items.length > 0 ? (
                <CategorySection
                  key={section.category}
                  category={section.category}
                  items={section.items}
                />
              ) : null
            )}

            {filteredFaq.length === 0 && searchQuery && (
              <div className={styles.noResults}>
                <p>لم نجد نتائج لبحثك. حاول استخدام كلمات مفتاحية أخرى.</p>
              </div>
            )}
          </div>

          {/* Contact Support Section */}
          <div className={styles.supportSection}>
            <h2>لم تجد إجابتك؟</h2>
            <p>تواصل مع فريق الدعم الفني الخاص بنا</p>

            <div className={styles.contactMethods}>
              <div className={styles.contactCard}>
                <FiMail size={32} />
                <h3>البريد الإلكتروني</h3>
                <p>support@alfaraa.com</p>
                <a href="mailto:support@alfaraa.com" className={styles.contactButton}>
                  أرسل بريد إلكتروني
                </a>
              </div>

              <div className={styles.contactCard}>
                <FiPhone size={32} />
                <h3>الهاتف</h3>
                <p>+966 XX XXX XXXX</p>
                <a href="tel:+966XXXXXXXXX" className={styles.contactButton}>
                  اتصل بنا
                </a>
              </div>

              <div className={styles.contactCard}>
                <FiMapPin size={32} />
                <h3>الموقع</h3>
                <p>المملكة العربية السعودية</p>
                <a href="/contactUs" className={styles.contactButton}>
                  تفاصيل أكثر
                </a>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className={styles.resourcesSection}>
            <h2>موارد مفيدة</h2>
            <div className={styles.resourcesGrid}>
              <a href="/privacy-policy" className={styles.resourceCard}>
                <h4>سياسة الخصوصية</h4>
                <p>اعرف كيفية حماية بيانات الخصوصية الخاصة بك</p>
              </a>
              <a href="/terms-conditions" className={styles.resourceCard}>
                <h4>شروط الاستخدام</h4>
                <p>اقرأ شروط الاستخدام وسياسات الموقع</p>
              </a>
              <a href="/return-policy" className={styles.resourceCard}>
                <h4>سياسة الاسترجاع</h4>
                <p>تعرف على إجراءات الاسترجاع والاستبدال</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Help;