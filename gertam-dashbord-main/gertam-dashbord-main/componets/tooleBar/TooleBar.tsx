"use client";

import styles from "./toolebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { AiFillProduct } from "react-icons/ai";
import { CiBoxes } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { LiaTruckSolid, LiaStoreSolid } from "react-icons/lia";
import { BsBank, BsSignIntersectionSide } from "react-icons/bs";
import { PiUsersFourDuotone } from "react-icons/pi";
import { MdOutlineDirectionsCarFilled } from "react-icons/md";
import { IoStorefrontOutline } from "react-icons/io5";
import { FaHospitalUser } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";


const TooleBar = () => {
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const menu = [
        { href: "/", label: "نظرة عامة", icon: <AiFillProduct size={25} /> },
        {
            href: "/Products",
            label: "المنتجات",
            icon: <CiBoxes size={25} />,
            dropdown: [
                { href: "/Products", label: "كل المنتجات" },
                { href: "/ProductsByCategory", label: "اقسام المنتجات " },
                { href: "/add-product", label: "إضافة منتج جديد" },
            ],
        },
        {
            href: "/cars",
            label: "المركبات",
            icon: <MdOutlineDirectionsCarFilled size={25} />,
            dropdown: [
                { href: "/brands", label: "الشركات" },
                { href: "/modules", label: "الموديلات" },
                { href: "/enginges", label: "المحركات" },
            ],
        },
        {
            href: "/merchant",
            label: "التجار ",
            icon: <FaHospitalUser size={25} />,
            dropdown: [
                { href: "/merchant/request", label: "طلبات الانضمام" },
                { href: "/merchant/all", label: "كل التجار" },
            ],
        },
        { href: "/stores", label: "المتاجر ", icon: <IoStorefrontOutline size={25} /> },
        { href: "/articeles", label: "المقالات ", icon: <MdOutlineArticle size={25} /> },
        { href: "/mail", label: "البريد", icon: <HiOutlineMail size={25} /> },
        { href: "/orders", label: "الطلبات", icon: <LiaTruckSolid size={25} /> },
        { href: "/suppliers", label: "الموردين", icon: <LiaStoreSolid size={25} /> },
        { href: "/finance", label: "المعاملات المالية", icon: <BsBank size={22} /> },
        { href: "/sections", label: "الأقسام", icon: <BsSignIntersectionSide size={25} /> },
        { href: "/team", label: "الفريق", icon: <PiUsersFourDuotone size={30} /> },
    ];

    const toggleMenu = (href: string) => {
        setOpenMenu(openMenu === href ? null : href);
    };

    return (
        <div className={styles.TooleBar}>
            <h1 className={styles.title}>
                شركة <span>الفارع</span>
            </h1>
            <ul className={styles.tooleBarMenu}>
                {menu.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.dropdown && item.dropdown.some((d) => pathname.startsWith(d.href)));

                    if (item.dropdown) {
                        return (
                            <li
                                key={item.href}
                                className={`${isActive ? styles.Active : styles.linkBar}`}
                            >
                                <button
                                    className={`${styles.Link} flex justify-between items-center w-full`}
                                    onClick={() => toggleMenu(item.href)}
                                >
                  <span className={styles.labiocns}>
                    {item.icon} {item.label}
                  </span>
                                    <span>{openMenu === item.href ? "▲" : "▼"}</span>
                                </button>

                                <AnimatePresence>
                                    {openMenu === item.href && (
                                        <motion.ul
                                            className={styles.dropdownMenu}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {item.dropdown.map((d) => {
                                                const isChildActive = pathname === d.href;
                                                return (
                                                    <li
                                                        key={d.href}
                                                        className={`${styles.linkBar} ${
                                                            isChildActive ? styles.Active : ""
                                                        }`}
                                                    >
                                                        <Link href={d.href} className={styles.Link}>
                                                            {d.label}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    }

                    return (
                        <li
                            key={item.href}
                            className={`${isActive ? styles.Active : styles.linkBar}`}
                        >
                            <Link href={item.href} className={styles.Link}>
                                {item.icon} {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TooleBar;
