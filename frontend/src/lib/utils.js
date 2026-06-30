export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // In production Next.js rewrites proxy /static/* → Render backend
  if (process.env.NODE_ENV === 'production') return path;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${path}`;
}
