"use client"
import { IoStar } from "react-icons/io5"
import styles from "./CustomerReviews.module.css"
import {useInView} from "react-intersection-observer";
import ElmentLoadin from "@/components/elemetLoadin/elmentLoadin";
import {useTranslation} from "react-i18next";

const ReviewCard = ()=>{
    const {t} = useTranslation()
    return (
        <>
            <div className={styles.card}>
                <h4>{t("clietRevewOneTitle")}</h4>
                <div className={styles.stars}>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>

                </div>
                <p>{t("clinetReavewOneSubtitle")}</p>
                <div className={styles.time}>
                    <h5>Teresa Hlland <span>3 days ago</span></h5>
                </div>
            </div>
            <div className={styles.card}>
                <h4>{t("clietRevewTowTitle")}</h4>
                <div className={styles.stars}>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>

                </div>
                <p>{t("clinetReavewTowSubtitle")}</p>
                <div className={styles.time}>
                    <h5>Teresa Hlland <span>3 days ago</span></h5>
                </div>
            </div>
            <div className={styles.card}>
                <h4>{t("clietRevewThereTitle")}</h4>
                <div className={styles.stars}>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>
                    <IoStar color="#fff" size={22}/>

                </div>
                <p>{t("clinetReavewThereSubtitle")}</p>
                <div className={styles.time}>
                    <h5>Teresa Hlland <span>3 days ago</span></h5>
                </div>
            </div>

        </>
    )
} 

const CustomerReviews = ()=>{
    const {ref, inView} = useInView({threshold:0.1, triggerOnce:true})

    const {t} = useTranslation();
    return (
        <div className="container" ref={ref}>
            {inView ? (
                <div className={styles.CustomerReviews}>



                    <div className={styles.cardSummary}>
                        <h3>{t("baseRevewTitle")} </h3>
                        <div className={styles.stars}>
                            <IoStar size={20} color="#fff" className="star"/>
                            <IoStar size={20} color="#fff" className="star"/>
                            <IoStar size={20} color="#fff" className="star"/>
                            <IoStar size={20} color="#fff" className="star"/>
                            <IoStar size={20} color="#fff" className="star"/>
                        </div>
                        <div className={styles.based}>
                            <span>{t("baseRevewSubTitle")}</span>
                        </div>
                        <p>{t("baseRevewTitle")} </p>
                    </div>
                    <ReviewCard />

                </div>
            ): <ElmentLoadin />}
        </div>
    )
}

export default CustomerReviews