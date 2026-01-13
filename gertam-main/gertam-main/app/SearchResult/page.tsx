"use client";
import styles from "./SearchResult.module.css";
import Navbar from "../../components/Navbar/Navabr";
import Footer from "../../components/Footer/footer";
import ProductFilters from "../../components/shop/ProductFilters/ProductFilters";
import "../globals.css";
import ProductCatregories from "../../components/shop/ProductCatregories/ProductCatregories";
import Card from "@/app/ui/ProductsSlider/Card/Card";
import { useEffect, useState } from "react";
import { FaFrownOpen } from "react-icons/fa";
import Loading from "@/app/ui/loaders/Loading";
import { useSearchParams } from "next/navigation";
import {useTranslation} from "react-i18next";

// --- Client-only wrapper لقراءة Search Params ---
const SearchParamsWrapper = ({ setBrand, setModel, setYear, setEngine, setQ, setCompany }: any) => {
    const searchParams = useSearchParams();

    useEffect(() => {
        setBrand(searchParams.get("brand"));
        setModel(searchParams.get("model"));
        setYear(searchParams.get("year"));
        setEngine(searchParams.get("engine"));
        setQ(searchParams.get("q"));
        setCompany(searchParams.get("company"));
    }, [searchParams]);

    return null;
};

// --- الصفحة الرئيسية ---
const SearchResult = () => {
    const [brand, setBrand] = useState<string | null>(null);
    const [model, setModel] = useState<string | null>(null);
    const [year, setYear] = useState<string | null>(null);
    const [engine, setEngine] = useState<string | null>(null);
    const [q, setQ] = useState<string | null>(null);
    const [company, setCompany] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [Data, setData] = useState<any>(null);

    const [discount, setDiscount] = useState<boolean>(false);
    const [reviews, setReviews] = useState<boolean>(false);
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });


    const {t} = useTranslation();
    // --- جلب بيانات المنتجات ---
    const getCars = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/searchData`);
            const data = await res.json();
            setData(data);
        } catch (err) {
        }
    };

    useEffect(() => {
        getCars();
    }, []);

    // --- البحث حسب params ---
    useEffect(() => {
        const fetchResults = async () => {
            try {
                let url = "";

                if (brand && model && year) {
                    url = `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/search?brand=${brand}&model=${model}&year=${year}&engine=${engine}`;
                } else if (company) {
                    url = `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/searchCompany?company=${encodeURIComponent(company)}`;
                } else if (q) {
                    url = `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/products/search?q=${encodeURIComponent(q)}`;
                }

                if (url) {
                    const res = await fetch(url);
                    const data = await res.json();
                    setResults(data.data || data);
                    setQuery(q || "");
                } else {
                    setResults([]);
                }
            } catch (err) {
            }
        };

        fetchResults();
    }, [brand, model, year, engine, q, company]);

    if (!Data) return <Loading />;

    let filteredResults = Array.isArray(results)
        ? results.filter((item: any) => {
            const search = query.toLowerCase().trim();
            const fields = ["ar_name", "ar_description", "en_description", "en_name"];
            return fields.some((field) => (item[field] || "").toLowerCase().includes(search));
        })
        : [];

    if (discount) filteredResults = filteredResults.filter((item: any) => item.old_price > item.price);
    if (reviews) filteredResults = filteredResults.filter((item: any) => item.reviews.length > 0);
    if (priceRange.min > 0 || priceRange.max > 0) {
        filteredResults = filteredResults.filter((item: any) => {
            const price = item.price;
            const minOk = priceRange.min > 0 ? price >= priceRange.min : true;
            const maxOk = priceRange.max > 0 ? price <= priceRange.max : true;
            return minOk && maxOk;
        });
    }

    return (
        <div className={styles.SearchResult}>
            <Navbar />
            <SearchParamsWrapper
                setBrand={setBrand}
                setModel={setModel}
                setYear={setYear}
                setEngine={setEngine}
                setQ={setQ}
                setCompany={setCompany}
            />

            {query && query !== "" && <h1 className={styles.title}>{t("Search results for")}: {query}</h1>}

            <div className="container">
                <div className={styles.content}>
                    <ProductCatregories setDiscount={setDiscount} setReviews={setReviews} setPriceRange={setPriceRange} />

                    <div className={styles.searchResults}>
                        {/*<ProductFilters />*/}
                        <div className={styles.search}>
                            <input
                                type="search"
                                placeholder={t("searchPlaceHolder")}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.cards}>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((item: any) => <Card key={item.id} data={item} />)
                            ) : (
                                <div className={styles.nores}>
                                    <FaFrownOpen size={80} color="#555" />
                                    <h1>{t("No results found")}</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SearchResult;
