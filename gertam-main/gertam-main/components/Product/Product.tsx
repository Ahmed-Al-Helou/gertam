"use client"
import { GoPlus } from "react-icons/go";
import styles from "./product.module.css";
import { LuMinus } from "react-icons/lu";
import React, {useEffect, useState} from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import Reviews from "@/components/Reviews/Reviews";
import { FaStarHalfAlt } from "react-icons/fa";
import {convertPrice, currency} from "@/app/utils/currency";
import Link from "next/link";
import {useCart} from "@/hooks/cart/useCart";
import AlternativePartsTable from "@/components/AlternativePartsTable/AlternativePartsTable";
import {useStore} from "@/hooks/store/useStore";
import {useTranslation} from "react-i18next";



interface ProductCombilitiy {
    message: string;
    cars?: string[];
}

interface reviews {
    id: number;
    user_id: number;
    stars: number;
    comment: string;
    created_at: string ;
}

interface product_units{
    id: number;
    product_id:number;
    unit_id:number;
    price:string | number;
    stock: number;
    products: string[] | null;
}

interface images{
    id: number;
    product_id:number;
    image_url: string;
}

interface ProductData{
    id: number;
    ar_name: string;
    en_name: string;
    ar_description: string;
    en_description: string;
    price: string;
    old_price: string;
    thumbnail?: string;
    categories_id?: number;
    image?: string;
    reviews?: reviews[];
    reviews_count?: number;
    product_units: product_units[];
    part_number: string[] ;
    images: images[];
    store_id: number | number;
    message: string | null;

}

interface ProductProps {
    ProdutData: ProductData;
    ProductCombilitiy: ProductCombilitiy;
}

const TextContent = ({ProdutData, ProductCombilitiy}: {ProdutData: ProductData, ProductCombilitiy: ProductCombilitiy}) =>{

    const [atom, setAtom] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    // Force SAR everywhere
    const curransy = "SAR" as const;
    const [DiscountInt, setDiscountInt] = useState(0);
    const [added, setAdded] = useState(false); // للتحكم بالرسالة

    const {t, i18n} = useTranslation();
    const token = localStorage.getItem("token");
    useEffect(() => {
        const discount = ((Number(ProdutData.old_price ) - Number(ProdutData.price)) / Number(ProdutData.old_price)) * 100;
        const discountInt = Math.floor(discount); // ينطيها بدون فواصل

        setDiscountInt(Number(discountInt));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 1) {
            setAtom(val);
        }
    };

    const calculateAverage = (reviews: reviews[]) => {
        if(!reviews || reviews.length < 1) return 0
        const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
        return reviews.length ? sum / reviews.length : 0;
    };


        const averageRating = calculateAverage(ProdutData.reviews ?? []);

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

    const {addToCart} = useCart();

    const handleAddToCart = async () => {
        await addToCart(Number(ProdutData.id), atom);

        // نظهر الرسالة مؤقتًا
        setAdded(true);
        setTimeout(() => setAdded(false), 1500); // تختفي بعد 1.5 ثانية
    };

    const {data:Store, isLoading} = useStore(ProdutData.store_id);
    return (
        <div className={styles.textContent}>
            <h1 className={styles.title}>{i18n.language === "ar" ? ProdutData.ar_name : ProdutData.en_name} </h1>
            <span><Link href={`/store/${Store.id}`} className={styles.storeName}>{Store.name}   </Link> : {t("store")}</span>
            <div className={styles.detiles}>
                <span className={styles.Measurement}>{t("piece")}</span>
                <div className={styles.reviews}>
                    <span className={styles.reviewCount}>({ProdutData.reviews_count || 0} {t("reviews")})</span>
                    <span className={styles.stars}>
                     {renderStars(averageRating)}
                    </span>
                </div>
            </div>
            <div className={styles.price}>
                <h3 className={styles.productPrice}>{convertPrice(Number(ProdutData.price), curransy)}</h3>
                <span>{ProdutData.old_price ? ` ${convertPrice(Number(ProdutData.old_price), curransy)}` : ""}</span>

            </div>
            <div className={styles.productdescription}>
                <p>{i18n.language === "ar" ? ProdutData.ar_description : ProdutData.en_description}</p>
            </div>

            {/* عرض التوافق مع السيارات */}
            {
                ProductCombilitiy.cars && ProductCombilitiy.cars.length > 0 && token ? (
                    // الحالة الأولى: عند وجود سيارات والتوكن موجود
                    <div className={styles.compatibility}>
                        <IoIosCheckmarkCircleOutline size={40}/>
                        <p>{ProductCombilitiy.message}</p>

                        <div className={styles.carsCombilitiy}>
                            {ProductCombilitiy.cars.map((car, idx) => (
                                <a href="/garage" key={idx}>
                                    <span>{car}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ) : !token ? (
                    // الحالة الثانية: التوكن غير موجود
                    <div className={styles.emtyCombitlity}>
                        <IoWarningOutline size={30}/>
                        <p>عليك تسجيل الدخول واضافة سيارة الى الكراج </p>
                    </div>
                ) : (
                    // <></>
                    // الحالة الثالثة: لا توجد سيارات متوافقة
                    <div className={styles.emtyCombitlity}>
                        <IoWarningOutline size={30}/>
                        <p>{ProductCombilitiy.message}</p>
                    </div>
                )
            }



            <a
                href="https://iwtsp.com/966555392582"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-6 py-3 rounded-full shadow-lg ring-1 ring-black/10 bg-white hover:scale-105 transform transition-all duration-150 m-5"
                aria-label={t("WhatsApp")}
            >

                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
      <path
          d="M20.52 3.48A11.88 11.88 0 0 0 12.01.02C6.07.02 1.21 4.88 1.21 10.82c0 1.9.5 3.76 1.45 5.39L.1 22l5.03-2.03c1.46.8 3.11 1.23 4.88 1.23h.01c5.94 0 10.8-4.86 10.8-10.8 0-2.88-1.12-5.55-3.31-7.89zM12.01 20.3c-1.46 0-2.89-.39-4.12-1.13l-.29-.17-3.36 1.36 1.36-3.28-.19-.33A8.98 8.98 0 0 1 3 10.82c0-5 4.08-9.08 9.08-9.08 2.43 0 4.71.95 6.43 2.67a8.99 8.99 0 0 1-6.5 15.87z"/>
      <path
          d="M17.5 14.3c-.3-.16-1.78-.88-2.06-.98-.28-.1-.48-.16-.69.16-.2.33-.78.98-.95 1.18-.17.2-.35.22-.65.07-.3-.16-1.27-.47-2.41-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.62.13-.12.3-.31.45-.46.15-.15.2-.26.3-.43.1-.16.05-.31-.02-.46-.07-.15-.69-1.68-.95-2.3-.25-.6-.5-.52-.69-.53-.18-.01-.39-.01-.6-.01-.2 0-.52.07-.8.32-.28.25-1.06 1.03-1.06 2.5 0 1.47 1.09 2.9 1.24 3.1.15.2 2.15 3.45 5.21 4.83 3.06 1.38 3.06.92 3.61.86.55-.06 1.78-.72 2.03-1.42.25-.7.25-1.3.18-1.42-.07-.12-.28-.19-.58-.35z"/>
    </svg>
  </span>


                <span className="text-lg font-semibold text-gray-800">{t("WhatsApp")}</span>
            </a>


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

            <div className={styles.actions}>
                {/*{ProdutData.part_number && ProdutData.part_number.length > 0 && (*/}
                {/*    <select>*/}
                {/*        {ProdutData.part_number.map((unit:any, index) => (*/}
                {/*            <option key={unit.id ?? index} value={unit.unit_name}>*/}
                {/*                {unit.unit_name}*/}
                {/*            </option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*)}*/}

                <div className={styles.atom}>
                    <span onClick={() => setAtom(atom + 1)}><GoPlus size={28}/></span>
                    <input type="number" min={1} value={atom} onChange={handleChange} className={styles.quantityInput}/>
                    <span onClick={() => setAtom(Math.max(1, atom - 1))}><LuMinus size={28}/></span>
                </div>
                {ProdutData.product_units.length > 0 ? (
                    <>
                        <button className={styles.addToCartButton} onClick={handleAddToCart}>{t("addToCart")}</button>
                        <Link href={`/Checkout?product_id=${ProdutData.id}&price=${ProdutData.price}`}>
                            <button className={styles.BuyNowBtn}>{t("buyNow")}</button>
                        </Link>
                    </>
                ) : (
                    <p className={styles.No_stok}>غير متوفر حاليا </p>
                )}

            </div>
            <div className={styles.likeAndMonyBack}>
                <span className={styles.like}>❤️{t("Read the description or see the alternative numbers")}</span>
                <span className={styles.moneyBack}>{t("Check out the reviews for a better overview")}</span>
            </div>
            <div>
                {/* الـ Nav */}
                <div className={styles.nav}>
        <span
            className={activeTab === "description" ? styles.active : styles.navItem}
            onClick={() => setActiveTab("description")}
        >
         {t("Description")}
        </span>
                    <span
                        className={activeTab === "additional" ? styles.active : styles.navItem}
                        onClick={() => setActiveTab("additional")}
                    >
          {t("Alternative numbers")}
        </span>
                    <span
                        className={activeTab === "reviews" ? styles.active : styles.navItem}
                        onClick={() => setActiveTab("reviews")}
                    >
          {t("reviews")} {ProdutData.reviews?.length}
        </span>
                </div>

                {/* المحتوى */}
                <div className={styles.tabContent}>
                    {activeTab === "description" && <div className={styles.productDescription}>{

                            <div >
                                <p>{i18n.language === "ar" ? ProdutData.ar_description : ProdutData.en_description}</p>
                            </div>

                    } </div>}
                    {activeTab === "additional" && <div className={styles.alternativeParts}><AlternativePartsTable
                        alternativeParts={ProdutData.part_number}/></div>}
                    {activeTab === "reviews" &&
                        <div className={styles.reviews}><Reviews reviews={ProdutData.reviews ?? []}/></div>}
                </div>
            </div>
        </div>
    );
}

const SliderShow = ({ProdutData}: { ProdutData: ProductData }) => {
    const [activeImage, setActiveImage] = useState(ProdutData.thumbnail);

    return (
        <div className={styles.SliderShow}>
            <div className={styles.activeImage}>
                <img src={activeImage || ProdutData.thumbnail || ProdutData.image || "/no-image.jpeg"} alt=""

                />
            </div>
            <div className="slider">
                {ProdutData.images?.length > 0 && (
                    <div className={styles.imagesSLider}>
                        {ProdutData.images.map((item, index) => (
                            <img key={index} src={item.image_url} alt={`image-${index}`} className={styles.SlideImages}
                                 onClick={() => setActiveImage(item.image_url)} style={{
  border: item.image_url === activeImage ? "2px solid blue" : "none",
  borderRadius: 6
}}
/>
                        ))}
                        
                    </div>
                )}
            </div>
        </div>
    )
}

const Product = ({ProdutData, ProductCombilitiy}: ProductProps) => {
    return (
        <>
            <div className="container">
                <div className={styles.product}>
                    <TextContent ProdutData={ProdutData} ProductCombilitiy={ProductCombilitiy}/>
                    <SliderShow ProdutData={ProdutData}/>
                </div>
            </div>
            {/*<Slider data={data.slider}/>*/}
        </>
    )
}

export default Product;
