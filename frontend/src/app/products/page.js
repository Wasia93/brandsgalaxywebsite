import { SITE_URL } from '@/lib/seo';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'Shop All Products',
  description: 'Browse 160+ authentic skincare, makeup and K-Beauty products in Pakistan — MAC, CeraVe, Huda Beauty, ANUA, MEDICUBE & more. Filter by brand, category and price.',
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: {
    title: 'Shop All Products | Brands Galaxy',
    description: 'Browse 160+ authentic skincare, makeup and K-Beauty products in Pakistan.',
    url: `${SITE_URL}/products`,
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
