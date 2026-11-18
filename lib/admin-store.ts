"use client";

import type { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

const STORAGE_KEY = "javivi_admin_products";
const SALES_KEY = "javivi_admin_sales";
const PROMOS_KEY = "javivi_admin_promotions";

export interface Sale {
  id: string;
  product_id: string;
  product_name: string;
  buyer_name: string;
  buyer_phone: string;
  notes: string;
  created_at: string;
}

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

let products: Product[] = loadProducts();
let sales: Sale[] = loadSales();

export function getAdminProducts(): Product[] {
  return products;
}

export function getAdminProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function createProduct(p: Omit<Product, "id" | "created_at">): Product {
  const np: Product = { ...p, id: "p-" + Date.now(), created_at: new Date().toISOString() };
  products = [np, ...products];
  saveProducts(products);
  return np;
}

export function updateProduct(id: string, patch: Partial<Product>): Product | undefined {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx] = { ...products[idx], ...patch };
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id: string) {
  products = products.filter((p) => p.id !== id);
  saveProducts(products);
}

export function registerSale(input: { product_id: string; buyer_name: string; buyer_phone: string; notes: string }): Sale | null {
  const p = products.find((x) => x.id === input.product_id);
  if (!p) return null;
  if (p.category === "ropa") {
    p.sold = true;
    p.stock = 0;
    p.active = false;
  } else {
    p.stock = Math.max(0, p.stock - 1);
    if (p.stock === 0) p.active = false;
  }
  saveProducts(products);
  const sale: Sale = {
    id: "s-" + Date.now(),
    product_id: input.product_id,
    product_name: p.name,
    buyer_name: input.buyer_name,
    buyer_phone: input.buyer_phone,
    notes: input.notes,
    created_at: new Date().toISOString(),
  };
  sales = [sale, ...sales];
  saveSales(sales);
  return sale;
}

export function getSales(): Sale[] {
  return sales;
}

export function resetAdminStore() {
  products = [...MOCK_PRODUCTS];
  sales = [];
  promotions = [];
  saveProducts(products);
  saveSales(sales);
  savePromotions(promotions);
}

// ---------- PROMOCIONES ----------

let promotions: string[] = loadPromotions();

function loadPromotions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROMOS_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {}
  return [];
}

function savePromotions(list: string[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(PROMOS_KEY, JSON.stringify(list)); } catch {}
}

export function getPromotions(): string[] {
  return promotions;
}

export function addPromotion(imageUrl: string) {
  promotions = [...promotions, imageUrl];
  savePromotions(promotions);
}

export function deletePromotion(index: number) {
  promotions = promotions.filter((_, i) => i !== index);
  savePromotions(promotions);
}