"use client";

/**
 * admin-store.ts
 *
 * Data layer for Ambika Handloom.
 * Uses Supabase as the primary store. Falls back to localStorage
 * when Supabase env vars are not configured (local dev convenience).
 *
 * All functions are async and return promises.
 * Sync wrappers (getProductsSync, etc.) read from a module-level
 * in-memory cache that is populated on first async load.
 */

import { supabase } from "./supabase";
import { Product, products as defaultProducts } from "@/lib/products";

// ─── Re-export Product so importers don't need to change ───
export type { Product };

// ─── Detect if Supabase is configured ──────────────────────
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(supabase && url && url !== "https://your-project-id.supabase.co");
}

// ─── Order Types ────────────────────────────────────────────
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
  trackingNote?: string;
  status: "awaiting_verification" | "confirmed" | "weaving" | "dispatched" | "delivered";
  createdAt: string;
  updatedAt: string;
}

// ─── Review Types ───────────────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  image?: string;
  images?: string[];
  createdAt: string;
}

// ─── Promotion Types ────────────────────────────────────────
export interface PromotionFeature {
  emoji: string;
  title: string;
  description: string;
}

// ─── Site Settings Types ────────────────────────────────────
export interface SiteSettings {
  paymentUpi: string;
  paymentBank: string;
  paymentAccountNo: string;
  paymentIfsc: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: string;
  heroTitle: string;
  heroSubtitle: string;
  // Dynamic promotion section (replaces hardcoded Mother's Day)
  promotionEnabled: boolean;
  promotionBadge: string;        // e.g. "Mother's Day Special", "Diwali Collection"
  promotionTitle: string;        // Main heading
  promotionSubtitle: string;     // Description paragraph
  promotionEmoji: string;        // Badge icon emoji e.g. "❤️", "🪔", "🎄"
  promotionFeatures: PromotionFeature[]; // 3 feature cards
}

const DEFAULT_SETTINGS: SiteSettings = {
  paymentUpi: "ambika@upi",
  paymentBank: "State Bank of India",
  paymentAccountNo: "XXXX XXXX 4521",
  paymentIfsc: "SBIN0012345",
  contactEmail: "hello@ambikahandloom.in",
  contactPhone: "+918658476300",
  contactWhatsapp: "+918658476300",
  contactAddress: "Sonepur Weaver Colony, Subarnapur, Odisha, India — 767017",
  heroTitle: "Woven Heritage. Mastered for the Modern Era.",
  heroSubtitle:
    "Authentic Sambalpuri masterpieces sourced directly from master artisans. Uncompromising pure silk, mesmerizing Ikat mathematics, and absolute digital security.",
  promotionEnabled: true,
  promotionBadge: "Mother's Day Special",
  promotionTitle: "This Mother's Day, Gift Heritage",
  promotionSubtitle: "Every Sambalpuri Ikat saree carries centuries of tradition, woven with the love and skill of master artisans. Gift your mother a masterpiece that tells a story — a thread-by-thread testament to timeless beauty and enduring love.",
  promotionEmoji: "❤️",
  promotionFeatures: [
    {
      emoji: "🎁",
      title: "Premium Gift Packaging",
      description: "Every saree arrives in an exquisite handcrafted box with a personalized note.",
    },
    {
      emoji: "✨",
      title: "Certificate of Authenticity",
      description: "Each masterpiece comes with a signed certificate from the artisan who wove it.",
    },
    {
      emoji: "💌",
      title: "Personal Message Card",
      description: "Add a heartfelt message on our handmade cotton rag paper card, tucked inside the gift box.",
    },
  ],
};

// ─── localStorage fallback helpers ─────────────────────────
const KEYS = {
  PRODUCTS: "ambika_products",
  ORDERS: "ambika_orders",
  SETTINGS: "ambika_settings",
  ADMIN_AUTH: "ambika_admin_auth",
  REVIEWS: "ambika_reviews",
};

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function lsSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  // Derive section from DB column or fall back to inferring from category
  const rawSection = row.section as string | undefined;
  let section: Product["section"] = "sarees";
  if (rawSection === "ladies-wear" || rawSection === "cut-pieces") {
    section = rawSection;
  } else if (row.category?.startsWith("ladies-wear")) {
    section = "ladies-wear";
  } else if (row.category?.startsWith("cut-pieces")) {
    section = "cut-pieces";
  }

  const sectionLabelMap: Record<Product["section"], string> = {
    sarees: "Sarees",
    "ladies-wear": "Ladies Wear",
    "cut-pieces": "Cut Pieces",
  };

  return {
    id: row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    image: row.image,
    images: row.images ?? [],
    category: row.category,
    categoryLabel: row.category_label,
    section,
    sectionLabel: row.section_label ?? sectionLabelMap[section],
    weaveTime: row.weave_time,
    artisanOrigin: row.artisan_origin,
    threadCount: row.thread_count,
    description: row.description,
    details: row.details ?? [],
    artisanStory: row.artisan_story ?? undefined,
    careInstructions: row.care_instructions ?? [],
    inStock: row.in_stock,
  };
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOrder(row: any, items: OrderItem[] = []): Order {
  return {
    id: row.id,
    items,
    customer: {
      fullName: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      address: row.customer_address,
      city: row.customer_city,
      state: row.customer_state,
      pincode: row.customer_pincode,
    },
    isGift: row.is_gift,
    giftMessage: row.gift_message ?? "",
    totalPrice: row.total_price,
    paymentType: row.payment_type,
    paymentUtr: row.payment_utr ?? undefined,
    adminNote: row.admin_note ?? undefined,
    trackingNote: row.tracking_note ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    customerName: row.customer_name,
    rating: row.rating,
    comment: row.comment,
    image: row.image ?? undefined,
    images: row.images ?? [],
    createdAt: row.created_at,
  };
}

// ─── Image Compression ──────────────────────────────────────
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
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/** Compress a File into a Blob (for Supabase Storage upload) */
function compressImageToBlob(file: File): Promise<Blob> {
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
        const MAX_SIZE = 1200;
        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
          "image/webp",
          0.82
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Upload a product image to Supabase Storage (with progress callback).
 * Falls back to base64 data URL when Supabase is not configured.
 */
export async function uploadProductImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  onProgress?.(5); // started

  if (isSupabaseConfigured()) {
    try {
      onProgress?.(15); // compressing
      const blob = await compressImageToBlob(file);

      onProgress?.(35); // uploading
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase!.storage
        .from("product-images")
        .upload(filePath, blob, {
          contentType: "image/webp",
          upsert: false,
        });

      onProgress?.(80); // uploaded

      if (uploadError) {
        console.error("Supabase image upload error:", uploadError);
        // Fall back to base64
        onProgress?.(90);
        const base64 = await compressImage(file);
        onProgress?.(100);
        return base64;
      }

      // Get public URL
      const { data: urlData } = supabase!.storage
        .from("product-images")
        .getPublicUrl(filePath);

      onProgress?.(100);
      return urlData.publicUrl;
    } catch (err) {
      console.error("Image upload failed, falling back to base64:", err);
      const base64 = await compressImage(file);
      onProgress?.(100);
      return base64;
    }
  }

  // localStorage fallback: use base64
  onProgress?.(30);
  const base64 = await compressImage(file);
  onProgress?.(100);
  return base64;
}

// ═══════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════

export async function getProductsAsync(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("Supabase getProducts error:", error);
      return defaultProducts;
    }
    return (data ?? []).map(rowToProduct);
  }
  return lsGet<Product[]>(KEYS.PRODUCTS, defaultProducts);
}

/** Sync version — reads localStorage cache. Use only in client components. */
export function getProducts(): Product[] {
  return lsGet<Product[]>(KEYS.PRODUCTS, defaultProducts);
}

export async function getProductByIdAsync(id: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return undefined;
    return rowToProduct(data);
  }
  return getProducts().find((p) => p.id === id);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export async function saveProductAsync(product: Product): Promise<void> {
  // Always dual-write to localStorage so sync readers stay fresh
  const lsProducts = getProducts();
  const lsIdx = lsProducts.findIndex((p) => p.id === product.id);
  if (lsIdx >= 0) lsProducts[lsIdx] = product; else lsProducts.push(product);
  lsSet(KEYS.PRODUCTS, lsProducts);

  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from("products").upsert({
      id: product.id,
      name: product.name,
      price: product.price,
      original_price: product.originalPrice ?? null,
      image: product.image,
      images: product.images ?? [],
      category: product.category,
      category_label: product.categoryLabel,
      section: product.section,
      section_label: product.sectionLabel,
      weave_time: product.weaveTime,
      artisan_origin: product.artisanOrigin,
      thread_count: product.threadCount,
      description: product.description,
      details: product.details,
      artisan_story: product.artisanStory ?? null,
      care_instructions: product.careInstructions ?? [],
      in_stock: product.inStock,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("Supabase saveProduct error:", error);
      throw new Error(`Failed to save product: ${error.message}`);
    }
  }
}

// Sync alias kept for backward compat
export function saveProduct(product: Product): void {
  saveProductAsync(product).catch(console.error);
}

export async function deleteProductAsync(id: string): Promise<void> {
  // Always remove from localStorage too
  lsSet(KEYS.PRODUCTS, getProducts().filter((p) => p.id !== id));

  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from("products").delete().eq("id", id);
    if (error) {
      console.error("Supabase deleteProduct error:", error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

export function deleteProduct(id: string): void {
  deleteProductAsync(id).catch(console.error);
}

export function reorderProducts(products: Product[]): void {
  lsSet(KEYS.PRODUCTS, products);
}

// ═══════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════

export async function getOrdersAsync(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    const { data: orderRows, error } = await supabase!
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error("Supabase getOrders error:", error); return []; }

    // Fetch all items for these orders
    const ids = (orderRows ?? []).map((o) => o.id);
    if (ids.length === 0) return [];
    const { data: itemRows } = await supabase!
      .from("order_items")
      .select("*")
      .in("order_id", ids);

    return (orderRows ?? []).map((row) => {
      const items: OrderItem[] = (itemRows ?? [])
        .filter((i) => i.order_id === row.id)
        .map((i) => ({
          productId: i.product_id,
          productName: i.product_name,
          productImage: i.product_image,
          price: i.price,
          quantity: i.quantity,
        }));
      return rowToOrder(row, items);
    });
  }
  return lsGet<Order[]>(KEYS.ORDERS, []);
}

export function getOrders(): Order[] {
  return lsGet<Order[]>(KEYS.ORDERS, []);
}

export async function getOrderByIdAsync(id: string): Promise<Order | undefined> {
  if (isSupabaseConfigured()) {
    const { data: row, error } = await supabase!
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !row) return undefined;

    const { data: itemRows } = await supabase!
      .from("order_items")
      .select("*")
      .eq("order_id", id);
    const items: OrderItem[] = (itemRows ?? []).map((i) => ({
      productId: i.product_id,
      productName: i.product_name,
      productImage: i.product_image,
      price: i.price,
      quantity: i.quantity,
    }));
    return rowToOrder(row, items);
  }
  return getOrders().find((o) => o.id === id);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export async function saveOrderAsync(order: Order): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from("orders").upsert({
      id: order.id,
      customer_name: order.customer.fullName,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      customer_address: order.customer.address,
      customer_city: order.customer.city,
      customer_state: order.customer.state,
      customer_pincode: order.customer.pincode,
      is_gift: order.isGift,
      gift_message: order.giftMessage,
      total_price: order.totalPrice,
      payment_type: order.paymentType,
      payment_utr: order.paymentUtr ?? null,
      admin_note: order.adminNote ?? null,
      tracking_note: order.trackingNote ?? null,
      status: order.status,
      updated_at: new Date().toISOString(),
    });
    if (error) { console.error("Supabase saveOrder error:", error); return; }

    // Insert order items (delete old first for upsert behaviour)
    await supabase!.from("order_items").delete().eq("order_id", order.id);
    if (order.items.length > 0) {
      await supabase!.from("order_items").insert(
        order.items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          product_image: item.productImage,
          price: item.price,
          quantity: item.quantity,
        }))
      );
    }
    return;
  }
  // localStorage fallback
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  const ts = new Date().toISOString();
  if (idx >= 0) orders[idx] = { ...order, updatedAt: ts };
  else orders.push({ ...order, updatedAt: ts });
  lsSet(KEYS.ORDERS, orders);
}

export function saveOrder(order: Order): void {
  // For sync callers (checkout page): save async in background and also mirror to localStorage
  const ts = new Date().toISOString();
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) orders[idx] = { ...order, updatedAt: ts };
  else orders.push({ ...order, updatedAt: ts });
  lsSet(KEYS.ORDERS, orders);
  // Also save to Supabase asynchronously
  saveOrderAsync(order).catch(console.error);
}

export async function updateOrderStatusAsync(
  id: string,
  status: Order["status"],
  note?: string,
  trackingNote?: string
): Promise<void> {
  if (isSupabaseConfigured()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (note !== undefined) updates.admin_note = note;
    if (trackingNote !== undefined) updates.tracking_note = trackingNote;
    const { error } = await supabase!.from("orders").update(updates).eq("id", id);
    if (error) console.error("Supabase updateOrderStatus error:", error);
    return;
  }
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].status = status;
    if (note !== undefined) orders[idx].adminNote = note;
    if (trackingNote !== undefined) orders[idx].trackingNote = trackingNote;
    orders[idx].updatedAt = new Date().toISOString();
    lsSet(KEYS.ORDERS, orders);
  }
}

export function updateOrderStatus(id: string, status: Order["status"], note?: string): void {
  updateOrderStatusAsync(id, status, note).catch(console.error);
}

export async function updateOrderUtrAsync(id: string, utr: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!
      .from("orders")
      .update({ payment_utr: utr, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) console.error("Supabase updateOrderUtr error:", error);
    return;
  }
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].paymentUtr = utr;
    orders[idx].updatedAt = new Date().toISOString();
    lsSet(KEYS.ORDERS, orders);
  }
}

export function updateOrderUtr(id: string, utr: string): void {
  updateOrderUtrAsync(id, utr).catch(console.error);
}

// ═══════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════

const defaultReviews: Review[] = [
  {
    id: "REV-001",
    productId: "AH-001",
    customerName: "Priya S.",
    rating: 5,
    comment: "Absolutely stunning! The intricacies of the pallu are mesmerizing.",
    image: "https://images.unsplash.com/photo-1583391733958-692b6a93910c?auto=format&fit=crop&w=400&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REV-002",
    productId: "AH-001",
    customerName: "Ananya M.",
    rating: 5,
    comment: "The feel of the silk is incredibly premium. Thank you for the quick delivery and beautiful packaging.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export async function getReviewsAsync(): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return defaultReviews;
    return (data ?? []).map(rowToReview);
  }
  return lsGet<Review[]>(KEYS.REVIEWS, defaultReviews);
}

export function getReviews(): Review[] {
  return lsGet<Review[]>(KEYS.REVIEWS, defaultReviews);
}

export async function getReviewsByProductAsync(productId: string): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []).map(rowToReview);
  }
  return getReviews()
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReviewsByProduct(productId: string): Review[] {
  return getReviews()
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveReviewAsync(review: Review): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from("reviews").upsert({
      id: review.id,
      product_id: review.productId,
      customer_name: review.customerName,
      rating: review.rating,
      comment: review.comment,
      image: review.image ?? null,
      images: review.images ?? [],
    });
    if (error) console.error("Supabase saveReview error:", error);
    return;
  }
  const reviews = getReviews();
  const idx = reviews.findIndex((r) => r.id === review.id);
  if (idx >= 0) reviews[idx] = review; else reviews.push(review);
  lsSet(KEYS.REVIEWS, reviews);
}

export function saveReview(review: Review): void {
  saveReviewAsync(review).catch(console.error);
}

export async function deleteReviewAsync(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from("reviews").delete().eq("id", id);
    if (error) console.error("Supabase deleteReview error:", error);
    return;
  }
  lsSet(KEYS.REVIEWS, getReviews().filter((r) => r.id !== id));
}

export function deleteReview(id: string): void {
  deleteReviewAsync(id).catch(console.error);
}

// ═══════════════════════════════════════════════════════════
// SITE SETTINGS
// ═══════════════════════════════════════════════════════════

export async function getSettingsAsync(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (error || !data) return DEFAULT_SETTINGS;
    return {
      paymentUpi: data.payment_upi,
      paymentBank: data.payment_bank,
      paymentAccountNo: data.payment_account_no,
      paymentIfsc: data.payment_ifsc,
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone,
      contactWhatsapp: data.contact_whatsapp ?? data.contact_phone,
      contactAddress: data.contact_address,
      heroTitle: data.hero_title,
      heroSubtitle: data.hero_subtitle,
      promotionEnabled: data.promotion_enabled ?? data.mothers_day_enabled ?? true,
      promotionBadge: data.promotion_badge ?? DEFAULT_SETTINGS.promotionBadge,
      promotionTitle: data.promotion_title ?? DEFAULT_SETTINGS.promotionTitle,
      promotionSubtitle: data.promotion_subtitle ?? DEFAULT_SETTINGS.promotionSubtitle,
      promotionEmoji: data.promotion_emoji ?? DEFAULT_SETTINGS.promotionEmoji,
      promotionFeatures: data.promotion_features ?? DEFAULT_SETTINGS.promotionFeatures,
    };
  }
  return lsGet<SiteSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function getSettings(): SiteSettings {
  return lsGet<SiteSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export async function saveSettingsAsync(settings: SiteSettings): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from("site_settings").upsert({
      id: 1,
      payment_upi: settings.paymentUpi,
      payment_bank: settings.paymentBank,
      payment_account_no: settings.paymentAccountNo,
      payment_ifsc: settings.paymentIfsc,
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      contact_whatsapp: settings.contactWhatsapp,
      contact_address: settings.contactAddress,
      hero_title: settings.heroTitle,
      hero_subtitle: settings.heroSubtitle,
      promotion_enabled: settings.promotionEnabled,
      promotion_badge: settings.promotionBadge,
      promotion_title: settings.promotionTitle,
      promotion_subtitle: settings.promotionSubtitle,
      promotion_emoji: settings.promotionEmoji,
      promotion_features: settings.promotionFeatures,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("Supabase saveSettings error:", error);
    return;
  }
  lsSet(KEYS.SETTINGS, settings);
}

export function saveSettings(settings: SiteSettings): void {
  saveSettingsAsync(settings).catch(console.error);
}

// ═══════════════════════════════════════════════════════════
// ADMIN AUTH (session-based, unchanged)
// ═══════════════════════════════════════════════════════════

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

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

// ═══════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════

export async function getStatsAsync() {
  const [orders, products] = await Promise.all([getOrdersAsync(), getProductsAsync()]);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.status !== "delivered").length;
  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
  };
}

export function getStats() {
  const orders = getOrders();
  const products = getProducts();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.status !== "delivered").length;
  return { totalProducts: products.length, totalOrders: orders.length, totalRevenue, pendingOrders };
}

// ═══════════════════════════════════════════════════════════
// WHATSAPP HELPERS
// ═══════════════════════════════════════════════════════════

/** Returns WhatsApp number from env or settings (digits only, with country code) */
export function getWhatsAppNumber(settings?: SiteSettings): string {
  const envNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (envNum) return envNum;
  const phone = settings?.contactWhatsapp || settings?.contactPhone || "+918658476300";
  return phone.replace(/\D/g, "");
}

/** Build a pre-filled WhatsApp URL for a new order */
export function buildOrderWhatsAppUrl(order: Order, settings?: SiteSettings): string {
  const itemLines = order.items
    .map((i) => `  • ${i.productName} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString("en-IN")}`)
    .join("\n");

  const msg = `🛍️ *New Order — Ambika Handloom*

*Order ID:* ${order.id}
─────────────────
${itemLines}
─────────────────
*Total:* ₹${order.totalPrice.toLocaleString("en-IN")}
*Payment:* ${order.paymentType === "full" ? "Full Payment" : "20% Advance"}

*Customer:* ${order.customer.fullName}
*Phone:* ${order.customer.phone}
*Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.state} — ${order.customer.pincode}
${order.isGift && order.giftMessage ? `\n*Gift Message:* "${order.giftMessage}"` : ""}
─────────────────
Please confirm this order 🙏`;

  const number = getWhatsAppNumber(settings);
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

/** Build a WhatsApp URL for admin to notify customer about order status */
export function buildTrackingWhatsAppUrl(order: Order, message: string, settings?: SiteSettings): string {
  const msg = `🧵 *Update from Ambika Handloom*

*Order:* ${order.id}
*Customer:* ${order.customer.fullName}

${message}

Track your order anytime: ${process.env.NEXT_PUBLIC_SITE_URL || "https://ambikahandloom.in"}/track

Thank you for choosing Ambika Handloom 🙏`;

  // Send to customer's number
  const customerNumber = order.customer.phone.replace(/\D/g, "");
  const number = customerNumber.length === 10 ? `91${customerNumber}` : customerNumber;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}
