import { formatCLP } from "./utils";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56XXXXXXXXX";

export function whatsappLink(product: { name: string; price: number; size?: string }) {
  const text =
    `Hola JAVIVI! Me interesa este producto:\n\n` +
    `*${product.name}${product.size ? " - " + product.size : ""}*\n` +
    `Precio: ${formatCLP(product.price)}\n\n` +
    `¿Está disponible?`;
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
}