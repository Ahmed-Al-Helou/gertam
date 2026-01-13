"use client"
import Navbar from "@/components/Navbar/Navabr";
import Footer from "@/components/Footer/footer"
import PremiumAd from "@/components/shop/PremiumAd/PremiumAd";
import Brands from "@/components/shop/Brands/Brands";
import Sections from "@/components/shop/Sections/Sections";
import Section from "@/components/shop/Section/Section";
import ContactUs from "../../components/shop/ContactUs/ContactUs";
import Articles from "../../components/Articles/articles";
import {useShop} from "@/hooks/shop/useShop";
import Loading from "@/app/ui/loaders/Loading";

export default function Shop() {

const {data, isLoading, error} = useShop();


if (isLoading) return <Loading />;

  return (
      <>
    <Navbar/>
      <PremiumAd />
      <Brands />
      <Sections/>
          {data && data.map((item, index) => (
              <div key={index} >
                  <Section data={item} />
              </div>
              ))}

      <ContactUs/>
      <Articles />
      <Footer/>
    </>
  );
}
