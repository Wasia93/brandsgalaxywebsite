import { supabase } from '@/lib/supabaseClient';
import { SITE_URL, absoluteImageUrl, productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import ProductDetailClient from './ProductDetailClient';

async function getProduct(slug) {
  const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  return data || null;
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) {
    return { title: 'Product Not Found', robots: { index: false, follow: true } };
  }

  const price = Number(product.discount_price || product.price);
  const title = `${product.name} — ${product.brand}`;
  const description = product.description
    ? product.description.slice(0, 155)
    : `Buy ${product.name} by ${product.brand} in Pakistan — 100% authentic, Rs. ${price.toLocaleString()}. Cash on delivery, fast shipping.`;
  const url = `${SITE_URL}/products/${product.slug}`;
  const image = absoluteImageUrl(product.images?.[0]);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);

  return (
    <>
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbJsonLd([
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: product.brand, href: `/products?brand=${product.brand}` },
                { name: product.name, href: `/products/${product.slug}` },
              ])),
            }}
          />
        </>
      )}
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
