/** Edjay Realty WhatsApp business line (no + or spaces). */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "2348065638548";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Open WhatsApp in a new tab — pass the window returned from a synchronous window.open("", "_blank") after async work. */
export function navigateWhatsAppWindow(
  waWindow: Window | null,
  message: string
): boolean {
  const url = buildWhatsAppUrl(message);
  if (waWindow && !waWindow.closed) {
    waWindow.location.href = url;
    return true;
  }
  return false;
}
