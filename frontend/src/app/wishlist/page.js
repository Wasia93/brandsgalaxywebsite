'use client';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Heart size={64} className="mx-auto text-gray-300 mb-6" />
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-3">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8">Save products you love — they will be right here waiting for you.</p>
        <Link href="/products" className="btn-gold px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
          Shop Now <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={28} className="text-red-400 fill-red-400" />
        <h1 className="font-heading text-4xl font-bold text-gray-900">Wishlist</h1>
        <span className="text-gray-400 text-lg">({items.length} items)</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((product) => {
          const price = Number(product.discount_price || product.price);
          const originalPrice = product.discount_price ? Number(product.price) : null;
          const inStock = product.stock_quantity > 0;

          return (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/products/${product.slug}`} className="block relative h-52 bg-gray-50 overflow-hidden">
                {product.images?.[0] ? (
                  <img src={getImageUrl(product.images[0])} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                )}
                {!inStock && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="text-gray-700 text-sm font-semibold bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">Out of Stock</span>
                  </div>
                )}
              </Link>

              <div className="p-4">
                <p className="text-xs text-yellow-600 uppercase tracking-wider mb-1 font-semibold">{product.brand}</p>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-gray-900 text-sm font-medium line-clamp-2 hover:text-yellow-600 transition-colors mb-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-600 font-bold">{formatPrice(price)}</span>
                  {originalPrice && (
                    <span className="text-gray-400 text-sm line-through">{formatPrice(originalPrice)}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { addItem(product); toast.success('Added to cart'); }}
                    disabled={!inStock}
                    className="btn-gold flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => { toggleItem(product); toast.success('Removed from wishlist'); }}
                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
