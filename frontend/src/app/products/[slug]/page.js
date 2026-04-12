'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Star, Package, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/* ── Image Carousel ── */
function ImageCarousel({ images, name }) {
  const [current, setCurrent] = useState(0);
  const total = images?.length || 0;

  if (total === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <span className="text-8xl">✨</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative w-full h-full group">
      <img
        src={`${API_URL}${images[current]}`}
        alt={`${name} - ${current + 1}`}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      {total > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? 'bg-yellow-400 w-4' : 'bg-white/40 w-2 hover:bg-white/70'}`} />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 px-4 z-20">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === current ? 'border-yellow-400' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={`${API_URL}${img}`} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Parse variants from extra_data ── */
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
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!slug) return;
    productsAPI.getOne(slug)
      .then((res) => {
        setProduct(res.data);
        const variants = parseVariants(res.data.extra_data);
        if (variants.length > 0) setSelectedVariant(variants[0]);
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
      toast.success(`${product.name} (${selectedVariant.size}) × ${qty} added to cart`);
    } else {
      if (product.stock_quantity <= 0) return;
      addItem(product, qty);
      toast.success(`${product.name} × ${qty} added to cart`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        <div className="bg-gray-900 rounded-xl h-96 animate-pulse" />
        <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="bg-gray-900 rounded h-8 animate-pulse" />)}</div>
      </div>
    );
  }

  if (!product) return null;

  const variants = parseVariants(product.extra_data);
  const hasVariants = variants.length > 0;

  // Price: use selected variant price if available, else product price
  const displayPrice = hasVariants && selectedVariant
    ? selectedVariant.price
    : Number(product.discount_price || product.price);
  const originalPrice = !hasVariants && product.discount_price ? Number(product.price) : null;

  // Stock: use selected variant stock if available
  const stockQty = hasVariants && selectedVariant
    ? selectedVariant.stock
    : product.stock_quantity;

  // extra_data fields to display (exclude "variants" key)
  const extraEntries = product.extra_data
    ? Object.entries(product.extra_data).filter(([k]) => k !== 'variants')
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-6 md:gap-12">
        {/* ── Image Carousel ── */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden h-64 sm:h-80 md:h-[520px]">
          <ImageCarousel images={product.images || []} name={product.name} />
          {product.discount_price && !hasVariants && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-sm px-3 py-1 rounded-lg font-semibold z-30">SALE</span>
          )}
        </div>

        {/* ── Details ── */}
        <div className="flex flex-col">
          <p className="text-yellow-400 uppercase tracking-widest text-sm mb-2">{product.brand}</p>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{product.name}</h1>

          {/* Rating */}
          {Number(product.rating_count) > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={16} className={s <= Math.round(Number(product.rating_average)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
              ))}
              <span className="text-gray-400 text-sm">{Number(product.rating_average).toFixed(1)} ({product.rating_count} reviews)</span>
            </div>
          )}

          {/* Price — updates live when size is selected */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-yellow-400 text-2xl sm:text-3xl md:text-4xl font-bold">{formatPrice(displayPrice)}</span>
            {originalPrice && (
              <>
                <span className="text-gray-500 text-xl line-through">{formatPrice(originalPrice)}</span>
                <span className="bg-red-900 text-red-300 text-sm px-2 py-1 rounded">Save {formatPrice(originalPrice - displayPrice)}</span>
              </>
            )}
            {hasVariants && (
              <span className="text-gray-500 text-sm">per {selectedVariant?.size}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* ── Size / Variant Selector ── */}
          {hasVariants && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">
                Size: <span className="text-white font-semibold">{selectedVariant?.size}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.size}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock <= 0}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all relative ${
                      selectedVariant?.size === v.size
                        ? 'border-yellow-500 bg-yellow-500/15 text-yellow-400'
                        : v.stock <= 0
                          ? 'border-gray-800 text-gray-600 cursor-not-allowed line-through'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
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
          <div className="flex items-center gap-2 mb-6">
            <Package size={16} className={stockQty > 0 ? 'text-green-400' : 'text-red-400'} />
            <span className={`text-sm ${stockQty > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stockQty > 0 ? `${stockQty} in stock` : 'Out of stock'}
            </span>
            {product.sku && <span className="text-gray-600 text-xs ml-4">SKU: {product.sku}</span>}
          </div>

          {/* Qty + Add to Cart */}
          {stockQty > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-800 transition-colors text-lg">−</button>
                <span className="px-4 py-3 text-white font-medium min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(stockQty, qty + 1))} className="px-4 py-3 hover:bg-gray-800 transition-colors text-lg">+</button>
              </div>
              <button onClick={handleAddToCart}
                className="btn-gold flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          )}

          {/* Product Details table */}
          {extraEntries.length > 0 && (
            <div className="border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-yellow-400" />
                <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Product Details</p>
              </div>
              <dl className="space-y-2">
                {extraEntries.map(([key, val]) => (
                  <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                    <dd className="text-gray-300">{Array.isArray(val) ? val.join(', ') : String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
