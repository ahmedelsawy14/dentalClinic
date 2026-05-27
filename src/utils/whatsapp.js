export function normalizePhoneNumber(value = "") {
  return value.replace(/[^\d]/g, "");
}

export function buildWhatsAppUrl({ phone, serviceTitle, name, customerPhone, message }) {
  const normalizedPhone = normalizePhoneNumber(phone);
  const lines = [
    `مرحبا، أريد الحجز أو الاستفسار عن خدمة ${serviceTitle}.`,
    name ? `الاسم: ${name}` : null,
    customerPhone ? `رقم الهاتف: ${customerPhone}` : null,
    message ? `الرسالة: ${message}` : null,
  ].filter(Boolean);

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
