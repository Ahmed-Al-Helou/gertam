"use client"
import { AiOutlineProduct } from 'react-icons/ai';
import styles from './ProductFilters.module.css';

const ProductFilters = () => {
    return (
        <div className={styles.productFilters}>
            <div className="TextResult"><h3>Showing 1-12 of 60 results</h3></div>
            <div className={styles.FilterOptions}>
                <span>Sort:</span>
                <select name="sort" id="sort">
                    <option value="featured">Sort by Featured</option>
                    <option value="newest">Sort by Newest</option>
                    <option value="priceLowToHigh">Sort by Price: Low to High</option>
                    <option value="priceHighToLow">Sort by Price: High to Low</option>
                </select>
                <select name="sort" id="sort">
                    <option value="featured">Sort by Featured</option>
                    <option value="newest">Sort by Newest</option>
                    <option value="priceLowToHigh">Sort by Price: Low to High</option>
                    <option value="priceHighToLow">Sort by Price: High to Low</option>
                </select>
                <AiOutlineProduct size={30}/>
            </div>
            
        </div>
    )
}

export default ProductFilters;