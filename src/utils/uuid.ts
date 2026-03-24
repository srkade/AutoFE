/**
 * A safe alternative to crypto.randomUUID() for non-secure contexts (HTTP).
 * Browsers only expose crypto.randomUUID in secure contexts (HTTPS or localhost).
 */
export const safeRandomUUID = (): string => {
  // Check if crypto.randomUUID is available (secure context)
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  // Fallback for non-secure context (HTTP)
  // Simple RFC 4122 version 4 UUID generator (not cryptographically strong, but good for UI IDs)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
