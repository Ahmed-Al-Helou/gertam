"use client"
import styles from "../categorie.module.css"
import Navbar from "@/components/Navbar/Navabr";
import data from "@/app/data/home";
import Slider from "@/app/ui/ProductsSlider/Slider/slider";
import { CiHeart } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import React, {useEffect, useState} from "react";
import { useGetCategorieById} from "@/hooks/categorie/useCategories";
import {useGetProducts} from "@/hooks/categorie/useGetProducts";
import Loading from "@/app/ui/loaders/Loading";
import {convertPrice, currency} from "@/app/utils/currency";
import {useCartContext} from "@/Context/CartContext";

interface Props {
    params: Promise<{ id: string }>;
}


const Ad = ({id} : {id:number})=>{
    const {data: categorie, error, loading} = useGetCategorieById(id);
    if(loading) return (<Loading />)
    return (
        <div className="container">
            <div className={styles.ad}>
                <img src={categorie?.ad_imae_url || "/no-image.jpeg"} alt="" />
            </div>
        </div>
    )
}
type Productdata ={
    id: number,
    ar_name: string,
    en_name: string,
    ar_description: string,
    en_description: string,
    price: string,
    old_price: string,
    thumbnail:string

}


const Related = ({ id }: { id: number }) => {
    const { products, loading } = useGetProducts(id);
    const [curransy, setCurransy] = useState<keyof typeof currency>("SAR");

    const {addToCart} = useCartContext();
    useEffect(() => {
        const saved = localStorage.getItem("currency");
        if (saved && saved in currency) {
            setCurransy(saved as keyof typeof currency);
        }
    }, []);



    if (loading) return <Loading />;



    return (
        <div className="container">
            <div className={styles.related}>
                <div className={styles.cards}>
                    {products && products.length > 0 ? (
                        products.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.discountLike}>
                                    <span>12%</span>
                                    <CiHeart size={30} />
                                </div>
                                <a href={`/Product/${item.id}`}>
                                    <div className={styles.image}>
                                        <img src={item.thumbnail || "/no-image.jpeg"} alt="" />
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.revew}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={15} color="#EAB308" />
                                            ))}
                                            <div className={styles.rech}>
                                                <h5>4.23</h5> <span>(122)</span>
                                            </div>
                                        </div>
                                        <h3>{item.ar_name}</h3>
                                        <div className={styles.price}>
                                            <h3>
                                                {convertPrice(Number(item.price), curransy)}
                                                <span>{item.old_price ? ` ${convertPrice(Number(item.old_price), curransy)}` : ""}</span>
                                            </h3>
                                        </div>
                                    </div>
                                </a>
                                <div className={styles.buttons}>
                                    <button onClick={()=>addToCart(item.id, 1)}>
                                        Add Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h3>لايوجد منتجات</h3>
                    )}
                </div>
            </div>
        </div>
    );
};
interface Props {
    params: Promise<{ id: string }>; // params الآن Promise
}

const Categorie = ({params} : Props) =>{
    const {id} = React.use(params);
    return (
        <div className="Section">
            <Navbar />
            <div className={styles.section}>
                <Ad id={Number(id)}/>
                <Related id={Number(id)}/>
            </div>
        </div>
    )
}



export default Categorie