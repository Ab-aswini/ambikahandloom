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
  paymentType: "full" | "advance";
  paymentUtr?: string;
  adminNote?: string;
  status: "awaiting_verification" | "confirmed" | "weaving" | "dispatched" | "delivered";
  createdAt: string;
  updatedAt: string;
}

// ─── Review Types ───
export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  image?: string; // Base64 or URL (Legacy / Primary)
  images?: string[]; // Array of Base64 or URLs
  createdAt: string;
}

const defaultReviews: Review[] = [
  {
    id: "REV-001",
    productId: "AH-001",
    customerName: "Priya S.",
    rating: 5,
    comment: "Absolutely stunning! The intricacies of the pallu are mesmerizing. Wore it to a wedding and received so many compliments.",
    image: "https://images.unsplash.com/photo-1583391733958-692b6a93910c?auto=format&fit=crop&w=400&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "REV-002",
    productId: "AH-001",
    customerName: "Ananya M.",
    rating: 5,
    comment: "The feel of the silk is incredibly premium. Thank you for the quick delivery and beautiful packaging.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

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
  REVIEWS: "ambika_reviews",
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

/**
 * Compresses an image file to a Base64 string to fit within localStorage limits.
 * Downscales to max 800px width/height and 0.7 JPEG quality.
 */
export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with 0.7 quality
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
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

export function updateOrderStatus(id: string, status: Order["status"], note?: string): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].status = status;
    if (note !== undefined) {
      orders[idx].adminNote = note;
    }
    orders[idx].updatedAt = new Date().toISOString();
    setItem(KEYS.ORDERS, orders);
  }
}

export function updateOrderUtr(id: string, utr: string): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].paymentUtr = utr;
    orders[idx].updatedAt = new Date().toISOString();
    setItem(KEYS.ORDERS, orders);
  }
}

// ─── Reviews ───
export function getReviews(): Review[] {
  return getItem<Review[]>(KEYS.REVIEWS, defaultReviews);
}

export function getReviewsByProduct(productId: string): Review[] {
  return getReviews().filter(r => r.productId === productId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveReview(review: Review): void {
  const reviews = getReviews();
  const idx = reviews.findIndex((r) => r.id === review.id);
  if (idx >= 0) {
    reviews[idx] = review;
  } else {
    reviews.push(review);
  }
  setItem(KEYS.REVIEWS, reviews);
}

export function deleteReview(id: string): void {
  const reviews = getReviews().filter((r) => r.id !== id);
  setItem(KEYS.REVIEWS, reviews);
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
