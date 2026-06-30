'use client';
import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productsAPI } from '@/lib/api';

const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-yellow-500 placeholder-gray-400";

const PRICE_RANGES = [
  { label: 'Under Rs. 2,000', min: '', max: '2000' },
  { label: 'Rs. 2,000 – 5,000', min: '2000', max: '5000' },
  { label: 'Rs. 5,000 – 10,000', min: '5000', max: '10000' },
  { label: 'Over Rs. 10,000', min: '10000', max: '' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const debounceRef = useRef(null);

  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
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
    params.limit = 100;

    productsAPI.getAll(params)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const is_featured = searchParams.get('is_featured') === 'true' ? true : undefined;
    setFilters(f => ({ ...f, category, brand, is_featured }));
  }, [searchParams]);

  useEffect(() => {
    productsAPI.getCategories().then((r) => setCategories(r.data)).catch(() => {});
    productsAPI.getBrands().then((r) => setBrands(r.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearchChange = (val) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters(f => ({ ...f, search: val }));
    }, 400);
  };

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const clearFilters = () => {
    setSearchInput('');
    setFilters({ search: '', category: '', brand: '', min_price: '', max_price: '', is_featured: undefined, in_stock: false, sort_by: 'created_at', sort_order: 'desc' });
  };

  const applyPriceRange = (range) => {
    setFilters(f => ({ ...f, min_price: range.min, max_price: range.max }));
  };

  // Active filter chips
  const activeFilters = [];
  if (filters.search) activeFilters.push({ key: 'search', label: `"${filters.search}"` });
  if (filters.category) activeFilters.push({ key: 'category', label: categories.find(c => c.slug === filters.category)?.name || filters.category });
  if (filters.brand) activeFilters.push({ key: 'brand', label: filters.brand });
  if (filters.min_price || filters.max_price) {
    const min = filters.min_price ? `Rs. ${Number(filters.min_price).toLocaleString()}` : '0';
    const max = filters.max_price ? `Rs. ${Number(filters.max_price).toLocaleString()}` : '∞';
    activeFilters.push({ key: 'price', label: `${min} – ${max}` });
  }
  if (filters.in_stock) activeFilters.push({ key: 'in_stock', label: 'In Stock' });
  if (filters.is_featured) activeFilters.push({ key: 'is_featured', label: 'Featured' });

  const removeFilter = (key) => {
    if (key === 'search') { setSearchInput(''); setFilters(f => ({ ...f, search: '' })); }
    else if (key === 'price') setFilters(f => ({ ...f, min_price: '', max_price: '' }));
    else if (key === 'in_stock') setFilters(f => ({ ...f, in_stock: false }));
    else if (key === 'is_featured') setFilters(f => ({ ...f, is_featured: undefined }));
    else setFilters(f => ({ ...f, [key]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-yellow-600 text-sm uppercase tracking-widest mb-1 font-semibold">Our Collection</p>
        <h1 className="font-heading text-4xl font-bold text-gray-900">All Products</h1>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          />
          {searchInput && (
            <button onClick={() => handleSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={16} />
            </button>
          )}
        </div>
        <select
          value={`${filters.sort_by}_${filters.sort_order}`}
          onChange={(e) => {
            const [by, ...rest] = e.target.value.split('_');
            const order = rest.join('_');
            setFilters((f) => ({ ...f, sort_by: by, sort_order: order }));
          }}
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-500"
        >
          <option value="created_at_desc">Newest</option>
          <option value="created_at_asc">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_average_desc">Top Rated</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 border rounded-lg px-4 py-3 transition-colors bg-white ${showFilters ? 'border-yellow-500 text-yellow-700' : 'border-gray-300 text-gray-700 hover:border-yellow-500 hover:text-yellow-700'}`}
        >
          <SlidersHorizontal size={18} />
          Filters
          {activeFilters.length > 0 && (
            <span className="bg-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeFilters.length}</span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(f => (
            <span key={f.key} className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium px-3 py-1.5 rounded-full">
              {f.label}
              <button onClick={() => removeFilter(f.key)} className="hover:text-red-500 transition-colors ml-0.5">
                <X size={12} />
              </button>
            </span>
          ))}
          <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-700 underline px-1">
            Clear all
          </button>
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Category</label>
              <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className={inputCls}>
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Brand</label>
              <select value={filters.brand} onChange={(e) => updateFilter('brand', e.target.value)} className={inputCls}>
                <option value="">All Brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Min Price (Rs.)</label>
              <input type="number" min="0" value={filters.min_price} onChange={(e) => updateFilter('min_price', e.target.value)} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Max Price (Rs.)</label>
              <input type="number" min="0" value={filters.max_price} onChange={(e) => updateFilter('max_price', e.target.value)} className={inputCls} placeholder="99999" />
            </div>
          </div>

          {/* Quick price ranges */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick Price Ranges</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map(r => (
                <button key={r.label} onClick={() => applyPriceRange(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filters.min_price === r.min && filters.max_price === r.max ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-300'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.in_stock} onChange={(e) => updateFilter('in_stock', e.target.checked)} className="accent-yellow-500 w-4 h-4" />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!filters.is_featured} onChange={(e) => updateFilter('is_featured', e.target.checked || undefined)} className="accent-yellow-500 w-4 h-4" />
              <span className="text-sm text-gray-700">Featured Only</span>
            </label>
          </div>
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-gray-400 text-sm mb-4">
          {products.length} product{products.length !== 1 ? 's' : ''} found
          {activeFilters.length > 0 && <span className="text-gray-300"> · <button onClick={clearFilters} className="hover:text-gray-500 underline">clear filters</button></span>}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4 text-gray-300">?</p>
          <p className="text-lg text-gray-700 font-semibold mb-1">No products found</p>
          {filters.search && <p className="text-gray-400 text-sm mb-4">No results for "{filters.search}"</p>}
          <button onClick={clearFilters} className="mt-2 btn-gold px-6 py-2 rounded-lg text-sm font-semibold">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
