"use client";
import styles from "./cart.module.css";
import Navbar from "../../components/Navbar/Navabr";
import Footer from "../../components/Footer/footer";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { IoCubeSharp } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import {useCart} from "@/hooks/cart/useCart";
import Loading from "@/app/ui/loaders/Loading"; // تأكد من المسار
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import {useTranslation} from "react-i18next";
import {useUser} from "@/hooks/auth/useAuth";
import { convertPrice } from "@/app/utils/currency";



const CartPage = () => {
    const {t} = useTranslation();
    const {data, loading, error, updateQuantity, removeItem} = useCart();
    const {userData} = useUser();
    if(loading) return <Loading />;

    const subtotal =  Array.isArray(data) && data.reduce( (acc, item) => acc + Number(item.price) * Number(item.quantity), 0 );
    const shipping = 12; // stored/handled as USD
    const total = Number(subtotal) + shipping;





    if (data.length === 0) {
        return (
            <div className="cartPage">
                <Navbar  />
                <div className="container">
                    <div className={styles.emtyCart}>
                        <PiShoppingCartSimpleLight size={100} />
                        <p>لا توجد منتجات في السله</p>
                        <a href="/">العودة للتسوق</a>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cartPage">
            <Navbar  />
            <div className="container">
                <div className={styles.cartcontent}>
                    <div className={styles.cart}>
                        {/*<div className={styles.message}>*/}
                        {/*    <IoCubeSharp size={22} color="rgba(244, 63, 94, 1)" />*/}
                        {/*    <h5>*/}
                        {/*        Shipping & taxes <span>${shipping.toFixed(2)}</span> calculated*/}
                        {/*        at checkout*/}
                        {/*    </h5>*/}
                        {/*</div>*/}

                        <table className={styles.cartTable}>
                            <thead>
                            <tr>
                                <th>{t('Product')}</th>
                                <th>{t("the price")}</th>
                                <th>{t("Quantity")}</th>
                                <th>{t("the total")}</th>
                                <th>{t("procedure")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(data) && data.map((item:any) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className={styles.product}>
                                            <img src={item.image || item.product?.thumbnail} alt={item.name} />
                                            {item.name}
                                        </div>
                                    </td>
                                    <td>{convertPrice(Number(item.price), "SAR")}</td>
                                    <td>
                                        <div className={styles.atom}>
                      <span
                          onClick={() =>
                              updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                              )
                          }
                      >
                        <LuMinus size={33} />
                      </span>
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(
                                                        item.id,
                                                        Math.max(1, parseInt(e.target.value) || 1)
                                                    )
                                                }
                                                className={styles.quantityInput}
                                            />
                                            <span
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                            >
                        <GoPlus size={33} />
                      </span>
                                        </div>
                                    </td>
                                    <td>{convertPrice(Number(item.price) * Number(item.quantity), "SAR")}</td>
                                    <td><button className={styles.deleteBtn}onClick={()=> removeItem(item.id)}><MdDeleteForever size={22} color={"red"}/></button></td>
                                </tr>
                            ))}

                            </tbody>
                        </table>
                    </div>

                    <div className={styles.cartTotal}>
                        <h3>{t("the total")}</h3>
                        <div className={styles.totalItem}>
                            <span> {t("Subtotal")}</span>
                            <span>{convertPrice(Number(subtotal) || 0, "SAR")}</span>
                        </div>
                        <div className={styles.totalItem}>
              <span>
                <span>{t("Shipping to")} <span>{userData?.country}</span></span>
              </span>
                            <span>{convertPrice(shipping, "SAR")}</span>
                        </div>
                        <div className={styles.totalItem}>
                            <span>{t("the total")}</span>
                            <span>{convertPrice(Number(total) || 0, "SAR")}</span>
                        </div>
                        <Link href={"/Checkout"}><button>{t("Proceed to checkout")}</button></Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;