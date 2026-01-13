// components/ToastProvider.tsx
"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};
export const notifyError = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      theme: "light",
    });
  };
  

export default function ToastProvider() {
  return <ToastContainer />;
}
