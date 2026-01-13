"use client"
import styles from "../store.module.css";
import Navbar from "../../../components/store/navbar/navbar";
import Search from "../../ui/Search/Search";
import Card from "../../ui/ProductsSlider/Card/Card";
import ProductFilters from "../../../components/shop/ProductFilters/ProductFilters";
import ProductCatregories from "../../../components/shop/ProductCatregories/ProductCatregories";
import {useStore} from "@/hooks/store/useStore";
import {useStoreProducts} from "@/hooks/store/useStoreProducts";
import Loading from "@/app/ui/loaders/Loading";
import React, {useState} from "react";
import {FaFrownOpen} from "react-icons/fa";

interface Props {
    params: Promise<{ id: string }>;
}
const Store = ({ params }: Props) => {

    const { id } = React.use(params);

    const {data, isLoading} = useStoreProducts(Number(id));
    const {data:Store} = useStore(Number(id));
    // filteredData By Filter buttons
    const [discount, setDiscount] = useState<boolean>(false);
    const [reviews, setReviews] = useState<boolean>(false);
    const [priceRange, setPriceRange] = useState<{min: number; max: number}>({
        min: 0,
        max: 0,
    });
    const [query, setQuery] = useState<string>(""); // input المستخدم


    if (isLoading) return <Loading />;


    let filteredResults = Array.isArray(data)
        ? data.filter((item: any) => {
            const search = query.toLowerCase().trim();

            // الحقول اللي تريد تبحث بيها
            const fields = ["ar_name", "ar_description", "en_description", "en_name"];

            // إذا أي حقل يحتوي الكلمة
            return fields.some((field) =>
                (item[field] || "").toLowerCase().includes(search)
            );
        })
        : [];

    if(discount){
        filteredResults = filteredResults.filter((item:any) => item.old_price > item.price);
    }
    if(reviews){
        filteredResults = filteredResults.filter((item:any) => item.reviews.length > 0);
    }
    if (priceRange.min > 0 || priceRange.max > 0) {
        filteredResults = filteredResults.filter((item: any) => {
            const price = item.price; // غيّرها حسب المفتاح الصحيح من الـ API
            const minOk = priceRange.min > 0 ? price >= priceRange.min : true;
            const maxOk = priceRange.max > 0 ? price <= priceRange.max : true;
            return minOk && maxOk;
        });
    }
  return (
    <div className={styles.store}>
      <div className="container">
        <Navbar Store={Store}/>
      </div>
      <img src={Store.store_picture || "/store-bg.png"} alt="" className={styles.store_bg} />
      <div className={styles.Search}>
          <h1> {Store.name}</h1>
        <Search  />
      </div>
      <div className={styles.SearchResult}>
                <div className="container">
                  <div className={styles.content}>
                    <ProductCatregories setPriceRange={setPriceRange} setDiscount={setDiscount} setReviews={setReviews} />
                  <div className={styles.searchResults}>
                    <ProductFilters/>
                      <div className={styles.search}>
                          {/*<Search data={Data} />*/}

                          <input
                              type="search"
                              placeholder="ابحث عن اسم المنتج"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              className={styles.searchInput}
                          />
                      </div>
                      <div className={styles.cards}>
                          {filteredResults.length > 0 ? (
                              filteredResults.map((item: any) => (
                                  <Card
                                      key={item.id}
                                      data={item}
                                  />
                              ))
                          ) : (
                              <div className={styles.nores}>
                                  <FaFrownOpen size={80} color="#555"/>
                                  <h1 >لا توجد نتائج</h1>
                              </div>

                          )}
                      </div>
                  </div>
                  </div>
                 
                </div>
                
            
        </div>
    </div>
  );
};

export default Store;
