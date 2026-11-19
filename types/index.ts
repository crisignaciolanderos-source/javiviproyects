export type Category = "cosmetica" | "ropa";
export type Condition = "nuevo" | "usado";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // CLP (precio con descuento)
  original_price?: number; // CLP (precio original, si hay descuento)
  category: Category;
  size?: string;
  condition?: Condition;
  images: string[];
  stock: number;
  sold: boolean;
  active: boolean;
  featured: boolean;
  colors?: string[]; // colores disponibles
  whatsapp_message?: string; // mensaje personalizado para WhatsApp
  usage_instructions?: string; // modo de empleo
  created_at?: string;
}

export interface Promotion {
  id: string;
  imageUrl: string;
  productId: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  text: string;
  image_url?: string;
  created_at: string;
}