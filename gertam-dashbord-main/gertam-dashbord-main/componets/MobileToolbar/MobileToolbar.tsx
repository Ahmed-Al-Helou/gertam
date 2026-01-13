"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiFillProduct,
  AiOutlineClose,
} from "react-icons/ai";
import { CiBoxes } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { LiaTruckSolid, LiaStoreSolid } from "react-icons/lia";
import { BsBank, BsSignIntersectionSide } from "react-icons/bs";
import { PiUsersFourDuotone } from "react-icons/pi";
import { MdOutlineDirectionsCarFilled } from "react-icons/md";
import { IoStorefrontOutline } from "react-icons/io5";

const MobileToolbar = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menu = [
    { href: "/", label: "الرئيسية", icon: <AiFillProduct size={24} /> },
    {
      href: "/Products",
      label: "المنتجات",
      icon: <CiBoxes size={24} />,
      dropdown: [
        { href: "/Products", label: "كل المنتجات" },
        { href: "/edit-product/", label: "تعديل منتج" },
        { href: "/add-product", label: "إضافة منتج" },
      ],
    },
    {
      href: "/cars",
      label: "المركبات",
      icon: <MdOutlineDirectionsCarFilled size={24} />,
      dropdown: [
        { href: "/brands", label: "الشركات" },
        { href: "/modules", label: "الموديلات" },
        { href: "/enginges", label: "المحركات" },
      ],
    },
    { href: "/stores", label: "المتاجر", icon: <IoStorefrontOutline size={24} /> },
    { href: "/mail", label: "البريد", icon: <HiOutlineMail size={24} /> },
  ];

  const toggleDropdown = (href: string) => {
    setActiveDropdown(activeDropdown === href ? null : href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg md:hidden">
      <ul className="flex justify-around py-2 text-xs text-slate-600">
        {menu.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href} className="relative">
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.href)}
                    className={`flex flex-col items-center p-2 ${
                      isActive ? "text-blue-600" : "hover:text-blue-500"
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px] mt-1">{item.label}</span>
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl shadow-lg w-40"
                      >
                        <button
                          className="absolute top-1 right-1 text-slate-400"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <AiOutlineClose size={14} />
                        </button>
                        <ul className="py-2">
                          {item.dropdown.map((d) => (
                            <li key={d.href}>
                              <Link
                                href={d.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`block px-4 py-2 text-sm ${
                                  pathname === d.href
                                    ? "text-blue-600 bg-blue-50"
                                    : "hover:bg-slate-50"
                                }`}
                              >
                                {d.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex flex-col items-center p-2 ${
                    isActive ? "text-blue-600" : "hover:text-blue-500"
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px] mt-1">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MobileToolbar;
