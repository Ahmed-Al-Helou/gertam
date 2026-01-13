"use client";
import styles from "./login.module.css";
import Navbar from "../../components/Navbar/Navabr";
import Footer from "../../components/Footer/footer";
import data from "@/app/data/home"
import {useState} from "react";
import { FcGoogle } from "react-icons/fc";
import {useTranslation} from "react-i18next";



const Form = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {t} = useTranslation();
    const handleLogin = async () => {
        try {
            if(email === "" || password === ""){
                setError("كل الحقول مطلوبه ");
                return;
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  email, password }),
            });



            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }
            document.cookie = `token=${data.token}; path=/; secure; samesite=strict`
            localStorage.setItem("token", data.token);
            location.href="/";
        } catch (err) {
            setError("حدث خطا غيرمتوقع ")
        }
    };


    return (
    <div className={styles.form}>
    <h3>{t("login")}</h3>
        <img src={"/logo.png"} alt="logo" className={styles.loginLogoImage} />
        {error && (
            <span className={styles.errmsg}> {error} </span>
        )}
        <div className={styles.inputGroup}>
          <label htmlFor="email" >{t("Email")}</label>
          <input type="email" id="email" placeholder={t("Email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">{t("password")}</label>
          <input type="password" id="password" placeholder={t("password")} value={password}   onChange={(e) => setPassword(e.target.value)} // <<< هذا ناقص
          />
        </div>
        <button onClick={handleLogin} className={styles.submitbtn}>{t("login")}</button>

        <a href="/Register">{t("Create a new account")}</a>

        <span className={styles.loginWith}>او </span>
        <a href={`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/auth/google`}>
            <button
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition m-auto"
            >
                <FcGoogle className="text-xl" />
                <span>{t("Log in with")} Google</span>
            </button>
        </a>
        <a href="/forgot-password" className={styles.rebaverepassword}>{t("Forgot your password")}</a>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>بالدخول، أنت توافق على <a href="/privacy-policy" className="text-blue-600 hover:underline">سياسة الخصوصية</a></p>
        </div>
    </div>
  )
}
const Login = () => {

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
export default Login;
