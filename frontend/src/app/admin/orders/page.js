'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    cls: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  paid:       { label: 'Paid',       cls: 'bg-blue-100 text-blue-700 border-blue-300' },
  processing: { label: 'Processing', cls: 'bg-orange-100 text-orange-700 border-orange-300' },
  shipped:    { label: 'Shipped',    cls: 'bg-purple-100 text-purple-700 border-purple-300' },
  delivered:  { label: 'Delivered',  cls: 'bg-green-100 text-green-700 border-green-300' },
  cancelled:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-700 border-red-300' },
  refunded:   { label: 'Refunded',   cls: 'bg-gray-100 text-gray-700 border-gray-300' },
};

const TABS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user?.is_admin) { router.push('/auth/login'); return; }
    fetchOrders();
  }, [mounted, token, user, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (activeTab !== 'all') params.status = activeTab;
      const res = await api.get('/api/orders/admin', { params });
      const data = res.data;
      setOrders(data.orders ?? data);
      setTotal(data.total ?? (data.orders ?? data).length);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!mounted || !token || !user?.is_admin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-yellow-600 text-xs uppercase tracking-widest mb-1">Admin</p>
          <h1 className="font-heading text-4xl font-bold text-gray-900">Orders</h1>
        </div>
        <span className="text-sm text-gray-400">{total} total</span>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-gray-100 rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const addr = order.shipping_address ?? {};
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Summary row */}
                <div
                  className="flex flex-wrap items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-[120px]">
                    <p className="font-semibold text-gray-900 text-sm">{order.order_number}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <div className="hidden sm:block min-w-[130px]">
                    <p className="text-sm text-gray-900 font-medium truncate">{addr.full_name}</p>
                    <p className="text-xs text-gray-400">{addr.phone}</p>
                  </div>

                  <span className="hidden md:block text-sm text-gray-500 min-w-[80px] truncate">{addr.city}</span>

                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {order.payment_method === 'bank_transfer' ? 'Bank' : 'COD'}
                  </span>

                  <span className="font-bold text-yellow-600 text-sm">{formatPrice(order.total)}</span>

                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.cls}`}>
                    {cfg.label}
                  </span>

                  <select
                    value={order.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                  >
                    {Object.entries(STATUS_CONFIG).map(([val, c]) => (
                      <option key={val} value={val}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
                        <p className="text-gray-900 font-medium">{addr.full_name}</p>
                        <p className="text-gray-600">{addr.phone}</p>
                        <p className="text-gray-600">{addr.address}</p>
                        <p className="text-gray-600">{addr.city}</p>
                      </div>
                      {order.customer_notes && (
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Customer Notes</p>
                          <p className="text-gray-600 italic">"{order.customer_notes}"</p>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-gray-100 text-sm">
                          <div>
                            <span className="text-gray-900 font-medium">{item.product_name}</span>
                            {item.product_brand && <span className="text-gray-400 text-xs ml-2">{item.product_brand}</span>}
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <span className="text-gray-500">x{item.quantity}</span>
                            <span className="text-yellow-600 font-medium">{formatPrice(item.total_price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex justify-end gap-6 text-sm">
                      <span className="text-gray-500">Subtotal: {formatPrice(order.subtotal)}</span>
                      <span className="text-gray-500">Shipping: {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                      <span className="font-bold text-gray-900">Total: {formatPrice(order.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
