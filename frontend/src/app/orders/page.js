'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { formatPrice } from '@/lib/currency';

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700 border-yellow-300',
  paid:       'bg-blue-100 text-blue-700 border-blue-300',
  processing: 'bg-orange-100 text-orange-700 border-orange-300',
  shipped:    'bg-purple-100 text-purple-700 border-purple-300',
  delivered:  'bg-green-100 text-green-700 border-green-300',
  cancelled:  'bg-red-100 text-red-700 border-red-300',
  refunded:   'bg-gray-100 text-gray-700 border-gray-300',
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) { router.push('/auth/login?next=/orders'); return; }
    api.get('/api/orders/my-orders')
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [mounted, token, router]);

  if (!mounted || loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />)}
    </div>
  );

  if (orders.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <Package size={64} className="mx-auto text-gray-300 mb-6" />
      <h1 className="font-heading text-3xl font-bold text-gray-900 mb-3">No orders yet</h1>
      <p className="text-gray-500 mb-8">Once you place an order it will appear here.</p>
      <Link href="/products" className="btn-gold px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
        Shop Now <ArrowRight size={18} />
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-heading text-4xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const colorCls = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-900">{order.order_number}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}{order.items_count} item{order.items_count !== 1 ? 's' : ''}
                    {' · '}{order.payment_method === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${colorCls}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-yellow-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
