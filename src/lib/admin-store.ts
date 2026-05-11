"use client";

import { Product, products as defaultProducts } from "@/lib/products";

// ─── Order Types ───
export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  isGift: boolean;
  giftMessage: string;
  totalPrice: number;
  status: "confirmed" | "weaving" | "dispatched" | "delivered";
  createdAt: string;
  updatedAt: string;
}

// ─── Site Settings Types ───
export interface SiteSettings {
  paymentUpi: string;
  paymentBank: string;
  paymentAccountNo: string;
  paymentIfsc: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  heroTitle: string;
  heroSubtitle: string;
  mothersDayEnabled: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  paymentUpi: "ambika@upi",
  paymentBank: "State Bank of India",
  paymentAccountNo: "XXXX XXXX 4521",
  paymentIfsc: "SBIN0012345",
  contactEmail: "hello@ambikahandloom.com",
  contactPhone: "+919876543210",
  contactAddress: "Sonepur Weaver Colony, Subarnapur, Odisha, India — 767017",
  heroTitle: "Woven Heritage. Mastered for the Modern Era.",
  heroSubtitle: "Authentic Sambalpuri masterpieces sourced directly from master artisans. Uncompromising pure silk, mesmerizing Ikat mathematics, and absolute digital security.",
  mothersDayEnabled: true,
};

// ─── Storage Keys ───
const KEYS = {
  PRODUCTS: "ambika_products",
  ORDERS: "ambika_orders",
  SETTINGS: "ambika_settings",
  ADMIN_AUTH: "ambika_admin_auth",
};

// Admin password — in production, use an env variable
const ADMIN_PASSWORD = "ambika2026";

// ─── Helper ───
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Products ───
export function getProducts(): Product[] {
  return getItem<Product[]>(KEYS.PRODUCTS, defaultProducts);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function saveProduct(product: Product): void {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  setItem(KEYS.PRODUCTS, products);
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter((p) => p.id !== id);
  setItem(KEYS.PRODUCTS, products);
}

export function reorderProducts(products: Product[]): void {
  setItem(KEYS.PRODUCTS, products);
}

// ─── Orders ───
export function getOrders(): Order[] {
  return getItem<Order[]>(KEYS.ORDERS, []);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) {
    orders[idx] = { ...order, updatedAt: new Date().toISOString() };
  } else {
    orders.push(order);
  }
  setItem(KEYS.ORDERS, orders);
}

export function updateOrderStatus(id: string, status: Order["status"]): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].status = status;
    orders[idx].updatedAt = new Date().toISOString();
    setItem(KEYS.ORDERS, orders);
  }
}

// ─── Site Settings ───
export function getSettings(): SiteSettings {
  return getItem<SiteSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: SiteSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

// ─── Admin Auth ───
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEYS.ADMIN_AUTH) === "true";
}

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(KEYS.ADMIN_AUTH, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEYS.ADMIN_AUTH);
}

// ─── Stats ───
export function getStats() {
  const orders = getOrders();
  const products = getProducts();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.status !== "delivered").length;

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
  };
}
