'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle, Truck, CreditCard, Building2,
  Smartphone, ArrowLeft, ShoppingBag,
} from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';
import { formatPrice } from '@/lib/currency';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const SHIPPING_KARACHI = 350;
const SHIPPING_OTHER = 450;
const FREE_SHIPPING_THRESHOLD = 5000;
const TAX_RATE = 0.04;

// ── Bank details — update these when you have the real account numbers ──
const BANK_DETAILS = {
  easypaisa: {
    number: '0341-3157159',
    name: 'Wasiya Haris',
  },
  allied: {
    accountNo: '06410010077005960012',
    title: 'Wasia Jabeen',
    iban: '',
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { token, user } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city_type: 'karachi',   // 'karachi' | 'other'
    city_name: '',
    payment_method: 'cod',  // 'cod' | 'bank_transfer'
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
    if (user?.full_name) setForm(f => ({ ...f, full_name: user.full_name }));
  }, [user]);

  // ── Guard: not mounted yet ──
  if (!mounted) return null;

  // ── Guard: not logged in ──
  if (!token) {
    router.push('/auth/login?next=/checkout');
    return null;
  }

  // ── Guard: empty cart (but allow success screen) ──
  if (items.length === 0 && !orderPlaced) {
    router.push('/cart');
    return null;
  }

  // ── Price calculations ──
  const subtotal = getSubtotal();
  const cityName =
    form.city_type === 'karachi' ? 'Karachi' : (form.city_name.trim() || 'Other City');

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : form.city_type === 'karachi'
      ? SHIPPING_KARACHI
      : SHIPPING_OTHER;

  const base = subtotal + shipping;
  const tax = Math.round(base * TAX_RATE);
  const grandTotal = base + tax;

  // ── Place order ──
  const handlePlaceOrder = async () => {
    if (!form.full_name.trim()) { toast.error('Full name is required'); return; }
    if (!form.phone.trim())     { toast.error('Phone number is required'); return; }
    if (!form.address.trim())   { toast.error('Delivery address is required'); return; }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product_id: String(item.id),
        product_name: item.selectedSize
          ? `${item.name} (${item.selectedSize})`
          : item.name,
        product_brand: item.brand || null,
        product_image: item.images?.[0] || null,
        quantity: item.quantity,
        unit_price: Number(item.variantPrice ?? item.discount_price ?? item.price),
      }));

      const res = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          shipping_address: {
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: cityName,
          },
          payment_method: form.payment_method,
          customer_notes: form.notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Could not place order. Please try again.');
      }

      const data = await res.json();
      clearCart();
      setOrderPlaced({ ...data, paymentMethod: form.payment_method });
      window.scrollTo(0, 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (orderPlaced) {
    return <OrderSuccess order={orderPlaced} />;
  }

  // ── Checkout form ──
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4 sm:space-y-6">

          {/* Shipping details */}
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <Truck size={18} className="text-yellow-400" />
              Shipping Details
            </h2>

            <div className="space-y-4">
              <Field label="Full Name *">
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className={inputCls}
                />
              </Field>

              <Field label="Phone Number *">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="03XX-XXXXXXX"
                  className={inputCls}
                />
              </Field>

              <Field label="Delivery Address *">
                <textarea
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  rows={3}
                  placeholder="House/Flat #, Street, Area"
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <Field label="City *">
                <select
                  value={form.city_type}
                  onChange={e => setForm(f => ({ ...f, city_type: e.target.value }))}
                  className={inputCls}
                >
                  <option value="karachi">Karachi</option>
                  <option value="other">Other City</option>
                </select>
              </Field>

              {form.city_type === 'other' && (
                <Field label="City Name">
                  <input
                    type="text"
                    value={form.city_name}
                    onChange={e => setForm(f => ({ ...f, city_name: e.target.value }))}
                    placeholder="e.g. Lahore, Islamabad, Faisalabad…"
                    className={inputCls}
                  />
                </Field>
              )}

              <Field label="Order Notes (optional)">
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any special instructions?"
                  className={inputCls}
                />
              </Field>
            </div>
          </section>

          {/* Payment method */}
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <CreditCard size={18} className="text-yellow-400" />
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* COD option */}
              <PaymentOption
                id="cod"
                selected={form.payment_method === 'cod'}
                onSelect={() => setForm(f => ({ ...f, payment_method: 'cod' }))}
                icon={<Truck size={20} className="text-gray-400" />}
                title="Cash on Delivery (COD)"
                subtitle="Pay when your order arrives at your doorstep"
              />

              {/* Bank Transfer option */}
              <PaymentOption
                id="bank_transfer"
                selected={form.payment_method === 'bank_transfer'}
                onSelect={() => setForm(f => ({ ...f, payment_method: 'bank_transfer' }))}
                icon={<Building2 size={20} className="text-gray-400" />}
                title="Bank Transfer"
                subtitle="Pay via Easypaisa or Allied Bank — order confirmed after payment proof"
              />

              {/* Bank details panel */}
              {form.payment_method === 'bank_transfer' && (
                <div className="mt-2 space-y-3 pt-1">
                  {/* Easypaisa */}
                  <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone size={16} className="text-green-400" />
                      <span className="text-sm font-semibold text-green-400">Easypaisa</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Account Number:{' '}
                      <span className="font-mono text-white">{BANK_DETAILS.easypaisa.number}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Account Name:{' '}
                      <span className="text-white">{BANK_DETAILS.easypaisa.name}</span>
                    </p>
                  </div>

                  {/* Allied Bank */}
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 size={16} className="text-blue-400" />
                      <span className="text-sm font-semibold text-blue-400">Allied Bank (ABL)</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Account #:{' '}
                      <span className="font-mono text-white">{BANK_DETAILS.allied.accountNo}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Account Title:{' '}
                      <span className="text-white">{BANK_DETAILS.allied.title}</span>
                    </p>
                  </div>

                  {/* Instructions */}
                  <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
                    <p className="text-xs text-yellow-300 leading-relaxed">
                      After making the payment, please send the payment screenshot to our Instagram{' '}
                      <a
                        href="https://www.instagram.com/brandsgalaxy22/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline"
                      >
                        @brandsgalaxy22
                      </a>{' '}
                      or Facebook. Your order will be confirmed within 24 hours.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN — Order Summary ── */}
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
              <ShoppingBag size={18} className="text-yellow-400" />
              Order Summary
            </h2>

            {/* Items list */}
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
              {items.map(item => {
                const itemPrice = Number(item.variantPrice ?? item.discount_price ?? item.price);
                const imageSrc = item.images?.[0];
                return (
                  <div key={item.cartKey} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {imageSrc
                        ? <img src={`${API_URL}${imageSrc}`} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                        : <span className="text-xl">✨</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      {item.selectedSize && (
                        <span className="text-xs text-yellow-500">{item.selectedSize}</span>
                      )}
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-yellow-400 flex-shrink-0">
                      {formatPrice(itemPrice * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-gray-700 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping ({cityName})</span>
                {shipping === 0
                  ? <span className="text-green-400">Free</span>
                  : <span>{formatPrice(shipping)}</span>
                }
              </div>

              {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-gray-600 -mt-1">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                </p>
              )}

              <div className="flex justify-between text-gray-400">
                <span>Tax (4%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-white">
                <span>Grand Total</span>
                <span className="text-yellow-400 text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Place order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-6 w-full btn-gold py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : form.payment_method === 'cod' ? (
                'Place Order — Cash on Delivery'
              ) : (
                'Place Order — Pay via Bank'
              )}
            </button>

            <p className="text-xs text-gray-600 text-center mt-3">
              By placing your order you agree to our terms & conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── Sub-components ────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

function PaymentOption({ selected, onSelect, icon, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? 'border-yellow-500 bg-yellow-500/10'
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Radio dot */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          selected ? 'border-yellow-500' : 'border-gray-500'
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />}
      </div>

      <div className="flex-1">
        <p className="font-semibold text-sm text-white">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      {icon}
    </button>
  );
}


// ── Order Success Screen ──────────────────────────────────────

function OrderSuccess({ order }) {
  const isBankTransfer = order.paymentMethod === 'bank_transfer';

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-400" />
      </div>

      <h1 className="font-heading text-3xl font-bold mb-2">Order Placed!</h1>
      <p className="text-gray-400 mb-1 text-sm">Your order number is:</p>
      <p className="text-2xl font-bold text-yellow-400 mb-8">{order.order_number}</p>

      {!isBankTransfer ? (
        /* COD confirmation */
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left mb-8">
          <p className="text-sm font-semibold text-green-400 mb-2">✅ Cash on Delivery — Confirmed</p>
          <p className="text-sm text-gray-300">
            Your order has been placed successfully. Our team will contact you on the provided phone
            number to confirm delivery details.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Subtotal</p>
              <p className="text-white font-semibold">{formatPrice(order.subtotal)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Shipping</p>
              <p className="text-white font-semibold">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-gray-400 text-xs">Total</p>
              <p className="text-yellow-400 font-bold">{formatPrice(order.total)}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Bank Transfer instructions */
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left mb-8 space-y-4">
          <p className="text-sm font-semibold text-yellow-400">💳 Payment Instructions</p>
          <p className="text-sm text-gray-300">
            Please transfer{' '}
            <span className="font-bold text-white">{formatPrice(order.total)}</span> to one of the
            accounts below:
          </p>

          <div className="space-y-3">
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-400 mb-1">🟢 Easypaisa</p>
              <p className="text-sm text-white font-mono">{BANK_DETAILS.easypaisa.number}</p>
              <p className="text-xs text-gray-400">{BANK_DETAILS.easypaisa.name}</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-400 mb-1">🔵 Allied Bank (ABL)</p>
              <p className="text-sm text-white font-mono">{BANK_DETAILS.allied.accountNo}</p>
              <p className="text-xs text-gray-400">Account Title: {BANK_DETAILS.allied.title}</p>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3">
            <p className="text-xs text-yellow-300 leading-relaxed">
              After payment, send the screenshot to our Instagram{' '}
              <a
                href="https://www.instagram.com/brandsgalaxy22/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                @brandsgalaxy22
              </a>{' '}
              or Facebook. Your order will be confirmed within 24 hours.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Link
          href="/products"
          className="btn-gold px-6 py-2.5 rounded-lg font-semibold text-sm"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-lg font-semibold text-sm border border-gray-700 hover:border-gray-500 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

const inputCls =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm ' +
  'focus:border-yellow-500 focus:outline-none transition-colors placeholder-gray-600';
