import { CiHeart } from "react-icons/ci";
import styles from "./section.module.css";
import {FaStar, FaStarHalfAlt} from "react-icons/fa";
import Slider from "@/app/ui/ProductsSlider/Slider/slider";
import {convertPrice, currency} from "@/app/utils/currency";
import React, {useEffect, useState} from "react";
import {FaRegStar} from "react-icons/fa6";
import Link from "next/link";

interface ProductCombilitiy {
    message: string;
    cars?: string[];
}

interface Review {
    id: number;
    user_id: number;
    stars: number;
    comment: string;
    created_at: string | null;
}


interface ProductData{
    id: string;
    ar_name: string;
    en_name: string;
    ar_description: string;
    en_description: string;
    price: string;
    old_price: string;
    thumbnail?: string;
    image?: string;
    reviews?: string[];
    units?: string[];
    alternative_parts?: string[];
    images: string[];
}

interface ProductProps {
    ProdutData: ProductData;
    ProductCombilitiy: ProductCombilitiy;
}
const Ad = ({data} : {data: any})=>{

    return (
        <Link href={`/store/${data?.store_id ?? 1}`}>
            <div className="container" >
                <div className={styles.ad}>
                    <img src={data?.ad_photo} alt="" />
                </div>
            </div>
        </Link>
    )
}
const Card = ({product} : {product:any})=>{
    // Force SAR everywhere
    const curransy = "SAR" as const;
    const [DiscountInt, setDiscountInt] = useState(0);

    useEffect(() => {
        const discount = ((Number(product.old_price ) - Number(product.price)) / Number(product.old_price)) * 100;
        const discountInt = Math.floor(discount); // ينطيها بدون فواصل

        setDiscountInt(Number(discountInt));

    }, []);
    // if(!product || product.length <= 0) return;

    const calculateAverage = (reviews: Review[]) => {
        const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
        return reviews.length ? sum / reviews.length : 0;
    };


    const averageRating = calculateAverage(product.reviews);

    const renderStars = (average: number) => {
        const stars = [];
        const fullStars = Math.floor(average); // عدد النجوم الكاملة
        const hasHalfStar = average % 1 >= 0.5; // نصف نجمة إذا الباقي 0.5 أو أكثر
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // الباقي نجوم فارغة

        // النجوم الكاملة
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} size={18} />);
        }

        // النصف نجمة
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" size={18} />);
        }

        // النجوم الفارغة
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} size={18} style={{ opacity: 0.4 }} />);
        }

        return stars;
    };
    return (
        <div className={styles.card}>
            <div className={styles.discountLike}>
                {DiscountInt && DiscountInt > 0 && !isNaN(DiscountInt) &&(
                    <span>{DiscountInt}%</span>
                )}
                <CiHeart size={30}/>
            </div>
            <Link href={`/Product/${product.id}`}>
                <div className={styles.image}>
                    <img src={product?.thumbnail || "no-image.jpeg"} alt="" />
                </div>
                <div className={styles.content}>
                    <div className={styles.revew}>
                        <span className={styles.reviewCount}>
                          ({product.reviews_count || 0} reviews)
                        </span>
                        <span className={styles.stars}>
                     {renderStars(averageRating)}
                    </span>
                    </div>
                    <h3>{product.ar_name}</h3>
                    <div className={styles.price}><h3>
                        {convertPrice(Number(product.price), curransy)}
                        <span>{product.old_price ? ` ${convertPrice(Number(product.old_price), curransy)}` : ""}</span>
                    </h3></div>
                </div>
            </Link>
            <div className={styles.buttons}>
                <button>Add Cart</button>
            </div>
        </div>
    )
}
    
const Related = ({data} : {data: any}) =>{
    return (
       <div className="container">
           <div className={styles.silderTitle}>
               <a href="">عرض الكل</a>
               <div className={styles.title}>
                   <h3> منتجات ذات صله </h3> <span> هذا المنتجات ذات صله مع القسم </span>
               </div>
           </div>
         <div className={styles.related}>
                    {data.map((item:ProductData) =>(
                        <div key={item.id} className={styles.row}>
                            <Card product={item}/>
                        </div>
                    ))}
                </div>
       </div>
    )
}

const Section = ({data} : {data:any}) =>{

    return (
        <div className="Section" >
            <div className={styles.section}>
                <Ad data={data} />
                <Slider data={data}/>
                <Related data={data.extraProducts}/>
            </div>
        </div>
    )
}

export default Section
    