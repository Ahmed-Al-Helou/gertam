"use client";
import Navbar from "../../components/Navbar/Navabr";
import Footer from "../../components/Footer/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logoutUser } from "@/app/utils/auth";
import Loading from "@/app/ui/loaders/Loading";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useMerchant } from "@/hooks/store/useMerchant";

type ProfileData = {
    name: string;
    email: string;
    phone: string;
    country: string;
    avatar_url?: string;
    password?: string;
    password_confirmation?: string;
};

const Profile = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        email: "",
        phone: "",
        country: "السعودية",
        avatar_url: ""
    });

    const { t } = useTranslation();
    const { data: marchantData, error, isLoading } = useMerchant();

    useEffect(() => {
        const getUserData = async () => {
            const user = await getUser();
            if (!user || !user.name) {
                router.push("/Login");
                return;
            }

            setProfileData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                country: user.country || "",
                avatar_url: user.avatar_url || "",
            });
            setLoading(false);
        };
        getUserData();
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/Login");
                return;
            }

            try {
                await logoutUser(token);
            } catch (error) {
                console.warn("فشل تسجيل الخروج من السيرفر، سنحذف التوكن محليًا");
            }

            localStorage.removeItem("token");
            router.push("/Login");
        } catch (err) {
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen py-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-start bg-blue-600 bg-clip-text text-transparent">
                        {t("My personal account")}
                    </h1>

                    {/* بطاقة المستخدم */}
                    <div className="bg-white/95 backdrop-blur-sm  rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-white/20 relative overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl -z-0"></div>

                        <div className="relative z-10">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-75"></div>
                                <img
                                    src={profileData.avatar_url && profileData.avatar_url !== "/no-image.jpeg" ? `${profileData.avatar_url}` : "/profile.png"}
                                    alt="User Avatar"
                                    className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-blue-200"
                                />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-right">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{profileData.name || t("name")}</h2>
                            <div className="space-y-1.5">
                                <p className="text-gray-600 flex items-center m-0 justify-start md:justify-start gap-2">
                                    <span>📧</span>
                                    {profileData.email || "-"}
                                </p>
                                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                    <span>📱</span>
                                    {profileData.phone || "-"}
                                </p>
                                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                    <span>🌍</span>
                                    {profileData.country || "-"}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/editProfile"
                            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                        >
                            {t("Edit account")}
                        </Link>
                    </div>

                    {/* معلومات شخصية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20">
                            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">👤</span>
                                {t("Personal information")}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-600 font-medium">{t("Email")}</span>
                                    <span className="text-gray-900 font-semibold">{profileData.email || "-"}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-600 font-medium">{t("name")}</span>
                                    <span className="text-gray-900 font-semibold">{profileData.name || "-"}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-600 font-medium">{t("phone number")}</span>
                                    <span className="text-gray-900 font-semibold">{profileData.phone || "-"}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-600 font-medium">{t("country")}</span>
                                    <span className="text-gray-900 font-semibold">{profileData.country || "-"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20">
                            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">📍</span>
                                {t("Additional details")}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-600 font-medium">{t("The city")}</span>
                                    <span className="text-gray-900 font-semibold">{t("nothing")}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-600 font-medium">{t("Street address")}</span>
                                    <span className="text-gray-900 font-semibold">{t("nothing")}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-600 font-medium">{t("zip code")}</span>
                                    <span className="text-gray-900 font-semibold">{t("nothing")}</span>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                                >
                                    {t("Log out")}
                                </button>
                                <Link
                                    href="/editProfile"
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-center"
                                >
                                    {t("Edit information")}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Merchant Status Card */}
                    {marchantData && marchantData.store_name ? (
                        <div
                            dir="rtl"
                            className={` mx-auto mb-8 p-6 md:p-8 border-2 rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden ${marchantData.pledge === 2
                                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
                                    : marchantData.pledge === 1
                                        ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300"
                                        : marchantData.pledge === 0
                                            ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-300"
                                            : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300"
                                }`}
                        >
                            {/* Decorative elements */}
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 ${marchantData.pledge === 2 ? "bg-green-300"
                                    : marchantData.pledge === 1 ? "bg-yellow-300"
                                        : marchantData.pledge === 0 ? "bg-red-300"
                                            : "bg-gray-300"
                                }`}></div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                        <span className="text-3xl">🏪</span>
                                        {marchantData.store_name}
                                    </h3>
                                    <span
                                        className={`text-sm md:text-base font-bold px-4 py-2 rounded-full shadow-lg ${marchantData.pledge === 2
                                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                                : marchantData.pledge === 1
                                                    ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                                                    : marchantData.pledge === 0
                                                        ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                                                        : "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
                                            }`}
                                    >
                                        {marchantData.pledge === 2
                                            ? "✅ مقبول"
                                            : marchantData.pledge === 1
                                                ? "⏳ قيد المراجعة"
                                                : marchantData.pledge === 0
                                                    ? "❌ مرفوض"
                                                    : "❓ غير معروف"}
                                    </span>
                                </div>

                                <div className="text-right space-y-3 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
                                    <p className="text-base md:text-lg text-gray-700 font-medium">
                                        {marchantData.pledge === 2
                                            ? "🎉 تمت الموافقة على طلبك بنجاح."
                                            : marchantData.pledge === 1
                                                ? "📋 طلبك قيد المراجعة، سيتم إعلامك قريباً."
                                                : marchantData.pledge === 0
                                                    ? "😔 نأسف، تم رفض الطلب."
                                                    : "⚠️ لم يتم تحديد حالة الطلب بعد."}
                                    </p>

                                    {marchantData.reason && (
                                        <div className="mt-4 bg-red-50/80 rounded-xl p-4 border-2 border-red-200">
                                            <p className="text-sm md:text-base font-bold text-red-700 mb-2 flex items-center gap-2">
                                                <span>⚠️</span>
                                                سبب الرفض:
                                            </p>
                                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                                {marchantData.reason}
                                            </p>
                                        </div>
                                    )}
                                    {/* try edit order data  */}
                                    {marchantData.pledge === 0 && (
                                        <Link
                                            href={`sweely/edit/${marchantData.id}`}
                                            className="inline-block text-center bg-amber-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors duration-150 shadow-sm hover:shadow-md"
                                        >
                                            تعديل المعلومات
                                        </Link>

                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl min-h-[300px] p-8 md:p-12 mb-8 flex flex-col items-center justify-center gap-6 border border-white/20 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10 text-center">
                                <div className="text-6xl md:text-7xl mb-4">🏬</div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                                    لا يوجد متجر حالي
                                </h2>
                                <p className="text-gray-600 mb-6 max-w-md">
                                    ابدأ رحلتك التجارية من خلال تقديم طلب لفتح متجر جديد
                                </p>
                                <Link
                                    href="/sweely"
                                    className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg"
                                >
                                    📝 تقديم طلب فتح متجر
                                </Link>
                            </div>
                        </div>
                    )}



                </div>
            </div>

            <Footer />
        </>
    );
};

export default Profile;
