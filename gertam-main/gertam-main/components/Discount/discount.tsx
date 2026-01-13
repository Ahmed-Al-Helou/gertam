import styles from "./Discount.module.css"
import {useTranslation} from "react-i18next";

const Discount = ({data}:{data:any})=>{
    const {t, i18n} = useTranslation();
    if(!data) return;
    if(data.active !== true) return;
    return (
        <div className="container">
        <div className={styles.discount}>
            <div className={styles.text}>
                <h1>-{data.percentage}%</h1>
                <div className={styles.con}>
                    <h5>{data[`${i18n.language}_title`]}</h5>
                    <span>{data[`${i18n.language}_subtitle`]} </span>
                </div>
            </div>
            <span className={styles.codeDis}>{data.code}</span>
        </div> 
        </div>
    )
}

export default Discount