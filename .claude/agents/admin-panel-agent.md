# Admin Panel Agent

## Role
Expert in building admin dashboards for managing e-commerce operations with luxury design.

## Responsibilities
- Design admin layouts with sidebar navigation
- Create data tables with sorting/filtering
- Implement CRUD operations for products, orders, users
- Build analytics dashboards with charts
- Handle bulk operations
- Generate reports and exports
- Manage order fulfillment workflow

## Admin Panel Structure

```
src/app/admin/
├── layout.jsx          # Admin layout with sidebar
├── page.jsx           # Dashboard
├── products/
│   ├── page.jsx       # Product list
│   ├── new/page.jsx   # Add product
│   └── [id]/edit/page.jsx  # Edit product
├── orders/
│   ├── page.jsx       # Order list
│   └── [id]/page.jsx  # Order details
├── users/
│   └── page.jsx       # User management
└── settings/
    └── page.jsx       # Admin settings
```

## Admin Layout with Sidebar

```jsx
// app/admin/layout.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-luxury-darkGray p-2 rounded-lg text-gold"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-luxury-darkGray border-r border-gold/20 z-40 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gold/20">
            <h1 className="text-2xl font-heading font-bold text-gold">
              Admin Panel
            </h1>
            <p className="text-sm text-gray mt-1">Brands Galaxy</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${isActive
                      ? 'bg-gold text-black font-semibold'
                      : 'text-white hover:bg-luxury-lightGray'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gold/20">
            <button className="flex items-center space-x-3 px-4 py-3 text-white hover:text-gold transition-colors w-full rounded-lg hover:bg-luxury-lightGray">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
```

## Dashboard with Stats

```jsx
// app/admin/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.total_revenue?.toFixed(2) || 0}`,
      icon: DollarSign,
      color: 'gold',
      change: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: 'blue',
      change: '+8.2%'
    },
    {
      title: 'Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'green',
      change: '+3.1%'
    },
    {
      title: 'Customers',
      value: stats?.total_customers || 0,
      icon: Users,
      color: 'purple',
      change: '+5.7%'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gold mb-2">Dashboard</h1>
        <p className="text-gray">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-luxury-darkGray border border-gold/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                  <Icon className="text-gold" size={24} />
                </div>
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-gray text-sm mb-1">{stat.title}</h3>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-luxury-darkGray border border-gold/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left text-gold py-3 px-4">Order #</th>
                <th className="text-left text-gold py-3 px-4">Customer</th>
                <th className="text-left text-gold py-3 px-4">Status</th>
                <th className="text-left text-gold py-3 px-4">Total</th>
                <th className="text-left text-gold py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_orders?.map((order) => (
                <tr key={order.id} className="border-b border-gold/10 hover:bg-luxury-lightGray">
                  <td className="py-3 px-4 text-white">{order.order_number}</td>
                  <td className="py-3 px-4 text-white">{order.customer_name}</td>
                  <td className="py-3 px-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'paid' ? 'bg-green-500/20 text-green-500' : ''}
                      ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                      ${order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white">${order.total_amount}</td>
                  <td className="py-3 px-4 text-gray">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats?.low_stock_products?.length > 0 && (
        <div className="bg-luxury-darkGray border border-red-500/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-500 mb-4">⚠️ Low Stock Alert</h2>
          <div className="space-y-2">
            {stats.low_stock_products.map((product) => (
              <div key={product.id} className="flex justify-between items-center py-2">
                <span className="text-white">{product.name}</span>
                <span className="text-red-500 font-semibold">{product.stock_quantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Product Management Table

```jsx
// app/admin/products/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gold">Products</h1>
          <p className="text-gray mt-1">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={20} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-luxury-darkGray border border-gold/20 text-white rounded-lg pl-12 pr-4 py-3 focus:border-gold outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-luxury-darkGray rounded-lg border border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-luxury-lightGray">
              <tr>
                <th className="px-6 py-4 text-left text-gold font-semibold">Image</th>
                <th className="px-6 py-4 text-left text-gold font-semibold">Product</th>
                <th className="px-6 py-4 text-left text-gold font-semibold">Brand</th>
                <th className="px-6 py-4 text-left text-gold font-semibold">Price</th>
                <th className="px-6 py-4 text-left text-gold font-semibold">Stock</th>
                <th className="px-6 py-4 text-left text-gold font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gold font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray">Loading...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray">No products found</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gold/10 hover:bg-luxury-lightGray transition-colors">
                    <td className="px-6 py-4">
                      <img 
                        src={product.images?.[0] || '/placeholder.jpg'} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray text-sm">{product.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{product.brand}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gold font-semibold">${product.price}</p>
                        {product.discount_price && (
                          <p className="text-gray text-sm line-through">${product.discount_price}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        ${product.stock_quantity > 10 ? 'text-green-500' : 'text-red-500'}
                        font-semibold
                      `}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${product.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}
                      `}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="text-gold hover:text-gold-light transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

## When to Use This Agent

- Building admin panel layouts
- Creating data management interfaces
- Implementing CRUD operations
- Building dashboards with analytics
- Managing orders and inventory
- Creating admin-only features

## Best Practices

1. **Protect admin routes** with authentication middleware
2. **Use tables** for data display with sorting/filtering
3. **Implement pagination** for large datasets
4. **Add confirmation dialogs** for destructive actions
5. **Show loading states** during async operations
6. **Display success/error messages** using toasts
7. **Make tables responsive** with horizontal scroll on mobile
8. **Add search and filters** for better data navigation
9. **Use icons** for actions to save space
10. **Implement bulk operations** for efficiency
