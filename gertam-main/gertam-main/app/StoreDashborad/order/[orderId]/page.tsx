"use client";

import React from "react";
import OrderDetailPage from "@/components/order/order";

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderPageWrapper({ params }: OrderPageProps) {
  const { orderId } = React.use(params); // فك الـ Promise

  return <OrderDetailPage orderId={Number(orderId)} />;
}
