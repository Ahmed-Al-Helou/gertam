"use client"
import styles from "./brands.module.css"
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import Loading from "@/app/ui/loaders/Loading";
import {useTranslation} from "react-i18next";

type LocalData = {
    id: number
    title: string
    logo: string
}

const BrandCard = ({data}: {data : LocalData[]})=>{

    return (
        <>
        {data.map((item)=>(
        <Link href={`SearchResult?company=${item.title}`} key={item.id} className={styles.card}>
            <div className={styles.card} >
                <img src={item.logo} alt="" />
                <h4>{item.title} </h4>
            </div>
        </Link>
        ))}
        </>
        
    )
}

const Brands = ({data} : {data : LocalData[]})=>{
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    const {t} = useTranslation();
    return (
       <div className="container">
        <h1 className={styles.title}>{t("beatBrands")} </h1>
         <div className={styles.brands} ref={ref}>

                 {inView ? <BrandCard data={data}/> : <Loading />}


        </div>
       </div>
    )
}

export default Brands