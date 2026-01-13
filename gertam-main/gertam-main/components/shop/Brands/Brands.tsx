import styles from "./brands.module.css";
import {useBrand} from "@/hooks/shop/useBrand";
import Loading from "@/app/ui/loaders/Loading";
import Link from "next/link";




const Card = ({data} : {data:any})=>{
    return (
        <Link href={`/SearchResult?company=${data.id}`}>
            <div className={styles.card}>
                <h5>{data.en_name}</h5>
                {/*<img src="/logo-isuzu.png" alt="" />*/}
            </div>
        </Link>
    )
}

const Brands = ()=>{
    const {data , isLoading} = useBrand();


    if(isLoading || !data || data.length <= 0) return <Loading/>;
    
    return (
        <div className="container">
            <div className={styles.brands}>
                {data.map((item)=>(
                    <div key={item.id}><Card data={item}/></div>
                ))}
            </div>
        </div>
    )
}

export default Brands