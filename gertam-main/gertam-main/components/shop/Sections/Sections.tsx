import styles from "./sections.module.css";
import {useCategorie} from "@/hooks/shop/useCategorie";
import Loading from "@/app/ui/loaders/Loading";
import Link from "next/link";


const Card = ({data} : {data: any}) =>{
    return (
        <div className={styles.card}>
            <img src={data.ad_imae_url || "/no-image.jpeg"} alt="" />
            <h5>{data.name}</h5>
        </div>
            
    )
}

const Sections = () =>{

    const {data, isLoading} = useCategorie();
    if (isLoading) return <Loading />
    return (
        <div className="container">
            <div className={styles.sections}>
                {data && data.length > 0 && data.map((item) =>(
                    <Link href={`/categorie/${item.id}`} key={item.id}>
                        <Card data={item} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Sections;