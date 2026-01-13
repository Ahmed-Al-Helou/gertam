"use client"
import styles from "./products.module.css"
import Navbar from "@/componets/Navbar/Navbar";
import TooleBar from "@/componets/tooleBar/TooleBar";
import ProductsTable from "@/componets/ProductsTable/ProductsTable";


const Products =  ()=>{
    return (
        <>
        <Navbar />
        <div className={styles.contaciner}>
            <TooleBar />
            <ProductsTable />
        </div>
        </>
    )
}

export default Products;