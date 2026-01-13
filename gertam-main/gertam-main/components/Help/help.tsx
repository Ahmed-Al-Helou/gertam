import styles from "./help.module.css"
import {useTranslation} from "react-i18next";

const Help = ()=>{
    const {t} = useTranslation();
    return (
        <div className="container">
            <div className={styles.help}>
                <div className={styles.text}>
                    <h1>{t("Contact us")}</h1>
                    <p>{t("You can always call and ask for help")}</p>
                </div>
                    <div className={styles.contact}>
                        <a href={"tel:+966555392582"}><button>{t("Contact us")}</button></a>
                        <div className="call">
                            <h1>+966555392582</h1>
                        <p>{t("Call or contact us on WhatsApp")}</p>
                        </div>
                    </div>
                
            </div>
        </div>
    )
}

export default Help;