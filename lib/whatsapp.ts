import { formatCLP } from "./utils";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56XXXXXXXXX";

export function whatsappLink(product: { name: string; price: number; size?: string; whatsapp_message?: string; colors?: string[] }, selectedColor?: string | null) {
  // Si el producto tiene un mensaje personalizado, usarlo (pero agregar color si se seleccionó)
  if (product.whatsapp_message && product.whatsapp_message.trim()) {
    let msg = product.whatsapp_message;
    if (selectedColor) {
      msg += `\nColor: ${selectedColor}`;
    }
    return `https://wa.me/${NUMBER}?text=${encodeURIComponent(msg)}`;
  }
  // Mensaje por defecto
  const text =
    `Hola JAVIVI! Me interesa este producto:\n\n` +
    `*${product.name}${product.size ? " - " + product.size : ""}*\n` +
    (selectedColor ? `Color: ${selectedColor}\n` : "") +
    `Precio: ${formatCLP(product.price)}\n\n` +
    `¿Está disponible?`;
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
}