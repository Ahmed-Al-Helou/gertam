"use client"
import { CiHeart } from "react-icons/ci"
import {FaStar, FaStarHalfAlt} from "react-icons/fa"
import styles from "./card.module.css"
import React, {useEffect, useState} from "react";
import {convertPrice} from "@/app/utils/currency";
import Link from "next/link";
import { useCartContext } from "@/Context/CartContext";
import {FaRegStar} from "react-icons/fa6";
import {useTranslation} from "react-i18next";


type LocalCardData = {
  id: number
  title: string
  price: number
  DisPrice: number
  old_price: number
  image: string
    thumbnail?: string
}
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
    reviews?: Review[];
    units?: string[];
    alternative_parts?: string[];
    images: string[];
    reviews_count: number
}

interface ProductProps {
    ProdutData: ProductData;
    ProductCombilitiy: ProductCombilitiy;
}

const Card = ({data} : {data  : ProductData})=>{

    const { addToCart } = useCartContext();

    const [DiscountInt, setDiscountInt] = useState(0);
    const [added, setAdded] = useState(false); // للتحكم بالرسالة


    // Force SAR everywhere
    const curransy = "SAR" as const;


    useEffect(() => {
        const discount = ((Number(data.old_price ) - Number(data.price)) / Number(data.old_price)) * 100;
        const discountInt = Math.floor(discount); // ينطيها بدون فواصل

        setDiscountInt(Number(discountInt));

    }, []);


    const handleAddToCart = async () => {
        await addToCart(Number(data.id), 1);

        // نظهر الرسالة مؤقتًا
        setAdded(true);
        setTimeout(() => setAdded(false), 1500); // تختفي بعد 1.5 ثانية
    };

    const calculateAverage = (reviews: Review[]) => {
            if(reviews.length < 1) return 0;
            const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
            return reviews.length ? sum / reviews.length : 0


    };


    const averageRating = calculateAverage(data.reviews ?? []);

    const renderStars = (average: number) => {
        const stars = [];
        const fullStars = Math.floor(average); // عدد النجوم الكاملة
        const hasHalfStar = average % 1 >= 0.5; // نصف نجمة إذا الباقي 0.5 أو أكثر
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // الباقي نجوم فارغة

        // النجوم الكاملة
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className={styles.star} />);
        }

        // النصف نجمة
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className={styles.star} />);
        }

        // النجوم الفارغة
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className={styles.star} style={{ opacity: 0.4 }} />);
        }

        return stars;
    };
    const {t, i18n} = useTranslation();
    return (
        <div className={styles.card}>
            {added && (
                <div style={{
                    position: "absolute",
                    background: "#4CAF50",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    top: "-40px",
                    right: "0",
                    transition: "all 0.3s",
                }}>
                    تم إضافة المنتج للسلة
                </div>
            )}
            <div className={styles.discountLike}>
                {DiscountInt && DiscountInt > 0 && !isNaN(DiscountInt) &&(
                    <span>{DiscountInt}%</span>
                )}
                <div   >
                    <CiHeart size={25} className={styles.Like} />
                </div>
            </div>
            <Link  href={`/Product/${data.id}`} >

                <div className={styles.image}>
                    <img src={data.image || data.thumbnail || "/no-image.jpeg"} alt="" loading="lazy"/>
                </div>
                <div className={styles.content}>
                    <h3 className={styles.productTitle}>{i18n.language === "ar" ? data.ar_name : data.en_name}</h3>

                    <div className={styles.revew}>

                        <span className={styles.stars}>
                     {renderStars(averageRating)}
                    </span>

                        <span className={styles.revewCount}>
                            (<span>{t("reviews")}</span> {data.reviews_count || 0} )
                        </span>
                    </div>
                    <div className={styles.price}><h3>
                        {convertPrice(Number(data.price), curransy)}
                        <span>{data.old_price ? ` ${convertPrice(Number(data.old_price), curransy)}` : ""}</span>
                    </h3></div>
                </div>
            </Link>
            <div className={styles.buttons}>
                <button onClick={handleAddToCart}>{t("addToCart")}</button>

                <Link href={`/Checkout?product_id=${data.id}&price=${data.price}`}>
                    <button>{t("buyNow")}</button>
                </Link>

            </div>
        </div>
    )
}

export default Card