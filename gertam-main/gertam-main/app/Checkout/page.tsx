"use client";

import {useRouter, useSearchParams} from "next/navigation";
import { IoCubeSharp } from "react-icons/io5";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaHome, FaCity, FaNotesMedical, FaCreditCard, FaCheck } from "react-icons/fa";
import { MdPayments, MdLocalShipping } from "react-icons/md";
import styles from "./checkout.module.css";
import Navbar from "../../components/Navbar/Navabr";
import Footer from "../../components/Footer/footer";
import data from "@/app/data/home";
import { useUser } from "@/hooks/auth/useAuth";
import Loading from "@/app/ui/loaders/Loading";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useCart} from "@/hooks/cart/useCart";
import { convertPrice } from "@/app/utils/currency";



const PaymentOptions = ({ selectedMethod, onMethodChange, supportedMethods }: { selectedMethod: string; onMethodChange: (method: string) => void; supportedMethods?: string[] })=> {
    const {t} = useTranslation();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    const methods = supportedMethods && supportedMethods.length > 0 ? supportedMethods : ["cod", "directpay"];
    const codSupported = methods.includes("cod");
    const directpaySupported = methods.includes("directpay");

    const handlePaymentSelect = (method: string) => {
        onMethodChange(method);
        setShowPaymentModal(false);
    };

    return (
        <>
            {/* زر فتح نافذة الدفع */}
            <div className={styles.paymentSummary} onClick={() => setShowPaymentModal(true)}>
                <div className={styles.paymentSummaryIcon}>
                    {selectedMethod === "cod" ? (
                        <MdLocalShipping size={28} />
                    ) : (
                        <FaCreditCard size={28} />
                    )}
                </div>
                <div className={styles.paymentSummaryContent}>
                    <span className={styles.paymentSummaryLabel}>{t("Choose a payment method")}</span>
                    <span className={styles.paymentSummaryValue}>
                        {selectedMethod === "cod" 
                            ? t("Cash on delivery")
                            : selectedMethod === "directpay"
                            ? "الدفع الإلكتروني"
                            : "اختر طريقة"}
                    </span>
                </div>
                <div className={styles.paymentSummaryArrow}>
                    ▼
                </div>
            </div>

            {/* نافذة الدفع المنبثقة */}
            {showPaymentModal && (
                <div className={styles.paymentModalOverlay} onClick={() => setShowPaymentModal(false)}>
                    <div className={styles.paymentModal} onClick={(e) => e.stopPropagation()}>
                        {/* رأس النافذة */}
                        <div className={styles.paymentModalHeader}>
                            <h2>{t("Choose a payment method")}</h2>
                            <button 
                                className={styles.paymentModalClose}
                                onClick={() => setShowPaymentModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* محتوى الخيارات */}
                        <div className={styles.paymentModalContent}>
                            {/* خيار الدفع عند الاستلام */}
                            {codSupported && (
                                <label
                                    className={`${styles.paymentModalCard} ${
                                        selectedMethod === "cod" ? styles.paymentModalCardActive : ""
                                    }`}
                                    onClick={() => handlePaymentSelect("cod")}
                                >
                                    <div className={styles.paymentModalCardIcon}>
                                        <MdLocalShipping size={40} />
                                    </div>
                                    <div className={styles.paymentModalCardContent}>
                                        <h3>{t("Cash on delivery")}</h3>
                                        <p>ادفع عند استلام الطلب بأمان</p>
                                        <span className={styles.paymentModalBadge}>الأكثر أماناً</span>
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={selectedMethod === "cod"}
                                        onChange={() => {}}
                                        className={styles.paymentRadio}
                                    />
                                    {selectedMethod === "cod" && (
                                        <div className={styles.paymentModalCheckmark}>
                                            <FaCheck size={20} />
                                        </div>
                                    )}
                                </label>
                            )}

                            {/* خيار الدفع الإلكتروني DirectPay */}
                            {directpaySupported && (
                                <label
                                    className={`${styles.paymentModalCard} ${
                                        selectedMethod === "directpay" ? styles.paymentModalCardActive : ""
                                    }`}
                                    onClick={() => handlePaymentSelect("directpay")}
                                >
                                    <div className={styles.paymentModalCardIcon}>
                                        <FaCreditCard size={40} />
                                    </div>
                                    <div className={styles.paymentModalCardContent}>
                                        <h3>الدفع الإلكتروني</h3>
                                        <p>DirectPay - آمن وسريع وموثوق</p>
                                        <span className={styles.paymentModalBadge}>الأسرع</span>
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="directpay"
                                        checked={selectedMethod === "directpay"}
                                        onChange={() => {}}
                                        className={styles.paymentRadio}
                                    />
                                    {selectedMethod === "directpay" && (
                                        <div className={styles.paymentModalCheckmark}>
                                            <FaCheck size={20} />
                                        </div>
                                    )}
                                </label>
                            )}

                            {!codSupported && !directpaySupported && (
                                <p className={styles.noPaymentMethods}>لا توجد طرق دفع متاحة</p>
                            )}
                        </div>

                        {/* زر تأكيد الاختيار */}
                        <div className={styles.paymentModalFooter}>
                            <button 
                                className={styles.paymentModalConfirm}
                                onClick={() => setShowPaymentModal(false)}
                            >
                                تأكيد الاختيار
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
const OrderTotal = ({ price, paymentMethod, onPaymentMethodChange, supportedMethods }: {price: number; paymentMethod: string; onPaymentMethodChange: (method: string) => void; supportedMethods?: string[]}) => {
    const shipping = 12; // USD
    const total = Number(price || 0) + shipping;

    const {t} = useTranslation();

    const {userData, loading} = useUser();
    if (loading) return "Loading...";
    return (
        <div className={styles.cartTotal}>
            <h3>{t("the total")}</h3>
            <div className={styles.totalItem}>
                <span>{t("Subtotal")}</span>
                <span>{convertPrice(Number(price || 0), "SAR")}</span>
            </div>
            <PaymentOptions selectedMethod={paymentMethod} onMethodChange={onPaymentMethodChange} supportedMethods={supportedMethods}/>
            <a href="/editProfile">{t("Change of address")}</a>
            <div className={styles.totalItem}>
                <span>{t("Shipping to")} <span>{userData?.country}</span></span>
                <span>{convertPrice(shipping, "SAR")}</span>
            </div>
            <div className={styles.totalItem}>
                <span>{t("the total")}</span>
                <span>{convertPrice(Number(total), "SAR")}</span>
            </div>
        </div>
    );
};

const Message = ({ price }: {price:number}) => {
    if (price > 200) return;
    return (
        <div className={styles.message}>
        <IoCubeSharp size={22} color="rgba(244, 63, 94, 1)" />
        <h5>
            Shipping & taxes <span>{convertPrice(200 - Number(price), "SAR")}</span> calculated at checkout
        </h5>
        <div className={styles.bar}>
            <div className="fill" style={{ width: "70%", height: 3 }}></div>
        </div>
    </div>)
};


const Form = ({ price, userData, product_id, paymentMethod, onShowPaymentModal } : {price:number, userData:any, product_id:number | null | string, paymentMethod: string, onShowPaymentModal: (formData: any) => void}) => {
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [country, setCountry] = useState(userData?.country || "");
    const [errors, setErrors] = useState<{[key:string]: boolean}>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const validate = ()=>{
        const newErrors: {[key:string]:boolean} = {};

        if(!streetAddress.trim()) newErrors.streetAddress = true;
        if(!city.trim()) newErrors.city = true;
        if(!country.trim()) newErrors.country = true;

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }
    
    const {t} = useTranslation();

    const {data:CartData, loading} = useCart();

    if(loading) return <Loading />

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if(!validate()) {
            return;
        };

        // عند التحقق من صحة البيانات، اعرض نافذة الدفع
        onShowPaymentModal({
            streetAddress,
            city,
            country,
            orderNotes
        });
    };

    return (
        <div className={styles.form}>
            <Message price={price} />
            <div className={styles.formHeader}>
                <h3>{t("invoice")}</h3>
            </div>
            {errorMessage && (
                <div className={styles.errorAlert}>
                    <span>⚠️ {errorMessage}</span>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {/* الاسم */}
                <div className={styles.inputGroup}>
                    <label htmlFor="firstName">
                        <FaUser size={16} /> {t("the name")}
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={userData?.name || ""}
                        readOnly
                    />
                </div>

                {/* العنوان */}
                <div className={styles.inputGroup}>
                    <label htmlFor="streetAddress">
                        <FaHome size={16} /> {t("Street address")}
                    </label>
                    <input
                        type="text"
                        id="streetAddress"
                        placeholder={t("Street address")}
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className={errors.streetAddress ? styles.errorInput : ""}
                    />
                </div>

                {/* المدينة */}
                <div className={styles.inputGroup}>
                    <label htmlFor="city">
                        <FaCity size={16} /> {t("The city")}
                    </label>
                    <input
                        type="text"
                        id="city"
                        placeholder={t("The city")}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={errors.city ? styles.errorInput : ""}
                    />
                </div>

                {/* رقم الهاتف */}
                <div className={styles.inputGroup}>
                    <label htmlFor="phone">
                        <FaPhone size={16} /> {t("phone number")}
                    </label>
                    <input
                        type="text"
                        id="phone"
                        value={userData?.phone || ""}
                        readOnly
                    />
                </div>

                {/* البريد الإلكتروني */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email">
                        <FaEnvelope size={16} /> {t("Email")}
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={userData?.email || ""}
                        readOnly
                    />
                </div>

                {/* الدولة */}
                <div className={styles.inputGroup}>
                    <label htmlFor="country">
                        <FaMapMarkerAlt size={16} /> {t("country")}
                    </label>
                    <input
                        type="text"
                        id="country"
                        placeholder={t("country")}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={errors.country ? styles.errorInput : ""}
                    />
                </div>

                {/* ملاحظات الطلب */}
                <div className={styles.inputGroup}>
                    <label htmlFor="orderNotes">
                        <FaNotesMedical size={16} /> {t("Order Notes")}
                    </label>
                    <textarea
                        id="orderNotes"
                        placeholder={t("Order Notes")}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                    {isSubmitting ? (
                        <>
                            <span className={styles.spinner}></span>
                            {t("Submit Order")}...
                        </>
                    ) : (
                        <>
                            <FaCheck size={18} />
                            {t("Submit Order")}
                        </>
                    )}
                </button>
            </form>
            {showSuccess && <SuccessModal />}
        </div>
    );
};

function SuccessModal() {
    return (
        <>
            <div className="backdrop" role="dialog" aria-modal="true" aria-label="Order successful">
                <div className="card" aria-hidden="false">
                    <div className="icon-wrap">
                        <svg className="check-svg" viewBox="0 0 52 52" aria-hidden="true">
                            <circle className="check-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="check-check" fill="none" d="M14 27 l8 8 l16 -18" />
                        </svg>
                    </div>
                    <h2>تم إرسال الطلب بنجاح</h2>
                </div>
            </div>

            <style jsx>{`
        .backdrop {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.4);
          z-index: 9999;
          animation: fadeIn 160ms ease-out;
        }

        .card {
          background: #fff;
          padding: 28px 32px;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateY(0);
          animation: popIn 420ms cubic-bezier(.2,.9,.3,1);
          min-width: 260px;
        }

        .icon-wrap {
          width: 96px;
          height: 96px;
          border-radius: 999px;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom: 12px;
          background: linear-gradient(135deg,#e6fbff,#e8fff2);
          box-shadow: 0 6px 18px rgba(11,116,222,0.12);
        }

        .check-svg {
          width: 64px;
          height: 64px;
        }

        /* الدائرة (خلف) - ترسم تدريجياً */
        .check-circle {
          stroke: #0b74de;
          stroke-width: 2;
          stroke-dasharray: 170;
          stroke-dashoffset: 170;
          transform-origin: center;
          animation: drawCircle 540ms ease-out forwards;
        }

        /* علامة الصح - رسم الخط */
        .check-check {
          stroke: #0b74de;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: drawCheck 420ms 320ms cubic-bezier(.2,.9,.3,1) forwards;
        }

        h2 {
          margin: 0;
          font-size: 16px;
          color: #0f1724;
          font-weight: 600;
          text-align: center;
        }

        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }

        @keyframes drawCheck {
          0% { stroke-dashoffset: 40; transform: scale(0.9); opacity: 0.6; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { stroke-dashoffset: 0; transform: scale(1); opacity: 1; }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.96); }
          60% { transform: translateY(-6px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes fadeIn {
          from { background: rgba(0,0,0,0); }
          to { background: rgba(0,0,0,0.4); }
        }

        /* استجابة صغيرة */
        @media (max-width:420px) {
          .card { padding: 20px; min-width: 220px; }
          .icon-wrap { width:76px; height:76px; }
          .check-svg { width:52px; height:52px; }
        }
      `}</style>
        </>
    );
}

const CheckoutPage = () => {
    const [productId, setProductId] = useState<string | null>(null);
    const [price, setPrice] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [supportedPaymentMethods, setSupportedPaymentMethods] = useState<string[]>(["cod", "directpay"]);
    const [showPaymentModal, setShowPaymentModal] = useState(false); // النافذة تظهر بعد ملء البيانات
    
    // بيانات النموذج لإرسالها عند اختيار طريقة الدفع
    const [formData, setFormData] = useState<any>(null);
    
    const router = useRouter();
    const searchParams = typeof window !== "undefined" ? useSearchParams() : null;

    const {data:CartData, loading: cartLoading} = useCart();
    const { userData, loading: userLoading } = useUser();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) location.href = "/Login";
        if (!searchParams) return;

        const product_id = searchParams.get("product_id");
        const product_price = parseFloat(searchParams.get("price") || "0");

        setProductId(product_id);

        if(product_id) {
            // حالة شراء منتج واحد
            setPrice(product_price);
            // جلب بيانات المنتج لمعرفة طرق الدفع المدعومة
            fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/product/${product_id}`)
                .then(res => {
                    if (!res.ok) {
                        console.warn(`Failed to fetch product data: HTTP ${res.status}`);
                        throw new Error(`HTTP ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    // التحقق من أن البيانات هي JSON صحيح
                    if (data && typeof data === 'object') {
                        // إذا كان الدفع عند الاستلام متوفر، أضف الدفع الإلكتروني تلقائياً
                        let methods = data.supported_payment_methods || [];
                        
                        if (!Array.isArray(methods)) {
                            methods = [];
                        }
                        
                        // إذا كان COD متوفر، أضف DirectPay تلقائياً
                        if (methods.includes("cod") && !methods.includes("directpay")) {
                            methods.push("directpay");
                        }
                        
                        // إذا لم تكن هناك طرق محددة، استخدم القيم الافتراضية
                        if (methods.length === 0) {
                            methods = ["cod", "directpay"];
                        }
                        
                        setSupportedPaymentMethods(methods);
                        // تعيين طريقة الدفع الافتراضية إلى الطريقة الأولى المتاحة
                        if (methods.length > 0) {
                            setPaymentMethod(methods[0]);
                        }
                    }
                })
                .catch(err => {
                    // في حالة الخطأ، استخدم الطرق الافتراضية (COD + DirectPay)
                    setSupportedPaymentMethods(["cod", "directpay"]);
                    setPaymentMethod("cod");
                });
        } else if(CartData?.length) {
            // حالة السلة كاملة
            const totalPrice = CartData.reduce((sum, item) => {
                const itemPrice = parseFloat(item.price || item.product?.price || 0);
                const quantity = parseInt(item.quantity || 1);
                return sum + itemPrice * quantity;
            }, 0);
            setPrice(totalPrice);
            // في حالة السلة، تحقق من أن جميع المنتجات تدعم نفس طرق الدفع
            const allPaymentMethods = CartData.map((item: any) => item.product?.supported_payment_methods || ["cod", "directpay"]);
            const commonMethods = ["cod", "directpay"].filter(method => 
                allPaymentMethods.every((methods: any) => methods.includes(method))
            );
            if (commonMethods.length > 0) {
                setSupportedPaymentMethods(commonMethods);
            }
        }
    }, [searchParams, CartData]);

    const handlePaymentConfirm = async () => {
        if (!formData) return;
        
        const { streetAddress, city, country, orderNotes } = formData;
        
        try {
            const orderData = {
                user_id: userData?.id,
                name: userData?.name,
                phone: userData?.phone,
                email: userData?.email,
                productId: productId,
                country: country,
                streetAddress,
                city,
                orderNotes,
                price,
                cart: CartData.length ? CartData : [{ product_id: productId, quantity: 1 }],
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/checkOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!res.ok) {
                throw new Error("فشل إرسال الطلب");
            }

            const data = await res.json();

            // Now process payment
            if (paymentMethod === "directpay") {
                // Initiate DirectPay payment
                try {
                    const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/payment/initiate`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            order_id: data.order_id,
                            payment_method: "directpay",
                        }),
                    });

                    if (!paymentRes.ok) {
                        let serverMessage = null;
                        try {
                            const clone = paymentRes.clone();
                            serverMessage = await clone.json();
                        } catch (e) {
                            try {
                                serverMessage = await paymentRes.text();
                            } catch (e2) {
                                serverMessage = null;
                            }
                        }

                        if (paymentRes.status === 401) {
                            console.warn("Payment initiation returned 401 - redirecting to login", serverMessage);
                            localStorage.removeItem("token");
                            window.location.href = "/Login";
                            return;
                        }

                        const backendMsg = serverMessage && serverMessage.message ? serverMessage.message : (typeof serverMessage === 'string' ? serverMessage : null);
                        throw new Error(backendMsg || "فشل في بدء عملية الدفع");
                    }

                    const paymentData = await paymentRes.json();
                    
                    if (paymentData.payment_form_data && paymentData.payment_url) {
                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = paymentData.payment_url;
                        
                        Object.keys(paymentData.payment_form_data).forEach(key => {
                            const input = document.createElement('input');
                            input.type = 'hidden';
                            input.name = key;
                            input.value = paymentData.payment_form_data[key];
                            form.appendChild(input);
                        });
                        
                        document.body.appendChild(form);
                        form.submit();
                    } else {
                        throw new Error("لم يتم الحصول على بيانات الدفع. الرجاء المحاولة لاحقًا.");
                    }
                } catch (paymentError) {
                    const errorMsg = paymentError instanceof Error ? paymentError.message : "حدث خطأ في عملية الدفع";
                    alert(errorMsg);
                    setShowPaymentModal(false);
                }
            } else {
                // COD payment
                setShowPaymentModal(false);
                router.push("/order-success");
            }

        } catch (error) {
            alert("حدث خطأ يرجى اعادة المحاولة");
            setShowPaymentModal(false);
        }
    };

    if(cartLoading || userLoading) return <Loading />;

    return (
        <div className={styles.checkout}>
            <Navbar />
            <div className="container mt-5">
                <div className={styles.checkoutContent}>
                    <Form 
                        price={price} 
                        userData={userData} 
                        product_id={productId} 
                        paymentMethod={paymentMethod}
                        onShowPaymentModal={(data) => {
                            setFormData(data);
                            setShowPaymentModal(true);
                        }}
                    />
                    <OrderTotal 
                        price={price} 
                        paymentMethod={paymentMethod} 
                        onPaymentMethodChange={setPaymentMethod} 
                        supportedMethods={supportedPaymentMethods}
                    />
                </div>
            </div>

            {/* نافذة الدفع المنبثقة - تظهر بعد ملء البيانات */}
            {showPaymentModal && (
                <div className={styles.checkoutModalOverlay} onClick={() => setShowPaymentModal(false)}>
                    <div className={styles.checkoutModalContainer} onClick={(e) => e.stopPropagation()}>
                        {/* رأس النافذة */}
                        <div className={styles.checkoutModalHeader}>
                            <h2>إتمام الطلب</h2>
                            <button 
                                className={styles.checkoutModalClose}
                                onClick={() => setShowPaymentModal(false)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        {/* محتوى النافذة - الملخص واختيار طريقة الدفع فقط */}
                        <div className={styles.checkoutModalContent}>
                            <OrderTotal 
                                price={price} 
                                paymentMethod={paymentMethod} 
                                onPaymentMethodChange={setPaymentMethod} 
                                supportedMethods={supportedPaymentMethods}
                            />
                        </div>

                        {/* أزرار التأكيد والإلغاء */}
                        <div className={styles.checkoutModalFooter}>
                            <button 
                                className={styles.confirmPaymentButton}
                                onClick={handlePaymentConfirm}
                            >
                                تأكيد الدفع
                            </button>
                            <button 
                                className={styles.cancelPaymentButton}
                                onClick={() => setShowPaymentModal(false)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};


export default CheckoutPage;
