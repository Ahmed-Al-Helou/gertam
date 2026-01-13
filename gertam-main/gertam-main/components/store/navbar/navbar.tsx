import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import styles from "./navbar.module.css";

const Navbar = ({Store} : {Store:any}) =>{
    return(
         <div className={styles.navbar}>
            <div className={styles.logo}>
                <img src={Store.logo || "/store.png"} alt="" />
            </div>
            <h3>{Store.name}</h3>
            <div className={styles.search}>
                <input type="search" name="" id="" placeholder="ابحث عن منتج"/>
            </div>
            <IoSearchOutline  className={styles.icons}/>
            <IoCartOutline  className={styles.icons}/>
          </div>
    )
}

export default Navbar;