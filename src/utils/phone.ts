/**
 * Centralized Moroccan & International WhatsApp Number Utility
 * Converts local numbers (06..., 07..., 05...) or international numbers (+212..., 00212...)
 * into the required WhatsApp API international format (e.g. 212612345678).
 * Never stores or injects hardcoded fallback phone numbers.
 */

export function normalizeWhatsAppNumber(rawPhone?: string | null): string {
  if (!rawPhone) return '';

  // 1. Remove all spaces, dashes, parentheses, plus signs
  let clean = rawPhone.replace(/[^0-9]/g, '');
  if (!clean) return '';

  // 2. Handle double leading zero international prefix (00212...)
  if (clean.startsWith('00')) {
    clean = clean.substring(2);
  }

  // 3. Handle Moroccan local numbers (06XXXXXXXX, 07XXXXXXXX, 05XXXXXXXX)
  if (clean.startsWith('0') && clean.length === 10) {
    clean = '212' + clean.substring(1);
  }
  // If user entered 9 digits without the leading 0 (e.g. 6XXXXXXXX or 7XXXXXXXX)
  else if (
    (clean.startsWith('6') || clean.startsWith('7') || clean.startsWith('5')) &&
    clean.length === 9
  ) {
    clean = '212' + clean;
  }
  // If user mistakenly typed 21206XXXXXXXX (kept the 0 after 212)
  else if (clean.startsWith('2120') && clean.length === 13) {
    clean = '212' + clean.substring(4);
  }

  return clean;
}

export function isValidWhatsAppNumber(rawPhone?: string | null): boolean {
  const normalized = normalizeWhatsAppNumber(rawPhone);
  return normalized.length >= 9 && normalized.length <= 15;
}

/**
 * Builds the official wa.me direct chat URL from the centralized number.
 */
export function buildWhatsAppLink(rawPhone?: string | null, message?: string): string {
  const normalized = normalizeWhatsAppNumber(rawPhone);
  if (!normalized) return '#';
  if (!message) {
    return `https://wa.me/${normalized}`;
  }
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a phone number for clean human display in the UI.
 */
export function formatDisplayPhone(rawPhone?: string | null): string {
  if (!rawPhone) return '';
  const clean = normalizeWhatsAppNumber(rawPhone);
  if (clean.startsWith('212') && clean.length === 12) {
    const operator = clean.substring(3, 5);
    const part1 = clean.substring(5, 8);
    const part2 = clean.substring(8);
    return `+212 ${operator} ${part1} ${part2}`;
  }
  return rawPhone.trim();
}
