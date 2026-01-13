"use client"
import styles from  "./brands.module.css"
import Navbar from "@/components/Navbar/Navabr";
import Footer from "@/components/Footer/footer";
import Link from "next/link";
import {useAllStore} from "@/hooks/store/useAllStore";
import Loading from "@/app/ui/loaders/Loading";
import {useAllBrands} from "@/hooks/brands/useAllBrands";



const Card = ({item} : {item: any})=>{
    return (
        <Link href={`/store/${item.id}`} className={styles.Card}>
            <img src={item.logo || "/no-image.jpeg"} alt="logo" />
            <h3 >{item.ar_name} </h3>
        </Link>
    )
}

const Brands = ()=>{

    const {data, isLoading} = useAllBrands();

    if (isLoading) return <Loading />
    return (
        <>
            <Navbar />
            <div className={styles.traders}>
                <div className="container">
                    <div className={styles.cards}>
                        {data.map((item,index)=>(
                            <Card key={index} item={item}/>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default  Brands;