"use client"
import "../globals.css"
import TooleBar from "@/componets/tooleBar/TooleBar";
import Navbar from "@/componets/Navbar/Navbar";
import OverViewData from "@/componets/OverViewData/OverViewData";
import styles from "../root.module.css"
import Chart from "@/componets/chart/chart";
import OrdersTable from "@/componets/orders/orders";
import {useOverviewData} from "@/hooks/Overview/useGetOverview";

export default function Home() {

    const {data, error, loading } = useOverviewData(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/Overview`)
    if(error) return  error;
    if(!data || loading)return "Loading...";

  return (
    <>
        <Navbar />
        <TooleBar />
        <div className={styles.contaciner}>
            <OverViewData data={data.daily_stats}/>
            <Chart data={data.chart_data}/>
            <OrdersTable orders={data.latest_orders}/>
        </div>

    </>
  );
}
