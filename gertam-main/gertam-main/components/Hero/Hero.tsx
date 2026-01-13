"use client"
import styles from "./hero.module.css"
import Search from "@/app/ui/Search/Search"
import Link from "next/link";
import {useTranslation} from "react-i18next";

const Serve = ()=>{
    const {t, i18n} = useTranslation();
    return (
        <>
        <div className={styles.serve}>
            <img src="/iconbox3.svg fill.png" alt="" />
            <div className={styles.text}>
                <h4>{t("heroServeOneTitle")}</h4>
                <p>{t("herorServeOneSubtitle")}</p>
            </div>
        </div>
        <div className={styles.serve}>
            <img src="/iconbox2.svg fill.png" alt="" />
            <div className={styles.text}>
                <h4>{t("heroServeTowTitle")}</h4>
                <p>{t("herorServeTowSubtitle")}</p>
            </div>
        </div>
        <div className={styles.serve}>
            <img src="/iconbox.svg fill.png" alt="" />
            <div className={styles.text}>
                <h4>{t("heroServeThereTitle")}</h4>
                <p>{t("herorServeThereSubtitle")}</p>
            </div>
        </div>
        </>
    )
}
type Brand = { id: number; ar_name: string }
type Module = { id: number; ar_name: string; make_by: number }
type ModuleDate = { id: number; date_form: number; date_to: number; module_by: number }
type Engine = { id: number; ar_name: string; en_name: string; module_date_by: number }

type ApiData = { brands: Brand[]; module: Module[]; enginees: Engine[]; ModuleDate: ModuleDate[] }

const Hero = ({data} : {data: ApiData})=>{
    const {t } = useTranslation();
    return (
        <div className={styles.hero}>
            <h1 className={styles.title}>{t("heroTitle")}</h1>
            <span>{t("horeSubtitle")}</span>
            <Search />
            <Link href={"/shop"} className={styles.allProdcutBtn}>{t("allProducts")} </Link>
            <div className="container">
                <div className={styles.serveses}>
                <Serve/>
            </div>
            </div>
        </div>
    )
}

export default Hero