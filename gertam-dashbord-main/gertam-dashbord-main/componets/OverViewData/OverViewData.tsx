import styles from "./overViewData.module.css"
import { LuTimerReset } from "react-icons/lu";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LuTimer } from "react-icons/lu";
import { GiAnticlockwiseRotation } from "react-icons/gi";
import { HiMiniArrowTrendingDown } from "react-icons/hi2";




interface StatsType {
    today_count: number
    yesterday_count: number
    change_percent:number
}

interface dailyStatsType {
    confirmed: StatsType
    completed: StatsType
    canceled: StatsType
    hanging: StatsType
}

const Cards = ({data}: {data: dailyStatsType})=>{
    return (
        <>
            <div className={styles.card}>
                <div className={styles.conaent}>
                    <IoMdCheckmarkCircleOutline size={60} color={"green"} className={styles.icon}/>
                    <div className={styles.text}>
                        <h3>مكمل  </h3>
                        <h1>{data.completed.today_count}</h1>
                    </div>
                </div>
                <h5>التغيير اليومي
                    {data.completed.change_percent > 0 ?(
                        <span>{data.completed.change_percent.toFixed(2)}%<HiMiniArrowTrendingUp size={20}/></span>

                        ):(
                        <span style={{color:"red"}}>{data.completed.change_percent.toFixed(2)}%<HiMiniArrowTrendingDown size={20}/></span>
                     )}
                </h5>

            </div>
            <div className={styles.card}>
                <div className={styles.conaent}>
                    <LuTimer size={60} color={"orange"} className={styles.icon} style={{backgroundColor: "rgba(253,149,2,0.2)"}}/>
                    <div className={styles.text}>
                        <h3>قيد المعالجه  </h3>
                        <h1>{data.confirmed.today_count}</h1>
                    </div>
                </div>
                <h5>التغيير اليومي
                    {data.confirmed.change_percent > 0 ?(
                        <span>{data.confirmed.change_percent.toFixed(2)}%<HiMiniArrowTrendingUp size={20}/></span>

                    ):(
                        <span style={{color:"red"}}>{data.confirmed.change_percent.toFixed(2)}%<HiMiniArrowTrendingDown size={20}/></span>
                    )}
                </h5>            </div>
            <div className={styles.card}>
                <div className={styles.conaent}>
                    <GiAnticlockwiseRotation size={60} color={"rgb(255,76,76)"} className={styles.icon} style={{backgroundColor: "rgba(255,71,43,0.2)"}}/>
                    <div className={styles.text}>
                        <h3>ملغي </h3>
                        <h1>{data.canceled.today_count}</h1>
                    </div>
                </div>
                <h5>التغيير اليومي
                    {data.canceled.change_percent > 0 ?(
                        <span>{data.canceled.change_percent.toFixed(2)}%<HiMiniArrowTrendingUp size={20}/></span>

                    ):(
                        <span style={{color:"red"}}>{data.canceled.change_percent.toFixed(2)}%<HiMiniArrowTrendingDown size={20}/></span>
                    )}
                </h5>
            </div>
            <div className={styles.card}>
                <div className={styles.conaent}>
                    <LuTimerReset size={60} color={"rgb(132,132,132)"} className={styles.icon} style={{backgroundColor: "rgba(132,132,132,0.2)"}}/>
                    <div className={styles.text}>
                        <h3>معلق </h3>
                        <h1>{data.hanging.today_count}</h1>
                    </div>
                </div>
                <h5>التغيير اليومي
                    {data.hanging.change_percent > 0 ?(
                        <span>{data.hanging.change_percent.toFixed(2)}%<HiMiniArrowTrendingUp size={20}/></span>

                    ):(
                        <span style={{color:"red"}}>{data.hanging.change_percent.toFixed(2)}%<HiMiniArrowTrendingDown size={20}/></span>
                    )}
                </h5>            </div>
        </>
    )
}

const OverViewData = ({data} : {data: dailyStatsType})=>{
    return (
        <div className={styles.overViewData}>
            <Cards data={data}/>
        </div>
    )
}

export default OverViewData;