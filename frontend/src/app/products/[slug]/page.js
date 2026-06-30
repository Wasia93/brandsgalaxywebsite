'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Star, Package, Tag, ChevronLeft, ChevronRight, Heart, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { productsAPI } from '@/lib/api';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import { getImageUrl } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';

/* ── Image Carousel ── */
function ImageCarousel({ images, name }) {
  const [current, setCurrent] = useState(0);
  const total = images?.length || 0;

  if (total === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <span className="text-8xl">✨</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative w-full h-full group">
      <img
        src={getImageUrl(images[current])}
        alt={`${name} - ${current + 1}`}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      {total > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-700 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 shadow-md">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-700 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 shadow-md">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? 'bg-yellow-500 w-4' : 'bg-gray-400/60 w-2 hover:bg-gray-500'}`} />
            ))}
          </div>
          {images.length > 1 && images.length <= 6 && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 px-4 z-20">
              {images.map((img, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === current ? 'border-yellow-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function parseVariants(extra_data) {
  if (!extra_data?.variants) return [];
  const raw = extra_data.variants;
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [copied, setCopied] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productsAPI.getOne(slug)
      .then((res) => {
        const p = res.data;
        setProduct(p);
        const variants = parseVariants(p.extra_data);
        if (variants.length > 0) setSelectedVariant(variants[0]);
        // Fetch related products from same category
        if (p.category_id) {
          productsAPI.getAll({ category_id: p.category_id, limit: 8 })
            .then((r) => setRelated(r.data.filter(x => x.id !== p.id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleAddToCart = () => {
    if (!product) return;
    const variants = parseVariants(product.extra_data);
    if (variants.length > 0) {
      if (!selectedVariant) { toast.error('Please select a size'); return; }
      if (selectedVariant.stock <= 0) { toast.error('This size is out of stock'); return; }
      addItem(product, qty, selectedVariant.size, selectedVariant.price);
      toast.success(`Added to cart!`);
    } else {
      if (product.stock_quantity <= 0) return;
      addItem(product, qty);
      toast.success(`Added to cart!`);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('Could not copy link'));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        <div className="bg-gray-100 rounded-xl h-96 animate-pulse" />
        <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="bg-gray-100 rounded h-8 animate-pulse" />)}</div>
      </div>
    );
  }

  if (!product) return null;

  const variants = parseVariants(product.extra_data);
  const hasVariants = variants.length > 0;
  const wishlisted = isWishlisted(product.id);

  const displayPrice = hasVariants && selectedVariant
    ? selectedVariant.price
    : Number(product.discount_price || product.price);
  const originalPrice = !hasVariants && product.discount_price ? Number(product.price) : null;
  const savings = originalPrice ? originalPrice - displayPrice : 0;

  const stockQty = hasVariants && selectedVariant
    ? selectedVariant.stock
    : product.stock_quantity;

  const extraEntries = product.extra_data
    ? Object.entries(product.extra_data).filter(([k]) => k !== 'variants')
    : [];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-yellow-600 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?brand=${product.brand}`} className="hover:text-yellow-600 transition-colors">{product.brand}</Link>
          <span>/</span>
          <span className="text-gray-600 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12">
          {/* ── Image Carousel ── */}
          <div className="relative bg-gray-50 rounded-2xl overflow-hidden h-64 sm:h-80 md:h-[520px] border border-gray-100">
            <ImageCarousel images={product.images || []} name={product.name} />
            {product.discount_price && !hasVariants && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold z-30">SALE</span>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col">
            <p className="text-yellow-600 uppercase tracking-widest text-sm mb-1 font-semibold">{product.brand}</p>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

            {/* Rating */}
            {Number(product.rating_count) > 0 && (
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} className={s <= Math.round(Number(product.rating_average)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
                <span className="text-gray-400 text-sm">{Number(product.rating_average).toFixed(1)} ({product.rating_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-yellow-600 text-2xl sm:text-3xl md:text-4xl font-bold">{formatPrice(displayPrice)}</span>
              {originalPrice && (
                <>
                  <span className="text-gray-400 text-xl line-through">{formatPrice(originalPrice)}</span>
                  <span className="bg-red-50 text-red-500 text-sm px-2 py-1 rounded-full border border-red-100 font-medium">Save {formatPrice(savings)}</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-500 leading-relaxed mb-5 text-sm sm:text-base">{product.description}</p>
            )}

            {/* ── Size / Variant Selector ── */}
            {hasVariants && (
              <div className="mb-5">
                <p className="text-sm text-gray-500 mb-3">
                  Size: <span className="text-gray-900 font-semibold">{selectedVariant?.size}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.size}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock <= 0}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all relative ${
                        selectedVariant?.size === v.size
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : v.stock <= 0
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                      }`}
                    >
                      {v.size}
                      <span className="block text-xs font-normal mt-0.5 opacity-80">{formatPrice(v.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <Package size={16} className={stockQty > 0 ? 'text-green-500' : 'text-red-500'} />
              <span className={`text-sm font-medium ${stockQty > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {stockQty > 0 ? `${stockQty} in stock` : 'Out of stock'}
              </span>
              {product.sku && <span className="text-gray-400 text-xs ml-4">SKU: {product.sku}</span>}
            </div>

            {/* Qty + Add to Cart */}
            {stockQty > 0 ? (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-100 transition-colors text-lg text-gray-700 min-w-[44px]">−</button>
                  <span className="px-4 py-3 text-gray-900 font-medium min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(stockQty, qty + 1))} className="px-4 py-3 hover:bg-gray-100 transition-colors text-lg text-gray-700 min-w-[44px]">+</button>
                </div>
                <button onClick={handleAddToCart}
                  className="btn-gold flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium text-center">
                Currently Out of Stock
              </div>
            )}

            {/* Wishlist + Share row */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => { toggleItem(product); toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${wishlisted ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500'}`}
              >
                <Heart size={16} className={wishlisted ? 'fill-red-500' : ''} />
                {wishlisted ? 'Saved' : 'Save to Wishlist'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400 text-sm font-medium transition-all"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { icon: '✓', text: '100% Authentic', color: 'text-green-600 bg-green-50 border-green-200' },
                { icon: '🚚', text: 'Fast Delivery', color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { icon: '↩', text: 'Easy Returns', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
              ].map(b => (
                <div key={b.text} className={`text-center text-xs py-2 px-1 rounded-lg border ${b.color} font-medium`}>
                  <span className="block mb-0.5">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>

            {/* Product Details table */}
            {extraEntries.length > 0 && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-yellow-600" />
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Product Details</p>
                </div>
                <dl className="space-y-2">
                  {extraEntries.map(([key, val]) => (
                    <div key={key} className="grid grid-cols-2 gap-2 text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <dt className="text-gray-500 capitalize font-medium">{key.replace(/_/g, ' ')}</dt>
                      <dd className="text-gray-800">{Array.isArray(val) ? val.join(', ') : String(val)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-yellow-600 text-xs uppercase tracking-widest mb-1 font-semibold">You May Also Like</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">Related Products</h2>
              </div>
              <Link href="/products" className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
