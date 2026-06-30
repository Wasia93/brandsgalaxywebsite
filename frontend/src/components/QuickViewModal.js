'use client';
import { useState } from 'react';
import { X, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

function parseVariants(extra_data) {
  if (!extra_data?.variants) return [];
  const raw = extra_data.variants;
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

export default function QuickViewModal({ product, onClose }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const variants = parseVariants(product.extra_data);
  const hasVariants = variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? variants[0] : null);
  const [qty, setQty] = useState(1);

  const displayPrice = hasVariants && selectedVariant
    ? selectedVariant.price
    : Number(product.discount_price || product.price);

  const stockQty = hasVariants && selectedVariant
    ? selectedVariant.stock
    : product.stock_quantity;

  const handleAddToCart = () => {
    if (hasVariants) {
      if (!selectedVariant) { toast.error('Please select a size'); return; }
      if (selectedVariant.stock <= 0) { toast.error('Out of stock'); return; }
      addItem(product, qty, selectedVariant.size, selectedVariant.price);
      toast.success(`${product.name} (${selectedVariant.size}) added to cart`);
    } else {
      if (product.stock_quantity <= 0) { toast.error('Out of stock'); return; }
      addItem(product, qty);
      toast.success(`${product.name} added to cart`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors text-gray-600"
        >
          <X size={16} />
        </button>

        <div className="grid sm:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-gray-50 rounded-tl-2xl rounded-bl-2xl overflow-hidden h-64 sm:h-full flex items-center justify-center">
            {product.images?.[0] ? (
              <img
                src={getImageUrl(product.images[0])}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span className="text-6xl">✨</span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <p className="text-yellow-600 text-xs uppercase tracking-widest mb-1 font-semibold">{product.brand}</p>
            <h2 className="text-gray-900 font-bold text-lg leading-tight mb-3">{product.name}</h2>

            <p className="text-yellow-600 text-2xl font-bold mb-4">{formatPrice(displayPrice)}</p>

            {product.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{product.description}</p>
            )}

            {/* Size selector */}
            {hasVariants && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Size: <span className="text-gray-900 font-semibold">{selectedVariant?.size}</span></p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.size}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock <= 0}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedVariant?.size === v.size
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : v.stock <= 0
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            {stockQty > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm bg-gray-50">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100 text-gray-700">−</button>
                  <span className="px-3 py-2 text-gray-900 font-medium">{qty}</span>
                  <button onClick={() => setQty(Math.min(stockQty, qty + 1))} className="px-3 py-2 hover:bg-gray-100 text-gray-700">+</button>
                </div>
                <span className="text-xs text-gray-400">{stockQty} in stock</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={stockQty <= 0}
                className="btn-gold flex-1 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                {stockQty <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => { toggleItem(product); toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist'); }}
                className={`p-2.5 rounded-lg border transition-colors ${wishlisted ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500'}`}
              >
                <Heart size={16} className={wishlisted ? 'fill-red-400' : ''} />
              </button>
            </div>

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs text-gray-400 hover:text-yellow-600 mt-3 transition-colors"
            >
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
