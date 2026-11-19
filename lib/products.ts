import type { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient as createServerClient } from "@/lib/supabase/server";

export { MOCK_PRODUCTS };

export async function getProducts(category?: "cosmetica" | "ropa"): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      let q = supabase.from("products").select("*").eq("active", true);
      if (category) q = q.eq("category", category);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (!error && data) return data as Product[];
    } catch {
      // fallback to mock
    }
  }
  const list = category
    ? MOCK_PRODUCTS.filter((p) => p.category === category && p.active)
    : MOCK_PRODUCTS.filter((p) => p.active);
  return list;
}

export async function getProduct(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) return data as Product;
    } catch {
      // fallback
    }
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}

export async function getFeatured(limit = 4): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      const { data, error } = await supabase.from("products").select("*").eq("featured", true).eq("active", true).eq("sold", false).limit(limit);
      if (!error && data && data.length > 0) return data as Product[];
    } catch {}
  }
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  return featured.length > 0 ? featured.slice(0, limit) : all.slice(0, limit);
}