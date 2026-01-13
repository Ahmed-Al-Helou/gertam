"use client";


import styles from "./register.module.css";
import Navbar from "../../components/Navbar/Navabr";
import Footer from "../../components/Footer/footer";
import {useState} from "react";
import {FcGoogle} from "react-icons/fc";
import {useTranslation} from "react-i18next";


const Form = () => {
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password_confirmation, setPassword_confirmation] = useState<string>("");
    const [error, setError] = useState<string>("");

    const {t} = useTranslation();
    const handleLogin = async () => {
        try {
            // Validation
            if(!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !password_confirmation.trim()){
                setError("كل الحقول مطلوبة");
                return;
            }

            // Password confirmation validation
            if(password !== password_confirmation) {
                setError("كلمات المرور غير متطابقة");
                return;
            }

            
            const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/register`;

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({  name, phone, email, password, password_confirmation}),
            });


            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'فشل التسجيل');
                return;
            }

            // Successful registration
            const token = data.data?.token;
            if(token) {
                document.cookie = `token=${token}; path=/; secure; samesite=strict;max-age=604800`;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(data.data.user || {}));
                
                // Small delay before redirect
                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
            } else {
                setError('لم يتم استقبال التوكن من الخادم');
            }
        } catch (err) {
            
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError(`فشل الاتصال بالخادم. تأكد من: 1) خادم الويب يعمل على ${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL} 2) عدم وجود مشاكل في الاتصال`);
            } else if (err instanceof SyntaxError) {
                setError('خطأ في صيغة الاستجابة من الخادم');
            } else {
                setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
            }
        }
    };


    return (
        <div className={styles.form}>
            <h3>{t("Create a new account")} </h3>
            <img src={"/logo.png"} alt="logo" className={styles.loginLogoImage} />
            {error && (
                <span className={styles.errmsg}> {error} </span>
            )}
            <div >
                <label htmlFor="name" > {t("name")} </label>
                <input type="text" id="name" placeholder={t("Write your name")} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div >
                <label htmlFor="email" >{t("Email")}</label>
                <input type="email" id="email" placeholder={t("Email")} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div >
                <label htmlFor="number" >{t("phone number")}</label>
                <input type="number" id="number" placeholder={t("phone number")} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div >
                <label htmlFor="password"> {t("password")}</label>
                <input type="password" id="password" placeholder={t("password")} value={password}   onChange={(e) => setPassword(e.target.value)} // <<< هذا ناقص
                />
            </div>
            <div >
                <label htmlFor="password_confirmation"> {t("Confirm password")} </label>
                <input type="password" id="password_confirmation" placeholder={t("Confirm password")} value={password_confirmation}   onChange={(e) => setPassword_confirmation(e.target.value)} // <<< هذا ناقص
                />
            </div>
            <button onClick={handleLogin} className={styles.submitbtn}>{t("Create a new account")} </button>
            <a href="/Login"> {t("login")} </a>
            <a href={`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/auth/google`}>
                <button
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition m-auto"
                >
                    <FcGoogle className="text-xl" />
                    <span>  {t("Log in with")} Google</span>
                </button>
            </a>
            <a href="/forgot-password" className={styles.rebaverepassword}>{t("Forgot your password")}</a>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>بإنشاء حساب، أنت توافق على <a href="/privacy-policy" className="text-blue-600 hover:underline">سياسة الخصوصية</a></p>
            </div>
        </div>
    )
}
const Register = () => {

    return (
        <>
            <Navbar />
            <div className="container">
                <div className={styles.login}>
                    <div className={styles.picture}>
                        <img src="/login.png" alt="" />
                    </div>
                    <Form />
                </div>
            </div>
            <Footer />
        </>

    )
}
export default Register;
