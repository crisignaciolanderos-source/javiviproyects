export type Category = "cosmetica" | "ropa";
export type Condition = "nuevo" | "usado";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // CLP
  category: Category;
  size?: string;
  condition?: Condition;
  images: string[];
  stock: number;
  sold: boolean;
  active: boolean;
  created_at?: string;
}