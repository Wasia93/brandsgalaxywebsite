'use client';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import toast from 'react-hot-toast';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function ProductImage({ images, name }) {
  const src = images?.[0];
  if (src) {
    return (
      <img
        src={`${API_URL}${src}`}
        alt={name}
        className="w-full h-56 object-cover relative z-10"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }
  return null;
}

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const [quickView, setQuickView] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const price = Number(product.discount_price || product.price);
  const originalPrice = product.discount_price ? Number(product.price) : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity <= 0) { toast.error('Out of stock'); return; }
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(true);
  };

  return (
    <>
      <Link href={`/products/${product.slug}`}>
        <div className="bg-luxury-darkGray border border-gray-800 rounded-lg overflow-hidden card-hover group cursor-pointer">
          {/* Image */}
          <div className="relative bg-gray-900 h-56 flex items-center justify-center overflow-hidden">
            <ProductImage images={product.images} name={product.name} />
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 absolute inset-0">
              <span className="text-4xl">✨</span>
            </div>

            {/* Badges */}
            {product.discount_price && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold z-20">SALE</span>
            )}
            {product.is_featured && !product.discount_price && (
              <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-semibold z-20">FEATURED</span>
            )}

            {/* Hover action buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={handleWishlist}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${wishlisted ? 'bg-red-500 text-white' : 'bg-black/70 text-white hover:bg-red-500'}`}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={14} className={wishlisted ? 'fill-white' : ''} />
              </button>
              <button
                onClick={handleQuickView}
                className="w-8 h-8 rounded-full bg-black/70 text-white hover:bg-yellow-500 hover:text-black flex items-center justify-center shadow-lg transition-colors"
                title="Quick view"
              >
                <Eye size={14} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-yellow-500 uppercase tracking-wider mb-1">{product.brand}</p>
            <h3 className="text-white font-medium text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            {Number(product.rating_count) > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-400">
                  {Number(product.rating_average).toFixed(1)} ({product.rating_count})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-yellow-400 font-semibold">{formatPrice(price)}</span>
                {originalPrice && (
                  <span className="text-gray-500 text-sm line-through ml-2">{formatPrice(originalPrice)}</span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className="btn-gold p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                title="Add to cart"
              >
                <ShoppingCart size={16} />
              </button>
            </div>

            {product.stock_quantity <= 0 && (
              <p className="text-red-400 text-xs mt-2">Out of stock</p>
            )}
          </div>
        </div>
      </Link>

      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </>
  );
}
