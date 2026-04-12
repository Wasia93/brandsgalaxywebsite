'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, PlusCircle, ShoppingBag, BarChart2, ArrowRight, Pencil } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { productsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/currency';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState({ products: 0, categories: 0, brands: 0 });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!token || !user?.is_admin) { router.push('/auth/login'); return; }
    Promise.all([
      productsAPI.getCategories(),
      productsAPI.getBrands(),
      productsAPI.getAll({ limit: 100 }),
    ]).then(([cats, brands, prods]) => {
      setStats({ categories: cats.data.length, brands: brands.data.length, products: prods.data.length });
      setProducts(prods.data);
    }).catch(() => {});
  }, [token, user, router]);

  if (!token || !user?.is_admin) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-yellow-400 text-xs uppercase tracking-widest mb-1">Admin Area</p>
        <h1 className="font-heading text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, {user.full_name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: <Package size={24} />, label: 'Products', value: stats.products, color: 'text-yellow-400' },
          { icon: <ShoppingBag size={24} />, label: 'Categories', value: stats.categories, color: 'text-blue-400' },
          { icon: <BarChart2 size={24} />, label: 'Brands', value: stats.brands, color: 'text-green-400' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="font-heading text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link href="/admin/products/new"
          className="group bg-gray-900 border border-gray-800 hover:border-yellow-500/50 rounded-xl p-6 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <PlusCircle size={24} className="text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Add New Product</p>
              <p className="text-gray-500 text-sm">Upload image & fill product details</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-600 group-hover:text-yellow-400 transition-colors" />
        </Link>

        <Link href="/products"
          className="group bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-6 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <ShoppingBag size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">View Storefront</p>
              <p className="text-gray-500 text-sm">See how the shop looks to customers</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
        </Link>
      </div>

      {/* Product list with edit links */}
      <h2 className="font-heading text-xl font-bold mb-4">All Products</h2>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Brand</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = p.images?.[0];
                const price = Number(p.discount_price || p.price);
                return (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {img
                            ? <img src={`${API_URL}${img}`} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
                            : <span className="text-lg">✨</span>}
                        </div>
                        <span className="text-white font-medium line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.brand}</td>
                    <td className="px-4 py-3 text-yellow-400 font-medium">{formatPrice(price)}</td>
                    <td className="px-4 py-3">
                      <span className={p.stock_quantity > 0 ? 'text-green-400' : 'text-red-400'}>
                        {p.stock_quantity > 0 ? `${p.stock_quantity}` : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/products/edit/${p.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-yellow-400 transition-colors border border-gray-700 hover:border-yellow-500/50 rounded-lg px-3 py-1.5">
                        <Pencil size={12} /> Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
