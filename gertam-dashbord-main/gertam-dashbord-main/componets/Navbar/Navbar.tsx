import styles from "./navbar.module.css"
import { IoNotifications } from "react-icons/io5";
import Image from "next/image";
import { TfiArrowCircleDown } from "react-icons/tfi";
import { CiMenuFries } from "react-icons/ci";
import TooleBar from "../tooleBar/TooleBar";
import MobileToolbar from "../MobileToolbar/MobileToolbar";


const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.notifications}><IoNotifications size={35}/> <span>2</span>
            </div>
            <div className={styles.acount}>
                <Image src={"/me.png"} alt={""} width={50} height={50} className={styles.acountImage}/>
                <div className={styles.acountDetiles}>
                    <div>
                        <h3>Huzaifa.A</h3>
                        <span>Admin</span>
                    </div>
                    <TfiArrowCircleDown size={20} color={"#777"}/>
                </div>
            </div>
            <div className={styles.search}>
                <input type={"search"} placeholder={"بحث .."}/>
            </div>
            <MobileToolbar/>
        </div>
    )
}
export default Navbar;

