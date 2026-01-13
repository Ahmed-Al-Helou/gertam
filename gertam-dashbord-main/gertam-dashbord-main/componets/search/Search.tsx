import styles from "./search.module.css"
import { CiSearch } from "react-icons/ci";
import Link from "next/link";


const Search = () =>{
    return (
        <div className={styles.Search}>
            <Link href="/add-product" className={styles.addProduct}>اضافة منتج جديد </Link>
            <div className={styles.search}>
                <CiSearch size={30} color={"#666"}/>
                <input type={"search"} placeholder={"بحث ..."} />
            </div>
        </div>
    )
}

export default Search;