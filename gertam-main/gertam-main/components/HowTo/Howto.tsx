"use client"
import styles from "./howto.module.css"
import {useInView} from "react-intersection-observer";
import ElmentLoadin from "@/components/elemetLoadin/elmentLoadin";
import {useTranslation} from "react-i18next";

const SectionAd = ()=>{
    const {t} = useTranslation();
    return (
    <div className={styles.section}>
        <img src="/banner-06.jpg.png" alt="" />
        <div className={styles.text}>
         <span>{t("Getthebestpartsforyourcar")}</span>
        <h4>{t("Weofferyouthebestpieceswithhighquality")}</h4>
        <p>{t("ReliableSources")}</p>
        <button>{t("shopNow")} </button>
        </div>
    </div>
    )
}

const Main = ()=>{
    const {t} = useTranslation();
    return (
        <div className={styles.main}>
            <div className={styles.titleCoontent}>
                <span>{t("Followthestepsforasmoothshoppingexperience")}</span>
                <h1>{t("How to have a better experience")}  <span>{t("How to have a better experience")}</span></h1>
                <p>{t("The system helps you access compatible parts")}</p>
                <p>{t("We will guarantee you quality and compatibility")}</p>
                <a href="">{t("All you have to do is follow the instructions")}</a>
            </div>
            <div className={styles.image}><img src="/banner-02-1.jpg.png" alt="" /></div>
            <div className={styles.howtouse}>
                <h4>{t("How do you use the system")} </h4>
                <p>{t("Follow the steps below")} </p>
                <div className={styles.step}>
                    <div className="icon"><span>01</span></div>
                    <div className="text">
                        <h5>{t("Add your car information")}</h5>
                        <p>{t("Add your car to the garage to find out the right parts for your car")}</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className="icon"><span>02</span></div>
                    <div className="text">
                        <h5>{t("Make sure the part is compatible before purchasing")}</h5>
                        <p>{t("The system will inform you if the part is not compatible with the vehicle")}</p>
                    </div>
                </div>
                <div className={styles.step}>
                    <div className="icon"><span>03</span></div>
                    <div className="text">
                        <h5>{t("Verify the accuracy of the information")}</h5>
                        <p>{t("Make sure your contact and delivery information is correct")} </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const HowTo = ()=>{

    const {ref, inView} = useInView({threshold:0.1, triggerOnce:true});

    return(
        <div ref={ref}>
            {inView ?(
                <div className="container">
                    <div className={styles.content}>
                        <SectionAd/>
                        <SectionAd/>
                    </div>
                    <Main/>
                </div>
            ): <ElmentLoadin/>}
        </div>
    )
    
}

export default HowTo