"use client";

import { useEffect, useState } from "react";

// Components
import Navbar from "../components/Navbar/Navabr";
import Hero from "../components/Hero/Hero";
import Brands from "../components/Brands/brands";
import Slider from "@/app/ui/ProductsSlider/Slider/slider";
import CustomerReviews from "../components/CustomerReviews/CustomerReviews";
import HowTo from "../components/HowTo/Howto";
import Discount from "../components/Discount /discount";
import Help from "../components/Help/help";
import Ask from "../components/Ask/ask";
import Articles from "../components/Articles/articles";
import Footer from "../components/Footer/footer";
import Loading from "@/app/ui/loaders/Loading";

// Data
import data from "@/app/data/home";
import OneTimePopup from "@/components/OneTimeAdd/page";
import FloatingSupportChat from "@/components/Support/Support";
import {useTranslation} from "react-i18next";


export default function Home() {
    const [searchData, setSearchData] = useState<any>(null);
    const [sliderData, setSliderData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [discount, setDiscount] = useState<any>(null);

    const {t, i18n} = useTranslation();


    useEffect(() => {
        const getData = async () => {
            try {
                const urls = [
                    `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/searchData`,
                    `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/slider/1`,
                    `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/slider/2`,
                    `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/slider/3`,
                    `${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/Discount`,
                ];

                const responses = await Promise.all(urls.map((url) => fetch(url)));
                const jsonData = await Promise.all(responses.map((res) => res.json()));

                setSearchData(jsonData[0]);
                setSliderData(jsonData.slice(1,4)); // [slider1, slider2, slider3]
                setDiscount(jsonData[4]);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!searchData) {
        return <div>Error: No data available</div>;
    }



    return (
        <>
            <OneTimePopup />
            <Navbar />
            <FloatingSupportChat />
            <Hero data={searchData} />
            <Brands data={data.brands} />
            {sliderData[0] && <Slider data={sliderData[0]} />}
            <CustomerReviews />
            <HowTo />
            {discount && (
                <Discount data={discount}/>
            )}

            {sliderData[1] && <Slider data={sliderData[1]} />}
            <Help />
            {sliderData[2] && <Slider data={sliderData[2]} />}
            <Ask />
            <Articles />
            <Footer />
        </>
    );
}
