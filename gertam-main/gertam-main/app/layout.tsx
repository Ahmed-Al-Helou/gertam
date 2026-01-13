"use client"
import { Alexandria } from "next/font/google";
import "./globals.css";
import {CartProvider} from "@/Context/CartContext";
import "../i18n";
const alexandria = Alexandria({
  subsets: ["arabic"], // مهم حتى يدعم العربية
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
    <head>
        <title>Al Faraa Shop</title>
    </head>
      <body className={alexandria.className}>
      <CartProvider>
          {children}
      </CartProvider>
      </body>
    </html>
  );
}
