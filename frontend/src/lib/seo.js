export const SITE_URL = 'https://www.brandsgalaxy.store';
export const API_BASE_URL = 'https://brandsgalaxywebsite.onrender.com';

export function absoluteImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function productJsonLd(product) {
  const price = Number(product.discount_price || product.price);
  const url = `${SITE_URL}/products/${product.slug}`;
  const images = (product.images || []).map(absoluteImageUrl).filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} by ${product.brand} — 100% authentic, available at Brands Galaxy.`,
    image: images,
    sku: product.sku || undefined,
    brand: { '@type': 'Brand', name: product.brand },
    ...(Number(product.rating_count) > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(product.rating_average).toFixed(1),
        reviewCount: product.rating_count,
      },
    }),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'PKR',
      price,
      availability: product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Brands Galaxy',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://www.facebook.com/brandsgalaxy2022/',
      'https://www.instagram.com/brandsgalaxy22/',
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Brands Galaxy',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
