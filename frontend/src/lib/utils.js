const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Returns a fully-qualified image URL.
 * - Supabase Storage URLs (https://...) → returned as-is
 * - Legacy local paths (/static/...) → prepend API_URL
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_URL}${path}`;
}
