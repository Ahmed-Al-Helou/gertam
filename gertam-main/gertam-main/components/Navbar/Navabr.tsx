"use client";
import styles from "./Navbar.module.css";
import { GiHomeGarage } from "react-icons/gi";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getUser } from "@/app/utils/auth";
import useLiveSearch from "@/app/utils/products";
import {useGetAllCategories} from "@/hooks/categorie/useCategories";
import {currency} from "@/app/utils/currency";
import DATA from "@/app/data/home"
import {useCartContext} from "@/Context/CartContext";
import Link from "next/link";
import i18n from "i18next";
import {useTranslation} from "react-i18next";
type LanguageItem = { id: number; value: string; language: string };
type CurrencyItem = { id: number; value: string; cucurrency: string };
type CartItem = { id: number; productId: number };
type user = { id: number; name: string; number: string; email: string };
type sectionsItem = { id: number; title: string; logo: string };

type NavbarData = {
    language: LanguageItem[];
    currencyes: CurrencyItem[];
    cart: CartItem[];
    favorite: CartItem[];
    user: user;
    sections: sectionsItem[];
};

// ---------------------- Top ----------------------
const Top = ({ data }: { data: NavbarData }) => {
    const { i18n , t} = useTranslation();

    const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof currency>(
        "SAR"
    );
    const [selectedLang, setSelectedLang] = useState<string>(() => {
        // حاول نأخذ اللغة من i18n أولاً ثم من localStorage ثم افتراضي "ar"
        if (typeof window !== "undefined") {
            return (
                localStorage.getItem("lang") ||
                i18n.language ||
                "ar"
            );
        }
        return i18n.language || "ar";
    });

    // استرجاع العملة عند التحميل
    useEffect(() => {
        const savedCurrency = localStorage.getItem("currency");
        if (savedCurrency && (savedCurrency in currency)) {
            setSelectedCurrency(savedCurrency as keyof typeof currency);
        }

        // طبق اللغة المحفوظة أو الحالية
        const savedLang = localStorage.getItem("lang") || i18n.language;
        if (savedLang) {
            setSelectedLang(savedLang);
            // تأكد من تغيير اللغة فقط إن اختلفت
            if (i18n.language !== savedLang) {
                i18n.changeLanguage(savedLang).catch(() => {});
            }
            document.documentElement.lang = savedLang;
            document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // تغيير العملة
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value as keyof typeof currency;
        setSelectedCurrency(newCurrency);
        localStorage.setItem("currency", newCurrency);
        // إعادة تحميل ليست ضرورية عادةً، استعملها فقط لو يلزم
        // window.location.reload();
    };

    // تغيير اللغة
    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setSelectedLang(newLang);
        i18n.changeLanguage(newLang).catch(() => {});
        localStorage.setItem("lang", newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    };

    return (
        <div className={styles.grad}>
            <div className={styles.currencyLanguage}>
                {/* اختيار اللغة */}
                <select
                    className={styles.language}
                    value={selectedLang}
                    onChange={handleLangChange}
                >
                    {data.language.map((item) => (
                        <option key={item.id} value={item.value}>
                            {item.language}
                        </option>
                    ))}
                </select>

                {/* اختيار العملة */}
                <select
                    className={styles.currency}
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                >
                    {Object.entries(currency).map(([code, { name, symbol }]) => (
                        <option key={code} value={code}>
                            {name} 
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.linkes}>
                <a href="/help">{t("questions")}</a>
                <a href="/track"> {t("trackOrder")}</a>
            </div>
        </div>
    );
};

// ---------------------- Search Query ----------------------
const SaerchQuery = ({ results }: { results: any[] }) => {
    const {t, i18n} = useTranslation();
    if (!results || results.length === 0) return (
        <div className={styles.query}>
            <div className={styles.result}>
                <h2>{t("No results found")} </h2>
            </div>
        </div>
    );

    return (
        <div className={styles.query}>
            {results.map((item, idx) => (
                    <a href={`SearchResult?q=${item.en_name}`} key={idx}>
                        <div className={styles.result}>
                            <h1>{item[`${i18n.language}_name`]}</h1>
                            <img className={styles.itemImage} src={item.thumbnail || "/no-image.jpeg"} />
                        </div>
                    </a>
                )
            ) }
        </div>

    );
};

// ---------------------- Middle ----------------------
const Middle = ({ data }: { data: NavbarData }) => {
    const [cartCount, setCartCount] = useState<number>(0);
    const [query, setQuery] = useState<string>("");
    const [faver, setFaver] = useState<any[]>([]);
    const {cart} = useCartContext();

    const { i18n , t} = useTranslation();

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "السعودية",
        avatar_url: "",
    });

    // البحث
    const { results, loading } = useLiveSearch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/products/search`,
        query
    );

    useEffect(() => {
        const getUserData = async () => {
            const user = await getUser();
            if (!user || !user.name) return;

            setProfileData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                country: user.country || "",
                avatar_url: user.avatar_url || "",
            });

        };


        getUserData();

    }, []);

    useEffect(() => {
        setCartCount(cart.length);
    }, [cart]);

    return (
        <div className={styles.middle}>
           <a href="/" > <img src="/logo.png" alt="" className={styles.logo} /></a>
            <a href="/garage">
                <div className={styles.garage}>
                    <GiHomeGarage className={styles.icon} />
                    <div className={styles.garageText}>
                        <span> {t("addCar")} </span>
                        <h5>{t("garage")}</h5>
                    </div>
                </div>
            </a>

            <div className={styles.search}>
                <input
                    type="search"
                    placeholder={t("searchPlaceHolder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <CiSearch className={styles.saerchIcon}  />
                <SaerchQuery results={results} />
            </div>

            <a href="/profile">
                <div className={styles.acount}>
                    {profileData.avatar_url !==null && profileData.avatar_url !== "/no-image.jpeg" && profileData.avatar_url ? (
                        <img
                            src={`${profileData.avatar_url}`}
                            alt=""
                            className={styles.profileImage}
                        />
                    ) : (
                        <FaRegUser className={styles.icon} />
                    )}

                    {profileData.name ? (
                        <div className={styles.acountText}>
                            <span>{t("welcome")}</span>
                            <h5>{profileData.name}</h5>
                        </div>
                    ):(
                        <div className={styles.acountText}>
                            <span>{t("login")} </span>
                            <h5> </h5>
                        </div>
                    )}

                </div>
            </a>

            <div className={styles.favorite}>
                <a href="/favorites">
                    <MdFavoriteBorder className={styles.favorite} />
                    <span>{faver.length || 0}</span>
                </a>
            </div>

            <div className={styles.cart}>
                <a href="/cart">
                    <CiShoppingCart className={styles.icon} />
                    <span>{cartCount}</span>
                </a>
            </div>
        </div>
    );
};

// ---------------------- Footer ----------------------
const Cards = ({ data }: { data: any[] }) => (
    <>
        {data.map((item, i) => (
            <Link href={`/categorie/${item.id}`} key={i}>
                <div className={styles.card} >
                    <div className={styles.sectionImage}>
                        <img src={item.ad_imae_url || "no-image.jpeg"} alt="" loading="lazy" />
                        <h5>{item.name}</h5>
                    </div>
                </div>
            </Link>
        ))}
    </>
);

const AllSctionsWindow = () => {
    const {data: categories ,loading,error} = useGetAllCategories();
    const {t, i18n} = useTranslation();
    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.allsectionsWindow}>
            <div className={styles.cardsSections}>
                <Cards data={categories} />
            </div>
            <div className={styles.lineSections}>
                <ul className={styles.lineSectionsMenu}>
                    <li>
                        <a href="/shop" className="active">
                            {t("shop")}
                        </a>
                    </li>
                    {categories.map((item, i) => (
                        <li key={i}>
                            <Link href={`/categorie/${item.id}`}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const Footer = ({ data }: { data: NavbarData }) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    return (
    <div className={styles.footer}>
        <div className={styles.menu}>
            <div 
            className={styles.allSections}
            onClick={() => setIsOpen(!isOpen)}
            >
                <IoIosMenu size={27}/>
                <a href="#">
                    <h5>{t("Categories")}</h5>
                </a>
           { isOpen && (
            <AllSctionsWindow />
           )}
            
         
            </div>
            <div className={styles.navHomeSectins}>
                <a href="/">
                    <h5>{t("home")}</h5>
                </a>
            </div>
            <div className={styles.navShopSectins}>
                <a href="/shop">
                    <h5>{t("shop")}</h5>
                </a>
            </div>
            <a href="/traders">
                <h5 className={styles.merchants}>{t("suppliers")}</h5>
            </a>
            <a href="/brands">
                <h5 className={styles.Brands}>{t("brands")}</h5>
            </a>
            <a href="/blog">
                <h5 className={styles.blog}>{t("blog")}</h5>
            </a>
            <a href="/contactUs">
                <h5 className={styles.contactUs}> {t("contactUs")}</h5>
            </a>
            <a href="/help">
                <h5 className={styles.help}>{t("questions")}</h5>
            </a>
        </div>
        <div className={styles.bestSeller}>
            <h5> {t("bestSeller")}</h5>
        </div>
    </div>
    )
};

// ---------------------- Navbar ----------------------
const Navbar = () => {

    const data = DATA.navbar;
    return (
        <div className={styles.navbar}>
            <div className="container">
                <Top data={data}/>
                <Middle data={data}/>
            </div>
            <div className={styles.Footer}>
                <div className="container">
                    <Footer data={data}/>
                </div>
            </div>
        </div>
    )

};

export default Navbar;
