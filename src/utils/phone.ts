/**
 * Moroccan & International WhatsApp Number Utility
 * Converts local numbers (06..., 07..., 05...) or international numbers (+212..., 00212...)
 * into the required WhatsApp API international format (e.g. 212612345678).
 */

export function normalizeWhatsAppNumber(rawPhone: string): string {
  if (!rawPhone) return '212600123456';

  // 1. Remove all spaces, dashes, parentheses, plus signs
  let clean = rawPhone.replace(/[^0-9]/g, '');

  // 2. Handle double leading zero international prefix (00212...)
  if (clean.startsWith('00212')) {
    clean = clean.substring(2);
  } else if (clean.startsWith('00')) {
    clean = clean.substring(2);
  }

  // 3. Handle Moroccan local numbers (06XXXXXXXX, 07XXXXXXXX, 05XXXXXXXX)
  // In Morocco, local numbers start with 0 and have 10 digits
  if (clean.startsWith('0') && clean.length === 10) {
    clean = '212' + clean.substring(1);
  }
  // If user entered 9 digits without the leading 0 (e.g. 6XXXXXXXX or 7XXXXXXXX)
  else if ((clean.startsWith('6') || clean.startsWith('7') || clean.startsWith('5')) && clean.length === 9) {
    clean = '212' + clean;
  }
  // If already starts with 212 and has 11 or 12 digits (2126XXXXXXXX)
  else if (clean.startsWith('212')) {
    // If user mistakenly typed 21206XXXXXXXX (kept the 0)
    if (clean.startsWith('2120') && clean.length === 13) {
      clean = '212' + clean.substring(4);
    }
  }

  return clean;
}

/**
 * Builds the official wa.me direct chat URL
 */
export function buildWhatsAppLink(rawPhone: string, message?: string): string {
  const normalized = normalizeWhatsAppNumber(rawPhone);
  if (!message) {
    return `https://wa.me/${normalized}`;
  }
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a phone number for elegant human display in the UI
 * e.g. "212600123456" -> "+212 600-123456"
 */
export function formatDisplayPhone(rawPhone: string): string {
  if (!rawPhone) return '+212 600 123 456';
  const clean = normalizeWhatsAppNumber(rawPhone);
  if (clean.startsWith('212') && clean.length === 12) {
    const operator = clean.substring(3, 5);
    const part1 = clean.substring(5, 8);
    const part2 = clean.substring(8);
    return `+212 ${operator} ${part1} ${part2}`;
  }
  return rawPhone;
}
