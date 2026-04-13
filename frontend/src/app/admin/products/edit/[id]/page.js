'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, Plus, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { productsAPI, getErrorMessage } from '@/lib/api';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, token } = useAuthStore();
  const fileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    brand: '',
    category_id: '',
    price: '',
    discount_price: '',
    stock_quantity: '0',
    sku: '',
    is_featured: false,
    is_active: true,
    images: [],
    extra_data: [],
  });

  useEffect(() => {
    if (!token || !user?.is_admin) { router.push('/auth/login'); return; }

    const init = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          productsAPI.getCategories(),
          api.get(`/api/products/${id}`),
        ]);
        setCategories(catRes.data);
        const p = prodRes.data;
        const extraArr = p.extra_data
          ? Object.entries(p.extra_data).map(([key, value]) => ({ key, value: String(value) }))
          : [];
        setForm({
          name: p.name || '',
          slug: p.slug || '',
          description: p.description || '',
          brand: p.brand || '',
          category_id: p.category_id || '',
          price: String(p.price || ''),
          discount_price: p.discount_price ? String(p.discount_price) : '',
          stock_quantity: String(p.stock_quantity ?? 0),
          sku: p.sku || '',
          is_featured: p.is_featured || false,
          is_active: p.is_active ?? true,
          images: p.images || [],
          extra_data: extraArr,
        });
      } catch {
        toast.error('Failed to load product');
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token, user, router, id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/api/products/upload-image', data);
      setForm((f) => ({ ...f, images: [...f.images, res.data.url] }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Image upload failed'));
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const addExtraField = () => setForm((f) => ({ ...f, extra_data: [...f.extra_data, { key: '', value: '' }] }));
  const updateExtra = (idx, field, val) =>
    setForm((f) => ({ ...f, extra_data: f.extra_data.map((e, i) => i === idx ? { ...e, [field]: val } : e) }));
  const removeExtra = (idx) =>
    setForm((f) => ({ ...f, extra_data: f.extra_data.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.price || isNaN(Number(form.price))) { toast.error('Enter a valid price'); return; }

    const extraObj = form.extra_data.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key.trim()] = value;
      return acc;
    }, {});

    const payload = {
      name: form.name,
      description: form.description || null,
      brand: form.brand,
      category_id: form.category_id || undefined,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock_quantity: Number(form.stock_quantity),
      sku: form.sku || null,
      is_featured: form.is_featured,
      is_active: form.is_active,
      images: form.images,
      extra_data: Object.keys(extraObj).length > 0 ? extraObj : null,
    };

    setSubmitting(true);
    try {
      await api.put(`/api/products/${id}`, payload);
      setSuccess(true);
      toast.success('Product updated!');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update product'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !user?.is_admin) return null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {[1,2,3].map(i => <div key={i} className="bg-gray-900 rounded-2xl h-40 animate-pulse" />)}
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <CheckCircle size={56} className="text-green-400" />
        <h2 className="font-heading text-3xl font-bold">Product Updated!</h2>
        <p className="text-gray-500">Redirecting to admin…</p>
      </div>
    );
  }

  const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors text-sm";
  const labelCls = "block text-sm text-gray-400 mb-1.5";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Admin
      </button>
      <div className="mb-8">
        <p className="text-yellow-400 text-xs uppercase tracking-widest mb-1">Admin</p>
        <h1 className="font-heading text-4xl font-bold">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1">{form.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Images */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Product Images</h2>
          <div className="flex flex-wrap gap-4">
            {form.images.map((url, i) => (
              <div key={i} className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-700 group">
                <img src={getImageUrl(url)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploadingImage}
              className="w-28 h-28 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-yellow-500/50 transition-colors disabled:opacity-50 text-gray-500 hover:text-yellow-400">
              {uploadingImage
                ? <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                : <><Upload size={20} /><span className="text-xs text-center leading-tight">Upload<br />image</span></>}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
        </div>

        {/* Basic Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 grid md:grid-cols-2 gap-5">
          <h2 className="font-semibold text-white md:col-span-2">Basic Information</h2>

          <div className="md:col-span-2">
            <label className={labelCls}>Product Name <span className="text-red-400">*</span></label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Brand <span className="text-red-400">*</span></label>
            <input required value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} className={inputCls}>
              <option value="">Select category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`${inputCls} resize-none`} />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 grid md:grid-cols-3 gap-5">
          <h2 className="font-semibold text-white md:col-span-3">Pricing & Inventory</h2>

          <div>
            <label className={labelCls}>Price (Rs.) <span className="text-red-400">*</span></label>
            <input type="number" step="0.01" min="0.01" required value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Sale Price (Rs.) <span className="text-gray-600">(optional)</span></label>
            <input type="number" step="0.01" min="0.01" value={form.discount_price}
              onChange={(e) => setForm((f) => ({ ...f, discount_price: e.target.value }))} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Stock Quantity <span className="text-red-400">*</span></label>
            <input type="number" min="0" required value={form.stock_quantity}
              onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>SKU <span className="text-gray-600">(optional)</span></label>
            <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} className={inputCls} />
          </div>

          <div className="md:col-span-2 flex gap-6 items-center pt-2">
            {[
              { key: 'is_featured', label: 'Mark as Featured' },
              { key: 'is_active', label: 'Active (visible in store)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${form[key] ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'}`}>
                  {form[key] && <span className="text-black text-xs font-bold">✓</span>}
                </div>
                <span className="text-gray-300 text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Extra Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Product Details <span className="text-gray-600 font-normal text-sm">(size, SPF, ingredients…)</span></h2>
            <button type="button" onClick={addExtraField} className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 text-sm">
              <Plus size={15} /> Add field
            </button>
          </div>
          {form.extra_data.length === 0 && <p className="text-gray-600 text-sm">No extra fields.</p>}
          <div className="space-y-3">
            {form.extra_data.map((field, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input value={field.key} onChange={(e) => updateExtra(i, 'key', e.target.value)}
                  placeholder="Field name" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500" />
                <input value={field.value} onChange={(e) => updateExtra(i, 'value', e.target.value)}
                  placeholder="Value" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-500" />
                <button type="button" onClick={() => removeExtra(i)} className="text-gray-600 hover:text-red-400 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" disabled={submitting}
            className="btn-gold flex-1 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Saving…</>
              : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-4 border border-gray-700 rounded-xl text-gray-400 hover:border-gray-500 hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
