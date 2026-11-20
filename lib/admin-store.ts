"use client";

import type { Product, Promotion, Review } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "javivi_admin_products";
const SALES_KEY = "javivi_admin_sales";
const PROMOS_KEY = "javivi_admin_promotions";
const REVIEWS_KEY = "javivi_admin_reviews";
const CAT_IMAGES_KEY = "javivi_admin_category_images";
const HERO_IMAGE_KEY = "javivi_admin_hero_image";

export interface Sale {
  id: string;
  product_id: string;
  product_name: string;
  buyer_name: string;
  buyer_phone: string;
  notes: string;
  created_at: string;
}

// ========== MODO DEMO (localStorage) ==========

function loadProducts(): Product[] {
  if (typeof window === "undefined") return [...MOCK_PRODUCTS];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {}
  return [...MOCK_PRODUCTS];
}

function saveProducts(list: Product[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

function loadSales(): Sale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SALES_KEY);
    if (raw) return JSON.parse(raw) as Sale[];
  } catch {}
  return [];
}

function saveSales(list: Sale[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(SALES_KEY, JSON.stringify(list)); } catch {}
}

function loadPromotions(): Promotion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROMOS_KEY);
    if (raw) return JSON.parse(raw) as Promotion[];
  } catch {}
  return [];
}

function savePromotions(list: Promotion[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(PROMOS_KEY, JSON.stringify(list)); } catch {}
}

let demoProducts: Product[] = loadProducts();
let demoSales: Sale[] = loadSales();
let demoPromotions: Promotion[] = loadPromotions();

// ========== FUNCIONES PÚBLICAS (async, soportan Supabase) ==========

export async function getAdminProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (!error && data) return data as Product[];
    } catch {}
  }
  return [...demoProducts];
}

export async function getAdminProduct(id: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) return data as Product;
    } catch {}
  }
  return demoProducts.find((p) => p.id === id);
}

export async function createProduct(p: Omit<Product, "id" | "created_at">): Promise<Product> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("products").insert(p).select().single();
      if (!error && data) return data as Product;
    } catch {}
  }
  const np: Product = { ...p, id: "p-" + Date.now(), created_at: new Date().toISOString() };
  demoProducts = [np, ...demoProducts];
  saveProducts(demoProducts);
  return np;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("products").update(patch).eq("id", id).select().single();
      if (!error && data) return data as Product;
    } catch {}
  }
  const idx = demoProducts.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  demoProducts[idx] = { ...demoProducts[idx], ...patch };
  saveProducts(demoProducts);
  return demoProducts[idx];
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from("products").delete().eq("id", id);
    } catch {}
  }
  demoProducts = demoProducts.filter((p) => p.id !== id);
  saveProducts(demoProducts);
}

export async function registerSale(input: { product_id: string; buyer_name: string; buyer_phone: string; notes: string }): Promise<Sale | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      // Obtener producto
      const { data: product } = await supabase.from("products").select("*").eq("id", input.product_id).single();
      if (!product) return null;
      // Insertar venta
      const { data: sale } = await supabase.from("sales").insert({
        product_id: input.product_id,
        buyer_name: input.buyer_name,
        buyer_phone: input.buyer_phone,
        notes: input.notes,
      }).select().single();
      // Actualizar stock
      if (product.category === "ropa") {
        await supabase.from("products").update({ sold: true, stock: 0, active: false }).eq("id", input.product_id);
      } else {
        await supabase.from("products").update({ stock: Math.max(0, product.stock - 1) }).eq("id", input.product_id);
      }
      if (sale) return sale as Sale;
    } catch {}
  }
  // Demo mode
  const p = demoProducts.find((x) => x.id === input.product_id);
  if (!p) return null;
  if (p.category === "ropa") {
    p.sold = true;
    p.stock = 0;
    p.active = false;
  } else {
    p.stock = Math.max(0, p.stock - 1);
    if (p.stock === 0) p.active = false;
  }
  saveProducts(demoProducts);
  const sale: Sale = {
    id: "s-" + Date.now(),
    product_id: input.product_id,
    product_name: p.name,
    buyer_name: input.buyer_name,
    buyer_phone: input.buyer_phone,
    notes: input.notes,
    created_at: new Date().toISOString(),
  };
  demoSales = [sale, ...demoSales];
  saveSales(demoSales);
  return sale;
}

export async function getSales(): Promise<Sale[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("sales").select("*").order("created_at", { ascending: false });
      if (!error && data) return data as Sale[];
    } catch {}
  }
  return [...demoSales];
}

export async function resetAdminStore(): Promise<void> {
  demoProducts = [...MOCK_PRODUCTS];
  demoSales = [];
  demoPromotions = [];
  saveProducts(demoProducts);
  saveSales(demoSales);
  savePromotions(demoPromotions);
}

// ---------- PROMOCIONES ----------

export async function getPromotions(): Promise<Promotion[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          imageUrl: d.image_url || d.imageUrl,
          productId: d.product_id || d.productId || null,
        })) as Promotion[];
      }
    } catch {}
  }
  return [...demoPromotions];
}

export async function addPromotion(imageUrl: string, productId: string | null = null): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from("promotions").insert({ title: "Promoción", image_url: imageUrl, product_id: productId, active: true });
    } catch {}
  }
  const np: Promotion = { id: "promo-" + Date.now(), imageUrl, productId };
  demoPromotions = [...demoPromotions, np];
  savePromotions(demoPromotions);
}

export async function deletePromotion(index: number): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const promos = await getPromotions();
      if (promos[index]) {
        await supabase.from("promotions").delete().eq("id", promos[index].id);
      }
    } catch {}
  }
  demoPromotions = demoPromotions.filter((_, i) => i !== index);
  savePromotions(demoPromotions);
}

// ---------- PRODUCTOS DESTACADOS ----------

export async function toggleFeatured(productId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: p } = await supabase.from("products").select("featured").eq("id", productId).single();
      if (p) {
        await supabase.from("products").update({ featured: !p.featured }).eq("id", productId);
      }
    } catch {}
  }
  const prod = demoProducts.find((x) => x.id === productId);
  if (prod) {
    prod.featured = !prod.featured;
    saveProducts(demoProducts);
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("products").select("*").eq("featured", true).eq("active", true).eq("sold", false);
      if (!error && data) return data as Product[];
    } catch {}
  }
  return demoProducts.filter((p) => p.featured && p.active && !p.sold);
}

// ---------- RESEÑAS ----------

let demoReviews: Review[] = loadReviews();

function loadReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (raw) return JSON.parse(raw) as Review[];
  } catch {}
  return [];
}

function saveReviews(list: Review[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(list)); } catch {}
}

export async function getReviews(productId: string): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
      if (!error && data) return data as Review[];
    } catch {}
  }
  return demoReviews.filter((r) => r.product_id === productId);
}

export async function addReview(review: Omit<Review, "id" | "created_at">): Promise<Review> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("reviews").insert(review).select().single();
      if (!error && data) return data as Review;
    } catch {}
  }
  const nr: Review = { ...review, id: "r-" + Date.now(), created_at: new Date().toISOString() };
  demoReviews = [nr, ...demoReviews];
  saveReviews(demoReviews);
  return nr;
}

// ---------- IMÁGENES DE CATEGORÍAS ----------

export interface CategoryImage {
  category: "cosmetica" | "ropa";
  imageUrl: string;
}

let demoCategoryImages: CategoryImage[] = loadCategoryImages();

function loadCategoryImages(): CategoryImage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CAT_IMAGES_KEY);
    if (raw) return JSON.parse(raw) as CategoryImage[];
  } catch {}
  return [];
}

function saveCategoryImages(list: CategoryImage[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(CAT_IMAGES_KEY, JSON.stringify(list)); } catch {}
}

export async function getCategoryImages(): Promise<CategoryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("category_images").select("*");
      if (!error && data) {
        return data.map((d: any) => ({
          category: d.category,
          imageUrl: d.image_url,
        })) as CategoryImage[];
      }
    } catch {}
  }
  return [...demoCategoryImages];
}

export async function setCategoryImage(category: "cosmetica" | "ropa", imageUrl: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: existing } = await supabase.from("category_images").select("id").eq("category", category).single();
      if (existing) {
        await supabase.from("category_images").update({ image_url: imageUrl }).eq("category", category);
      } else {
        await supabase.from("category_images").insert({ category, image_url: imageUrl });
      }
    } catch {}
  }
  const idx = demoCategoryImages.findIndex((c) => c.category === category);
  if (idx >= 0) {
    demoCategoryImages[idx].imageUrl = imageUrl;
  } else {
    demoCategoryImages.push({ category, imageUrl });
  }
  saveCategoryImages(demoCategoryImages);
}

export async function getCategoryImage(category: "cosmetica" | "ropa"): Promise<string | null> {
  const images = await getCategoryImages();
  const found = images.find((c) => c.category === category);
  return found?.imageUrl || null;
}

// ---------- IMAGEN DEL HERO ----------

export async function getHeroImage(): Promise<string | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("site_images").select("image_url").eq("key", "hero").single();
      if (!error && data) return data.image_url;
    } catch {}
  }
  if (typeof window === "undefined") return null;
  return localStorage.getItem(HERO_IMAGE_KEY);
}

export async function setHeroImage(imageUrl: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: existing } = await supabase.from("site_images").select("id").eq("key", "hero").single();
      if (existing) {
        await supabase.from("site_images").update({ image_url: imageUrl }).eq("key", "hero");
      } else {
        await supabase.from("site_images").insert({ key: "hero", image_url: imageUrl });
      }
    } catch {}
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(HERO_IMAGE_KEY, imageUrl);
  }
}