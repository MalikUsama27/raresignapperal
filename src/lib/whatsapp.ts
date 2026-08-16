export const WHATSAPP_NUMBER = "923337408106";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappMessage(productName: string) {
  return `Hello, I am interested in ${productName}. Please send me product details, pricing and customization options.`;
}

export const GENERAL_WHATSAPP_MESSAGE =
  "Hello, I would like to discuss a custom sportswear order. Please share your catalogue and pricing.";
