'use client';
import {useEffect, useState} from 'react';
import Navbar from "@/components/Navbar/Navabr";
import Footer from "@/components/Footer/footer";
import Loading from "@/app/ui/loaders/Loading";
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";
import styles from "./track.module.css";

export default function OrderTracking() {
    const [orders, setOrders] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    useEffect(() => {
        const fetchOrders = async ()=>{
            const token = localStorage.getItem("token");

            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/userOrders`, {
                    method: "GET",
                    headers: {Authorization: `Bearer ${token}`},
                });
                const json = await res.json();
                setOrders(json);
            }catch (err:any){
            }finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    if (loading) return <Loading />;
    const steps = [
        { id: 1, name: 'قيد المعالجة', icon: FiClock, color: 'bg-yellow-500' },
        { id: 2, name: 'قيد التنفيذ', icon: FiPackage, color: 'bg-blue-500' },
        { id: 3, name: 'قيد الشحن', icon: FiTruck, color: 'bg-orange-500' },
        { id: 4, name: 'تم التسليم', icon: FiCheckCircle, color: 'bg-green-500' },
    ];

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'قيد المعالجة':
                return 1;
            case 'قيد التنفيذ':
                return 2;
            case 'قيد الشحن':
                return 3;
            case 'تم التسليم':
                return 4;
            default:
                return 1;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'قيد المعالجة':
                return 'bg-yellow-100 text-yellow-800';
            case 'قيد التنفيذ':
                return 'bg-blue-100 text-blue-800';
            case 'قيد الشحن':
                return 'bg-orange-100 text-orange-800';
            case 'تم التسليم':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <>
        <Navbar/>
            <div className={`${styles.container} max-w-5xl mx-auto mt-16 bg-white p-10 rounded-3xl`}>
                {!selectedOrder ? (
                    <>
                        <div className={styles.header}>
                            <h1 className={styles.title}>طلباتي</h1>
                            <p className={styles.subtitle}>تتبع حالة طلباتك وتفاصيلها</p>
                        </div>

                        {orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p className={styles.emptyText}>لا توجد طلبات حالياً.</p>
                                <a href="/shop" className={styles.shopButton}>العودة للتسوق</a>
                            </div>
                        ) : (
                            <div className={styles.ordersGrid}>
                                {orders.map((order:any) => (
                                    <div
                                        key={order.id}
                                        className={styles.orderCard}
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <div className={styles.orderHeader}>
                                            <div>
                                                <p className={styles.orderNumber}>طلب #{order.id}</p>
                                                <p className={styles.customerName}>{order.name}</p>
                                            </div>
                                            <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        
                                        <div className={styles.progressBar}>
                                            <div 
                                                className={styles.progressFill}
                                                style={{ width: `${(getStatusStep(order.status) / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                        
                                        <div className={styles.orderDetails}>
                                            <div className={styles.detail}>
                                                <span className={styles.label}>المجموع:</span>
                                                <span className={styles.value}>{order.totlePrice}$</span>
                                            </div>
                                            <div className={styles.detail}>
                                                <span className={styles.label}>التاريخ:</span>
                                                <span className={styles.value}>
                                                    {new Date(order.created_at).toLocaleString('ar-SA')}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <button className={styles.viewButton}>عرض التفاصيل →</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className={styles.backButton}
                        >
                            ← الرجوع إلى الطلبات
                        </button>

                        <div className={styles.detailsHeader}>
                            <h1 className={styles.detailsTitle}>
                                تتبع الطلب رقم {selectedOrder.id}
                            </h1>
                            <span className={`${styles.largeStatusBadge} ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                        </div>

                        {/* Timeline */}
                        <div className={styles.timeline}>
                            <div className={styles.timelineContainer}>
                                {steps.map((step, index) => {
                                    const statusStep = getStatusStep(selectedOrder.status);
                                    const isCompleted = statusStep >= step.id;
                                    const isCurrent = statusStep === step.id;
                                    const Icon = step.icon;
                                    
                                    return (
                                        <div key={step.id} className={styles.timelineItem}>
                                            <div className={styles.timelineStep}>
                                                <div
                                                    className={`${styles.stepCircle} ${
                                                        isCompleted ? step.color : 'bg-gray-300'
                                                    } ${isCurrent ? styles.currentStep : ''}`}
                                                >
                                                    {isCompleted && <Icon size={20} className={styles.stepIcon} />}
                                                </div>
                                                <span className={`${styles.stepName} ${
                                                    isCompleted ? 'text-green-600 font-semibold' : 
                                                    isCurrent ? 'text-blue-600 font-semibold' : 
                                                    'text-gray-500'
                                                }`}>
                                                    {step.name}
                                                </span>
                                            </div>

                                            {index < steps.length - 1 && (
                                                <div className={`${styles.timelineConnector} ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className={styles.detailsSection}>
                            <h2 className={styles.sectionTitle}>معلومات الطلب</h2>
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>الاسم:</span>
                                    <span className={styles.detailValue}>{selectedOrder.name}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>الدولة:</span>
                                    <span className={styles.detailValue}>{selectedOrder.country}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>المدينة:</span>
                                    <span className={styles.detailValue}>{selectedOrder.city}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>المجموع الكلي:</span>
                                    <span className={styles.detailValue}>{selectedOrder.totlePrice}$</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>تاريخ الإنشاء:</span>
                                    <span className={styles.detailValue}>
                                        {new Date(selectedOrder.created_at).toLocaleString('ar-SA')}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>الحالة:</span>
                                    <span className={`${styles.detailValue} ${styles.statusValue}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer/>
        </>
    );
}
