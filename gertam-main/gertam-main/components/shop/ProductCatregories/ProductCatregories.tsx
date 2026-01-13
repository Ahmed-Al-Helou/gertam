"use client"
import styles from "./ProductCatregories.module.css";
import {useState} from "react";
import {useTranslation} from "react-i18next";

type Props = {
    setDiscount: (value: any | null) => void;
    setReviews: (value: any | null) => void;
    setPriceRange: (range: { min: number; max: number }) => void;

}
const Optaons = ({setDiscount, setReviews} : Props) =>{

    const {t} = useTranslation();

    return(
                    <div className={styles.categoriesList}>
                <label className={styles.checkbox} >
                    <input type="checkbox" onChange={() => setDiscount((prev:any) => !prev)}/>
                    {t("Discount on the product")}
                    <span className={styles.checkmark}></span>
                </label>
                <label className={styles.checkbox} >
                    <input type="checkbox" onChange={() => setReviews((prev:any) => !prev)}/>
                    {t("reviews")}
                    <span className={styles.checkmark}></span>
                </label>
                  <label className={styles.checkbox} >
                    <input type="checkbox" />
                      {t("new")}
                    <span className={styles.checkmark}></span>
                </label>
                
            </div>
    )
}
const FilterByPrice = ({setPriceRange} : Props) =>{
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const handleFilter = () => {
        setPriceRange({ min, max });
    };
    const {t} = useTranslation();
    return(
        <div className={styles.filterByPrice}>
            <h3>{t('Filter by price')}</h3>
            <div className={styles.priceInputs}>
                <input type="number" placeholder="Min" min={0}  value={min}
                       onChange={(e) => setMin(Number(e.target.value))}/>
                <span>-</span>
                <input type="number" placeholder="Max" min={0} value={max}
                       onChange={(e) => setMax(Number(e.target.value))}/>
            </div>
            <button className={styles.filterButton}  onClick={handleFilter}>Filter</button>
        </div>
    )
}

const FilterByColor = () =>{
    const {t } = useTranslation();
    return(
        <div className={styles.filterByColor}>
            <h3>{t("Filter by Color")}</h3>
            <div className={styles.colorOptions}>
                <span className={styles.colorOption} style={{backgroundColor: 'red'}}></span>
                <span className={styles.colorOption} style={{backgroundColor: 'blue'}}></span>
                <span className={styles.colorOption} style={{backgroundColor: 'green'}}></span>
                <span className={styles.colorOption} style={{backgroundColor: 'yellow'}}></span>
                <span className={styles.colorOption} style={{backgroundColor: 'black'}}></span>
                <span className={styles.colorOption} style={{backgroundColor: 'white', border: '1px solid #ccc'}}></span>
            </div>
        </div>
    )
}
const FilterByBrand = () =>{
    return(
        <div className={styles.filterByBrand}>
            <h3>Filter by Brand</h3>
            <div className={styles.brandOptions}>
                <label className={styles.checkbox}>
                    <input type="checkbox" />
                         Brand 1
                    <span className={styles.checkmark}></span>
                </label>   
                <label className={styles.checkbox}>
                    <input type="checkbox" />
                         Brand 2
                    <span className={styles.checkmark}></span>
                </label>   
                <label className={styles.checkbox}>
                    <input type="checkbox" />
                         Brand 3
                    <span className={styles.checkmark}></span>
                </label>   
                <label className={styles.checkbox}>
                    <input type="checkbox" />
                         Brand 4
                    <span className={styles.checkmark}></span>
                </label>   
            </div>
        </div>
    )
}

const ProductCatregories = ({setDiscount, setReviews, setPriceRange} : Props) => {
    const {t} = useTranslation();
    return (
        <div className={styles.productCatregories}>

            <h2>{t("Search filters")}</h2>
            <Optaons     setDiscount={setDiscount}
                         setReviews={setReviews}
                         setPriceRange={setPriceRange} />
            <FilterByPrice     setDiscount={setDiscount}
                               setReviews={setReviews}
                               setPriceRange={setPriceRange} />
            <FilterByColor/>
        </div>
    )
}

export default ProductCatregories;