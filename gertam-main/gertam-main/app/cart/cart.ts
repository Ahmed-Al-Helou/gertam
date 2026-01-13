// cart.ts (ملف مساعدة لإدارة السلة)
export const getCart = () => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item: any) => {
  const cart = getCart();
  const existingIndex = cart.findIndex((i: any) => i.id === item.id);

  // نتأكد أن السعر رقم
  const price = Number(item.price);

  if (existingIndex >= 0 || price <= 0) {
    // cart[existingIndex].quantity += item.quantity || 1;
      return;
  } else {
    cart.push({ ...item, price, quantity: item.quantity || 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
};


export const removeFromCart = (id: number) => {
  const cart = getCart();
  const newCart = cart.filter((item: any) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(newCart));
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
