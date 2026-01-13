"use client"
import { FaFacebook, FaLinkedinIn } from "react-icons/fa"
import styles from "./footer.module.css"
import { TbBrandLinkedinFilled } from "react-icons/tb"
import { FaSquareXTwitter } from "react-icons/fa6"
import { RiInstagramFill } from "react-icons/ri"
import { FaMapMarker } from "react-icons/fa";

import {useInView} from "react-intersection-observer";
import Loading from "@/app/ui/loaders/Loading";
import {useTranslation} from "react-i18next";

const Top = () =>{
    const {t} = useTranslation();
   return (
    <div className={styles.top}>
        <div className="container">
            <div className={styles.content}>
            <div className={styles.text}>
            <h1>{t("Send us a message")}</h1>
            <p>{t("We are always here to receive your email")} </p>
        </div>
        <div className={styles.sendMassage}>
            <div className={styles.input}>
                <input type="text" placeholder={t("Write your message")}/>
                <button>{t("submit")}</button>
            </div>
            <p>{t("Write your message here and we will receive it and respond to you as soon as possible")} </p>
        </div>
            </div>
        </div>
    </div>
   ) 
}

const Middle = ()=>{
    const {t} = useTranslation();
    return(
        <div className={styles.middle}>
            <div className="contactUS">
                <h1> {t("Main Center")}</h1>
                <div className="section">
                    <h3>{t("The translation")}</h3>
                    <span><a href={'https://maps.app.goo.gl/tSdbajvkNwMnPC7X6'} className="flex gap-2">
{t("Address: Al-Ta’if, Al-Sail Al-Sagheer, formerly Al-Khalidiyah Station")}</a> </span>
                </div>
                <div className="section">
                    <h3>{t("Call on")} </h3>
                    <span>0555392582</span>
                </div>
                <div className="section">
                    <h3>{t("WhatsApp")} </h3>
                    <span><a href="https://iwtsp.com/966555392582">{t("WhatsApp")} </a></span>
                </div>
                <div className="section">
                    <h3>{t("Email")} </h3>
                    <span>info@alfaraaonline.com.sa</span>
                </div>
            </div>
            <div className="helpYou">
                <h1>{t("Isuzu Branch, Al-Sail Al-Sagheer")}</h1>
                <div className="section">
                    <h3>{t("The translation")} </h3>
                    <span><a href="https://goo.gl/maps/Nmmy7AkSMdT9ePKBA" className="flex gap-2">{t("Dammam, Dallah Industry, Omar Al-Khattab Road (RA), before Burjstone Center")}</a> </span>
                </div>
                <div className="section">
                    <h3>{t("Call on")} </h3>
                    <span>0552141467</span>
                </div>
                <div className="section">
                    <h3>{t("WhatsApp")} </h3>
                    <span><a href="https://iwtsp.com/966507701827">{t("WhatsApp")} </a></span>
                </div>
                <div className="section">
                    <h3> {t("Email")} </h3>
                    <span>info@alfaraaonline.com.sa</span>
                </div>
            </div>

            <div className="helpYou">
                <h1>{t("Dammam Branch")}</h1>
                <div className="section">
                    <h3>{t("The translation")} </h3>
                    <span><a href="https://goo.gl/maps/Nmmy7AkSMdT9ePKBA" className="flex gap-2">{t('Dammam, Dallah Industry, Omar Al-Khattab Road (RA), before Burjstone Center')}</a> </span>
                </div>
                <div className="section">
                    <h3>{t("Call on")} </h3>
                    <span>0555074596</span>
                </div>
                <div className="section">
                    <h3>{t("WhatsApp")} </h3>
                    <span><a href="https://iwtsp.com/966555074596">{t("WhatsApp")} </a></span>
                </div>
                <div className="section">
                    <h3> {t("Email")} </h3>
                    <span>info@alfaraaonline.com.sa</span>
                </div>
            </div>
            <div className="helpYou">
                <h1>{t("Al-Khurmah Branch")}</h1>
                <div className="section">
                    <h3>{t("The translation")} </h3>
                    <span><a href="https://goo.gl/maps/a2t7zjymXE6JcwCj7" className="flex gap-2">{t("Al-Dughaymah, Ranyah Road")}</a> </span>
                </div>
                <div className="section">
                    <h3> {t("Call on")} </h3>
                    <span>0507630975</span>
                </div>
                <div className="section">
                    <h3>{t("WhatsApp")} </h3>
                    <span><a href="https://iwtsp.com/966507630975">{t("WhatsApp")} </a></span>
                </div>
                <div className="section">
                    <h3>{t("Email")}</h3>
                    <span>info@alfaraaonline.com.sa</span>
                </div>
            </div>
        </div>
    )
}

const Bottom = ()=>{
    const {t} = useTranslation();
    return(
        <div className={styles.bottom}>
        <div className={styles.logo}><img src="/logo.png" alt="" /></div>
        <div className="flex items-center justify-center gap-3 mt-4">
  <a
    href="https://www.facebook.com/share/12DAe4kZmub/?mibextid=wwXIfr"
    target="_blank"
    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
  >
    <FaFacebook size={20} />
  </a>

  <a
    href="https://www.instagram.com/alfaraacompany?igsh=MThhMHdjdmJ1dWE0dw=="
    target="_blank"
    className="p-2 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 text-white hover:opacity-90 transition-opacity"
  >
    <RiInstagramFill size={20} />
  </a>

  <a
    href="https://twitter.com/"
    target="_blank"
    className="p-2 rounded-full bg-black text-white hover:bg-slate-800 transition-colors"
  >
    <FaSquareXTwitter size={20} />
  </a>

  <a
    href="https://www.linkedin.com/company/al-faraa/"
    target="_blank"
    className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
  >
    <FaLinkedinIn size={20} />
  </a>
</div>

        
    </div>
    )
}

const Footer = ()=>{
    const {ref, inView} = useInView({threshold:0.1, triggerOnce:true})
    const {t } = useTranslation();
    return(
        <div ref={ref}>
            {inView ? (
                <div className={styles.footer}>
                    <Top/>
                    <div className="container">
                        {/* <Middle/> */}
                        <Bottom/>
                        <div className="w-full border-t border-gray-700 bg-gray-900 text-center py-4">
                            <p className="text-l text-gray-400">
                                © {new Date().getFullYear()} {t("All rights reserved to")}{" "}
                                <span className="text-blue-500 font-semibold"></span>
                            </p>
                        </div>
                    </div>
                </div>
            ): <Loading/>}
        </div>

    )
}

export default Footer