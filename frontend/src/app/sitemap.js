import { supabase } from '@/lib/supabaseClient';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

async function getProducts() {
  const { data } = await supabase.from('products').select('slug, updated_at').eq('is_active', true).limit(500);
  return data || [];
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('slug');
  return data || [];
}

export default async function sitemap() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: 'daily', priority: 0.9 },
  ].map((route) => ({ ...route, lastModified: new Date() }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/products?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
