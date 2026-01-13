"use client"
import styles from "./garage.module.css"
import Footer from "../../components/Footer/footer"
import Navbar from "../../components/Navbar/Navabr"
import {useEffect, useState} from "react";
import {getGarage} from "@/app/utils/garage";
import { FaCarRear } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import AddCar from "@/app/garage/addCar";
import { MdDelete } from "react-icons/md";
import {useTranslation} from "react-i18next";



type GarageCars = {
    id: number;
    car_name: string;
    brand: string;
    module: string;
    date: string;
    engaine: string;
    image_url: string;
};
type CarSaveCardProps = {
    car: GarageCars
    onDelete: (id: number) => void
}

const CarSaveCard = ({ car, onDelete }: CarSaveCardProps) =>{

    const {t} = useTranslation();
    const handleDelete = async (carId: number) => {
        if (!confirm("هل أنت متأكد من حذف السيارة؟")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("لم يتم العثور على التوكن");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/garage/${carId}`, {
                method: "delete",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                alert("تم حذف السيارة بنجاح");
                onDelete(carId) // هنا يتم تحديث state في المكون الأب

            } else {
                const data = await res.json();
                alert(data.message || "حدث خطأ أثناء الحذف");
            }
        } catch (err:any) {
            alert("حدث خطأ أثناء الاتصال بالخادم");
        }
    };




    return (
        <div className={styles.card}>
            <button  className={styles.deleteBtn} onClick={() => handleDelete(car.id)}><MdDelete size={30}/>
            </button>
            <img src={car.image_url || "/no-image.jpeg"} alt="" width={50}/>
            <div className={styles.content}>
               <h3> {car.car_name}  </h3>
               <p><span>الشركة المصنعه </span> : {car.brand}  </p>
               <p><span> اسم الموديل  </span> : {car.module} </p>
               <p><span> سنه الموديل  </span> : {car.date} </p>
               <p><span> نوع المحرك  </span> : {car.engaine} </p>
            </div>
            <a href={`/SearchResult?brand=${car.brand}&model=${car.module}&year=${car.date}&engine=${car.engaine}`} className={styles.saerchBtn}>بحث عن قطع مشابها</a>
        </div>
    )
}

const Garage = () => {
    const [cars, setCars] = useState<GarageCars[]>([])
    const [searchData, setSearchData] = useState(null)
    const [showAddCar, setShowAddCar] = useState(false) // للتحكم بالمودال
    const {t} = useTranslation();
    useEffect(() => {
        const getData = async () => {
            try {
                const searchRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/searchData`)
                const searchData = await searchRes.json()
                setSearchData(searchData)
            } catch (err) {
            }
        }
        getData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getGarage()
            if (data) setCars(data)
        }
        fetchData()
    }, [])

    // تعطيل السكرول عند فتح المودال
    useEffect(() => {
        document.body.style.overflow = showAddCar ? "hidden" : "auto"
    }, [showAddCar])



    return (
        <div className={styles.garage}>
            <Navbar  />
            <div className="container">
                <div className={styles.top}>
                    <button onClick={() => setShowAddCar(true)}>{t("Add a new vehicle")}</button>
                    <h2 className="title">{t("Saved vehicles")}</h2>
                </div>

                {showAddCar && searchData &&(
                    <AddCar
                        data={searchData}

                    />
                )}

                <div className={styles.cars}>
                    {cars && cars.length > 0 ? (
                        cars.map((car) => <CarSaveCard key={car.id} car={car} onDelete={(id) => setCars(prev => prev.filter(c => c.id !== id))} />)
                    ) : (
                        <div className={styles.emtyGarage}>
                            <FaCarRear size={100} />
                            <h1 className={styles.noCras}>{t("No cars reserved")}</h1>
                            <button
                                className={styles.addNewCar}
                                onClick={() => setShowAddCar(true)}
                            >
                                {t("add now")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}



export default Garage