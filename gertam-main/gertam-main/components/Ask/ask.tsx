import { IoIosArrowDown } from "react-icons/io"
import styles from "./ask.module.css"
import {useTranslation} from "react-i18next";

const Ask = ()=>{

    const {t} = useTranslation()
    return (
        <div className="container">
            <div className={styles.ask}>
                <div className={styles.card}>
                    <h1>{t("Questions that may be on your mind")}</h1>
                    <p>{t("You can visit the knowledge base to get answers to your questions")}</p>
                    <span>{t("View the knowledge base")}</span>
                    <button className={styles.btn}>{t("Knowledge Base")} </button>
                </div>
                <div className={styles.askAndAnswer}>
                    <div className={styles.askes}>
                        <h3>{t("How do I know if the parts are compatible with my car")}<span><IoIosArrowDown />
                         </span></h3>
                        <div className={styles.answer}>
                            <p>{t("First, you must add your vehicle to the on-site garage. The system will then verify the part's compatibility with your vehicle. Please note that the verification system does not cover all parts, so we provide professional and prompt technical support to answer your questions and ensure the part's compatibility with your vehicle. You can check directly through the system or by contacting us on WhatsApp or live chat")}</p>
                        </div>
                    </div>
                    <div className={styles.askes}>
                        <h3>{t("How long will the shipping take")}<span><IoIosArrowDown /></span></h3>
                        <div className={styles.answer}>
                            <p>{t("We are always keen to provide the best possible shipping experience for our valued customers. We work with trusted shipping partners to ensure speedy delivery and safe delivery of packages from the moment they are received until they reach your door. Shipping times vary from region to region depending on your geographic location and the procedures required to complete the delivery process, such as information verification or customs clearance in some cases. After confirming your order, the system will automatically notify you of the expected shipping date, allowing you to track the status of your shipment step by step through your account or through email and text message notifications. Our goal is for your shipment to arrive as quickly and safely as possible, keeping you informed of every update regarding your order until the moment it is received")}</p>
                        </div>
                    </div>
                    <div className={styles.askes}>
                        <h3>{t("Is there a tax on shipping")}<span><IoIosArrowDown />
</span></h3>
                        <div className={styles.answer}>
                            <p>{t("Al Fare'a does not charge any shipping taxes. All taxes (if applicable) are determined by the receiving country. We ship from Saudi Arabia, and we do not charge any VAT on international shipments. However, some countries may impose customs duties or import taxes upon shipment entry into their territory, which is outside our responsibility. We advise our customers to review their country's customs and tax laws to determine if any additional fees apply before placing an order")}</p>
                        </div>
                    </div>

                    <div className={styles.askes}>
                        <h3>{t("How do I track my order")}<span><IoIosArrowDown />
</span></h3>
                        <div className={styles.answer}>
                            <p>{t("On the homepage, you'll find the \"Track Shipment\" option at the top of the navigation bar. Clicking it will take you directly to your account's tracking page, where you can view all your orders and learn about the detailed status of each shipment, from order processing to its arrival at your registered address")}</p>
                        </div>
                    </div>
                    <div className={styles.askes}>
                        <h3>{t("How do I contact you")}<span><IoIosArrowDown />
</span></h3>
                        <div className={styles.answer}>
                            <p>
                                {t("You can contact us in the way that best suits your situation")}<br/><br/>

                                {t("Product Inquiries: If you have a question about a specific product, you can contact our support team directly via direct messages or WhatsApp")}<br/><br/>

                                {t("Shipping Issues: If you experience a delay or issue with your shipment, you can contact support via direct messages or send details of the issue to the dedicated support email")}<br/><br/>

                                {t("Special Cases: If you have a special case or exceptional request, you can contact us directly by phone or email us")}<br/><br/>

                                {t("We provide all these channels to ensure easy and quick communication. Choose the method that suits you and receive assistance as quickly as possible")}
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Ask