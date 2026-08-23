import { supabase } from './supabaseClient';

// Talks directly to Supabase (Postgres + Auth + Storage) instead of a separate
// backend. Exports keep the exact shape the rest of the app already expects
// (authAPI/productsAPI, plus a generic get/post/put/patch/delete shim) so page
// components didn't need to change when the FastAPI/Render backend was retired.

function apiError(message) {
  const err = new Error(message);
  err.response = { data: { detail: message } };
  return err;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
async function fetchProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw apiError(error.message);
  return data;
}

function mapUser(authUser, profile) {
  return {
    id: authUser.id,
    email: authUser.email,
    full_name: profile?.full_name || '',
    phone: profile?.phone || null,
    is_active: profile?.is_active ?? true,
    is_admin: profile?.is_admin ?? false,
    email_verified: !!authUser.email_confirmed_at,
    created_at: profile?.created_at || authUser.created_at,
    last_login: authUser.last_sign_in_at || null,
  };
}

export const authAPI = {
  register: async ({ email, password, full_name, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, phone: phone || null } },
    });
    if (error) throw apiError(error.message);
    if (!data.session) {
      throw apiError('Account created — please check your email to confirm it, then sign in.');
    }
    const profile = await fetchProfile(data.user.id);
    return { data: { access_token: data.session.access_token, token_type: 'bearer', user: mapUser(data.user, profile) } };
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw apiError('Incorrect email or password');
    const profile = await fetchProfile(data.user.id);
    return { data: { access_token: data.session.access_token, token_type: 'bearer', user: mapUser(data.user, profile) } };
  },

  me: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw apiError('Not authenticated');
    const profile = await fetchProfile(user.id);
    return { data: mapUser(user, profile) };
  },

  logout: () => supabase.auth.signOut(),
};

// ─── Products ────────────────────────────────────────────────────────────────
async function queryProducts(params = {}) {
  let categoryId = params.category_id || null;
  if (!categoryId && params.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).maybeSingle();
    if (cat) categoryId = cat.id;
  }

  let q = supabase.from('products').select('*').eq('is_active', true);
  if (categoryId) q = q.eq('category_id', categoryId);
  if (params.brand) q = q.ilike('brand', `%${params.brand}%`);
  if (params.search) {
    const term = `%${params.search}%`;
    q = q.or(`name.ilike.${term},description.ilike.${term},brand.ilike.${term}`);
  }
  if (params.min_price !== undefined && params.min_price !== '') q = q.gte('price', params.min_price);
  if (params.max_price !== undefined && params.max_price !== '') q = q.lte('price', params.max_price);
  if (params.is_featured !== undefined) q = q.eq('is_featured', params.is_featured);
  if (params.in_stock) q = q.gt('stock_quantity', 0);

  const sortBy = params.sort_by || 'created_at';
  const ascending = (params.sort_order || 'desc') === 'asc';
  q = q.order(sortBy, { ascending });

  const skip = params.skip || 0;
  const limit = params.limit || 20;
  q = q.range(skip, skip + limit - 1);

  const { data, error } = await q;
  if (error) throw apiError(error.message);
  return { data };
}

async function getProductByIdentifier(identifier) {
  let { data } = await supabase.from('products').select('*').eq('slug', identifier).maybeSingle();
  if (!data) {
    ({ data } = await supabase.from('products').select('*').eq('id', identifier).maybeSingle());
  }
  if (!data) throw apiError('Product not found');
  return { data };
}

async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw apiError(error.message);
  return { data };
}

async function getBrands() {
  const { data, error } = await supabase.from('products').select('brand').eq('is_active', true);
  if (error) throw apiError(error.message);
  return { data: [...new Set((data || []).map((r) => r.brand).filter(Boolean))] };
}

export const productsAPI = {
  getAll: (params = {}) => queryProducts(params),
  getOne: (identifier) => getProductByIdentifier(identifier),
  getCategories,
  getBrands,
};

async function createProduct(payload) {
  const now = new Date().toISOString();
  const row = { id: crypto.randomUUID(), created_at: now, updated_at: now, ...payload };
  const { data, error } = await supabase.from('products').insert(row).select().single();
  if (error) {
    if (error.code === '23505') throw apiError('Product with this slug already exists');
    throw apiError(error.message);
  }
  return { data };
}

async function updateProduct(id, payload) {
  const row = { ...payload, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('products').update(row).eq('id', id).select().single();
  if (error) throw apiError(error.message);
  return { data };
}

async function deleteProduct(id) {
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id);
  if (error) throw apiError(error.message);
  return { data: null };
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

async function uploadProductImage(formData) {
  const file = formData.get('file');
  if (!file) throw apiError('No file provided');
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw apiError(`Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF`);
  }
  if (file.size > MAX_IMAGE_SIZE) throw apiError('File too large. Maximum size is 5 MB.');

  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'jpg';
  const filename = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from('products').upload(filename, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw apiError(error.message);

  const { data } = supabase.storage.from('products').getPublicUrl(filename);
  return { data: { url: data.publicUrl, filename } };
}

// ─── Orders ──────────────────────────────────────────────────────────────────
async function createOrder(payload) {
  const { data, error } = await supabase.rpc('create_order', {
    p_items: payload.items,
    p_shipping_address: payload.shipping_address,
    p_payment_method: payload.payment_method,
    p_customer_notes: payload.customer_notes || null,
  });
  if (error) throw apiError(error.message);
  return { data };
}

async function getMyOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, total_amount, payment_method, created_at, order_items(count)')
    .order('created_at', { ascending: false });
  if (error) throw apiError(error.message);
  return {
    data: (data || []).map((o) => ({
      id: o.id,
      order_number: o.order_number,
      status: o.status,
      total: o.total_amount,
      payment_method: o.payment_method,
      created_at: o.created_at,
      items_count: o.order_items?.[0]?.count ?? 0,
    })),
  };
}

function mapOrderItems(items) {
  return (items || []).map((i) => ({
    product_name: i.product_name,
    product_brand: i.product_brand,
    quantity: i.quantity,
    unit_price: i.unit_price,
    total_price: i.total_price,
  }));
}

async function getAdminOrders(params = {}) {
  let q = supabase.from('orders').select('*, order_items(*)', { count: 'exact' }).order('created_at', { ascending: false });
  if (params.status) q = q.eq('status', params.status);
  const skip = params.skip || 0;
  const limit = params.limit || 100;
  q = q.range(skip, skip + limit - 1);

  const { data, error, count } = await q;
  if (error) throw apiError(error.message);
  return {
    data: {
      total: count ?? (data || []).length,
      orders: (data || []).map((o) => ({
        id: o.id,
        order_number: o.order_number,
        status: o.status,
        subtotal: o.subtotal,
        shipping: o.shipping,
        tax: o.tax,
        total: o.total_amount,
        payment_method: o.payment_method,
        shipping_address: o.shipping_address,
        customer_notes: o.customer_notes,
        created_at: o.created_at,
        items: mapOrderItems(o.order_items),
      })),
    },
  };
}

async function updateOrderStatus(orderId, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) throw apiError(error.message);
  return { data: { success: true, order_id: orderId, status } };
}

async function getOrder(orderId) {
  const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('id', orderId).maybeSingle();
  if (error || !data) throw apiError('Order not found');
  return {
    data: {
      id: data.id,
      order_number: data.order_number,
      status: data.status,
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      total: data.total_amount,
      payment_method: data.payment_method,
      shipping_address: data.shipping_address,
      customer_notes: data.customer_notes,
      created_at: data.created_at,
      items: mapOrderItems(data.order_items),
    },
  };
}

export const ordersAPI = {
  create: (payload) => createOrder(payload),
  myOrders: () => getMyOrders(),
  adminList: (params) => getAdminOrders(params),
  updateStatus: (orderId, status) => updateOrderStatus(orderId, status),
  getOne: (orderId) => getOrder(orderId),
};

// ─── Generic get/post/put/patch/delete shim ───────────────────────────────────
// Preserves the handful of call sites (admin pages, checkout) that call the
// default export directly with a REST-style URL instead of going through
// authAPI/productsAPI/ordersAPI.
async function apiGet(url, config) {
  const params = config?.params || {};
  if (url === '/api/orders/my-orders') return getMyOrders();
  if (url === '/api/orders/admin') return getAdminOrders(params);
  const productMatch = url.match(/^\/api\/products\/([^/]+)$/);
  if (productMatch) return getProductByIdentifier(decodeURIComponent(productMatch[1]));
  throw apiError(`Unhandled GET ${url}`);
}

async function apiPost(url, data) {
  if (url === '/api/orders/' || url === '/api/orders') return createOrder(data);
  if (url === '/api/products/upload-image') return uploadProductImage(data);
  if (url === '/api/products/' || url === '/api/products') return createProduct(data);
  throw apiError(`Unhandled POST ${url}`);
}

async function apiPut(url, data) {
  const productMatch = url.match(/^\/api\/products\/([^/]+)$/);
  if (productMatch) return updateProduct(decodeURIComponent(productMatch[1]), data);
  throw apiError(`Unhandled PUT ${url}`);
}

async function apiPatch(url, data) {
  const statusMatch = url.match(/^\/api\/orders\/([^/]+)\/status$/);
  if (statusMatch) return updateOrderStatus(decodeURIComponent(statusMatch[1]), data.status);
  throw apiError(`Unhandled PATCH ${url}`);
}

async function apiDelete(url) {
  const productMatch = url.match(/^\/api\/products\/([^/]+)$/);
  if (productMatch) return deleteProduct(decodeURIComponent(productMatch[1]));
  throw apiError(`Unhandled DELETE ${url}`);
}

const api = { get: apiGet, post: apiPost, put: apiPut, patch: apiPatch, delete: apiDelete };
export default api;

/** Extract a readable string from any error thrown above */
export function getErrorMessage(err, fallback = 'Something went wrong') {
  const detail = err?.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((e) => e.msg ?? JSON.stringify(e)).join(', ');
  return fallback;
}
