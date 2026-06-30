'use client';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_KARACHI } from '@/lib/currency';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTax, getShipping, getGrandTotal } = useCartStore();

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getGrandTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Discover our luxury collection and add something beautiful.</p>
        <Link href="/products" className="btn-gold px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
          Shop Now <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-bold text-gray-900">Your Cart</h1>
        <button onClick={() => { clearCart(); toast.success('Cart cleared'); }} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemPrice = Number(item.variantPrice ?? item.discount_price ?? item.price);
            const imageSrc = item.images?.[0];
            return (
              <div key={item.cartKey} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4 shadow-sm">
                {/* Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
                  {imageSrc ? (
                    <img src={getImageUrl(imageSrc)} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-yellow-600 mb-0.5 font-semibold">{item.brand}</p>
                  <Link href={`/products/${item.slug}`} className="text-gray-900 font-medium text-sm hover:text-yellow-600 line-clamp-2">
                    {item.name}
                  </Link>
                  {item.selectedSize && (
                    <span className="inline-block mt-1 text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full">
                      {item.selectedSize}
                    </span>
                  )}
                  <p className="text-yellow-600 font-semibold mt-1">{formatPrice(itemPrice)}</p>
                </div>

                {/* Qty controls */}
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => { removeItem(item.cartKey); toast.success('Item removed'); }} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm bg-gray-50">
                    <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-100 min-w-[40px] text-gray-700">−</button>
                    <span className="px-3 py-2 text-gray-900 font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-100 min-w-[40px] text-gray-700">+</button>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{formatPrice(itemPrice * item.quantity)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 h-fit sticky top-24 shadow-sm">
          <h2 className="font-heading text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax (4% est.)</span>
              <span className="text-gray-900">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600 font-semibold">Free</span> : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400">Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping</p>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span className="text-yellow-600">{formatPrice(total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-gold w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight size={18} />
          </Link>
          <Link href="/products" className="block text-center text-gray-400 text-sm mt-4 hover:text-gray-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
