"use client";
import {  useState } from "react";
import styles from "./favorites.module.css";
import { MdDelete } from "react-icons/md";
import Navabr from "@/components/Navbar/Navabr";

import Footer from "@/components/Footer/footer";


type FavoriteItem = {
    id: number;
    ar_name: string;
    en_name: string;
    name: string;
    thumbnail: string;
    product_id: number | null;
};

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState<boolean | string>(true);



    // حذف عنصر من المفضلة
    const removeFavorite = async (product_id: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/favorites/${product_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("فشل حذف المنتج");
            setFavorites(favorites.filter((f) => f.product_id !== product_id));
        } catch (err) {
        }
    };



    if (loading) return <p className={styles.loading}>جاري التحميل...</p>;

    if (favorites.length === 0)
        return <p className={styles.empty}>ماكو منتجات بالمفضلة</p>;

    return (

        <div >
            <Navabr/>

            <div className={styles.grid}>
                {favorites.map((item) => (
                    <a href={`/Product/${item.id}`} key={item.id}>
                        <div  className={styles.card}>
                            <img
                                src={item.thumbnail}
                                alt={item.name}
                                className={styles.productImage}
                            />
                            <h2 className={styles.productName}>{item.ar_name}</h2>
                            <button
                                onClick={() => removeFavorite(item.id)}
                                className={styles.deleteButton}
                                title="إزالة من المفضلة"
                            >
                                <MdDelete />
                            </button>
                        </div>
                    </a>
                ))}
            </div>
            <Footer />
        </div>
    );
}
