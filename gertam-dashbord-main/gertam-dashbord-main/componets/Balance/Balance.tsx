"use client";
import React, { useState, useEffect } from "react";

const Balance = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // هنا ممكن تجيب الرصيد من API
    setBalance(1500); // مثال
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow w-64">
      <h3 className="text-lg font-semibold mb-2">رصيد المتجر</h3>
      <p className="text-2xl font-bold">{balance} د.ع</p>
    </div>
  );
};

export default Balance;
