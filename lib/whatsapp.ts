import { formatCLP } from "./utils";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56XXXXXXXXX";

export function whatsappLink(product: { name: string; price: number; size?: string; whatsapp_message?: string }) {
  // Si el producto tiene un mensaje personalizado, usarlo
  if (product.whatsapp_message && product.whatsapp_message.trim()) {
    return `https://wa.me/${NUMBER}?text=${encodeURIComponent(product.whatsapp_message)}`;
  }
  // Mensaje por defecto
  const text =
    `Hola JAVIVI! Me interesa este producto:\n\n` +
    `*${product.name}${product.size ? " - " + product.size : ""}*\n` +
    `Precio: ${formatCLP(product.price)}\n\n` +
    `¿Está disponible?`;
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
}