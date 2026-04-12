'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productsAPI } from '@/lib/api';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || '',
    brand: '',
    min_price: '',
    max_price: '',
    is_featured: searchParams.get('is_featured') === 'true' ? true : undefined,
    in_stock: false,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.is_featured) params.is_featured = true;
    if (filters.in_stock) params.in_stock = true;
    params.sort_by = filters.sort_by;
    params.sort_order = filters.sort_order;
    params.limit = 50;

    productsAPI.getAll(params)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    productsAPI.getCategories().then((r) => setCategories(r.data)).catch(() => {});
    productsAPI.getBrands().then((r) => setBrands(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const clearFilters = () => setFilters({ search: '', category: '', brand: '', min_price: '', max_price: '', is_featured: undefined, in_stock: false, sort_by: 'created_at', sort_order: 'desc' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-yellow-400 text-sm uppercase tracking-widest mb-1">Our Collection</p>
        <h1 className="font-heading text-4xl font-bold">All Products</h1>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
          />
        </div>
        <select
          value={`${filters.sort_by}_${filters.sort_order}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split('_');
            setFilters((f) => ({ ...f, sort_by: by, sort_order: order }));
          }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="created_at_desc">Newest</option>
          <option value="created_at_asc">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_average_desc">Top Rated</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border border-gray-700 rounded-lg px-4 py-3 hover:border-yellow-500 transition-colors"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Category</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => updateFilter('brand', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
            >
              <option value="">All Brands</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Min Price (Rs.)</label>
            <input
              type="number" min="0" value={filters.min_price}
              onChange={(e) => updateFilter('min_price', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max Price (Rs.)</label>
            <input
              type="number" min="0" value={filters.max_price}
              onChange={(e) => updateFilter('max_price', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
              placeholder="999"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="in_stock" checked={filters.in_stock} onChange={(e) => updateFilter('in_stock', e.target.checked)} className="accent-yellow-400" />
            <label htmlFor="in_stock" className="text-sm text-gray-300">In Stock Only</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={!!filters.is_featured} onChange={(e) => updateFilter('is_featured', e.target.checked || undefined)} className="accent-yellow-400" />
            <label htmlFor="featured" className="text-sm text-gray-300">Featured Only</label>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
              <X size={14} /> Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-gray-500 text-sm mb-4">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-lg h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No products found.</p>
          <button onClick={clearFilters} className="mt-4 text-yellow-400 underline text-sm">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
