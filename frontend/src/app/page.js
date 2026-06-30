'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Truck, Star, Sparkles, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productsAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

// Fixed hero collage cards
const HERO_COLLAGE = [
  { img: '/static/products/03aab1b255a44c0fae4f5daa99f102b4.webp', name: 'CeraVe Foaming Cleanser',         slug: 'cerave-foaming-facial-cleanser' },
  { img: '/static/products/92004adc288247caab3af2b91694191b.webp', name: 'MAC Studio Fix Foundation',       slug: 'mac-studio-fix-fluid-foundation-spf15' },
  { img: '/static/products/de8c3a333cef40a1918223b087cdbb46.png',  name: 'Olay Micro-Sculpting Cream',      slug: 'olay-regenerist-micro-sculpting-cream' },
  { img: '/static/products/527ea96543144f7099607dc0a9df3261.png',  name: 'Neutrogena Zinc Sunscreen SPF 50', slug: 'neutrogena-sheer-zinc-mineral-sunscreen-spf50' },
  { img: '/static/products/87e004015f9742a8a0c2acdf379b7592.png',  name: 'Olay Collagen Peptide 24 Serum',  slug: 'olay-collagen-peptide-24-serum' },
  { img: '/static/products/cc7078a88e694da4854d44bd58b20324.png',  name: 'CeraVe Hyaluronic Acid Serum',    slug: 'cerave-hydrating-hyaluronic-acid-serum' },
];

const HEADLINES = [
  { tag: 'New Arrivals', title: 'Luxury Beauty', accent: 'Redefined.', sub: 'Shop MAC, CeraVe, Huda Beauty & more — every product 100% authentic.', href: '/products', cta: 'Shop Now' },
  { tag: 'K-Beauty', title: 'Korean', accent: 'Glow.', sub: 'ANUA, MEDICUBE & more — authentic Korean skincare for real glass-skin results.', href: '/products?category=korean-beauty', cta: 'Shop K-Beauty' },
  { tag: 'Skincare Essentials', title: 'Glow From', accent: 'Within.', sub: 'Science-backed skincare with Ceramides, Hyaluronic Acid & Retinol.', href: '/products?category=skincare', cta: 'Shop Skincare' },
  { tag: 'Makeup Collection', title: 'Bold &', accent: 'Beautiful.', sub: 'Charlotte Tilbury, Tarte, Huda Beauty — iconic looks delivered to you.', href: '/products?category=makeup', cta: 'Shop Makeup' },
];

/* ── Premium Hero ── */
function PremiumHero({ products }) {
  const [idx, setIdx] = useState(0);
  const withImages = products.filter(p => p.images?.length > 0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HEADLINES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const h = HEADLINES[idx];

  return (
    <section className="relative min-h-[92vh] bg-white overflow-hidden flex items-center">

      {/* Subtle background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_10%_50%,_rgba(218,165,32,0.07)_0%,_transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_90%_30%,_rgba(255,215,0,0.05)_0%,_transparent_60%)]" />
      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* ── LEFT: Text ── */}
          <div>
            <div key={idx + 'tag'} className="animate-[fadeSlideUp_0.5s_ease_forwards]">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-yellow-700 font-medium mb-5 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5">
                <Sparkles size={11} /> {h.tag}
              </span>
            </div>

            <div key={idx + 'title'} className="animate-[fadeSlideUp_0.55s_ease_forwards]">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.06] mb-5 tracking-tight">
                <span className="text-gray-900 block">{h.title}</span>
                <span className="gold-gradient block">{h.accent}</span>
              </h1>
            </div>

            <div key={idx + 'sub'} className="animate-[fadeSlideUp_0.6s_ease_forwards]">
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md">{h.sub}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link href={h.href}
                className="btn-gold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-yellow-200">
                {h.cta} <ArrowRight size={18} />
              </Link>
              <Link href="/products"
                className="border border-gray-300 text-gray-700 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-center hover:border-yellow-400 hover:text-yellow-700 transition-all bg-white">
                View All
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-4 sm:gap-8 pt-6 border-t border-gray-200">
              {[['150+','Products'],['9+','Brands'],['100%','Authentic']].map(([v,l]) => (
                <div key={l} className="text-center">
                  <p className="font-heading text-xl sm:text-3xl font-bold text-yellow-600">{v}</p>
                  <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-8">
              {HEADLINES.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === idx ? 'w-7 h-2 bg-yellow-500' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`} />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Image Collage ── */}
          <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-3 h-[460px]">
            {HERO_COLLAGE.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`}
                className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 hover:border-yellow-400 hover:shadow-md transition-all group">
                <img src={getImageUrl(p.img)} alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-medium leading-tight line-clamp-1">{p.name}</p>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [allProds, setAllProds] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      productsAPI.getAll({ is_featured: true, limit: 8 }),
      productsAPI.getAll({ limit: 50 }),
    ])
      .then(([feat, all]) => { setFeatured(feat.data); setAllProds(all.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const skincareProds = allProds.filter(p => p.extra_data?.skin_type && p.images?.length > 0);
  const bannerA = skincareProds[0] || null;
  const bannerB = skincareProds[1] || null;

  return (
    <div className="overflow-x-hidden bg-white">

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <PremiumHero products={allProds} />

      {/* ════════════════════════════════════════════
          TRUST BAR
      ════════════════════════════════════════════ */}
      <section className="border-y border-gray-200 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: <Truck size={22} className="text-yellow-600" />, title: 'Free Shipping', desc: 'Orders over Rs. 5,000' },
            { icon: <Shield size={22} className="text-yellow-600" />, title: '100% Authentic', desc: 'Every product verified' },
            { icon: <Star size={22} className="text-yellow-500 fill-yellow-400" />, title: 'Top Brands', desc: "MAC · CeraVe · L'Oreal" },
          ].map((p) => (
            <div key={p.title} className="flex flex-col items-center gap-1.5">
              {p.icon}
              <p className="font-semibold text-gray-800 text-sm">{p.title}</p>
              <p className="text-gray-400 text-xs hidden sm:block">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          EDITORIAL BANNERS (Skincare + Makeup)
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Skincare card */}
          <Link href="/products?category=skincare"
            className="group relative rounded-3xl overflow-hidden h-52 sm:h-64 md:h-72 bg-gradient-to-br from-blue-50 via-white to-white border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.08)_0%,_transparent_60%)]" />
            {bannerA?.images?.[0] && (
              <img src={getImageUrl(bannerA.images[0])} alt="Skincare"
                className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.target.style.display = 'none'; }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent" />
            <div className="relative z-10 p-5 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs text-blue-600 uppercase tracking-widest font-semibold">Science-Backed</span>
                <h3 className="font-heading text-xl sm:text-3xl font-bold text-gray-900 mt-2 leading-tight">
                  Skincare<br />That Works
                </h3>
                <p className="text-gray-500 text-sm mt-3 max-w-[200px]">
                  Ceramides, Hyaluronic Acid & Retinol for visibly healthier skin.
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Shop Skincare <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Makeup card */}
          <Link href="/products?category=makeup"
            className="group relative rounded-3xl overflow-hidden h-52 sm:h-64 md:h-72 bg-gradient-to-br from-rose-50 via-white to-white border border-rose-100 hover:border-rose-300 hover:shadow-lg transition-all duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(244,63,94,0.08)_0%,_transparent_60%)]" />
            <img src={getImageUrl('/static/products/92004adc288247caab3af2b91694191b.webp')} alt="MAC Foundation"
              className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent" />
            <div className="relative z-10 p-5 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs text-rose-500 uppercase tracking-widest font-semibold">Bold & Beautiful</span>
                <h3 className="font-heading text-xl sm:text-3xl font-bold text-gray-900 mt-2 leading-tight">
                  Makeup<br />Collection
                </h3>
                <p className="text-gray-500 text-sm mt-3 max-w-[200px]">
                  MAC, L'Oreal & more — from foundation to the perfect lip color.
                </p>
              </div>
              <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm group-hover:gap-3 transition-all">
                Shop Makeup <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          KOREAN BEAUTY HERO BANNER
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-16">

        {/* Full-width K-Beauty hero */}
        <div className="relative rounded-3xl overflow-hidden border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-[340px] sm:min-h-[420px] shadow-sm">

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_0%_50%,_rgba(236,72,153,0.08)_0%,_transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_100%_20%,_rgba(168,85,247,0.06)_0%,_transparent_60%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center h-full">

            {/* LEFT — Text */}
            <div className="flex-1 p-8 sm:p-12 lg:p-14">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-pink-600 font-semibold mb-5 bg-pink-50 border border-pink-200 rounded-full px-4 py-1.5">
                Now Available
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Korean <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Beauty</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-sm mb-6 leading-relaxed">
                Glass-skin results with ANUA & MEDICUBE — Korea's most loved skincare brands, now in Pakistan.
              </p>

              <div className="flex flex-col gap-2 mb-8">
                {[
                  { brand: 'ANUA', desc: 'Heartleaf · PDRN · Rice 70 Collection' },
                  { brand: 'MEDICUBE', desc: 'Collagen · Glutathione · PDRN Series' },
                ].map((b) => (
                  <div key={b.brand} className="flex items-center gap-3 bg-white border border-pink-100 rounded-xl px-4 py-2.5 w-fit shadow-sm">
                    <span className="text-pink-600 font-bold text-sm min-w-[80px]">{b.brand}</span>
                    <span className="text-gray-400 text-xs">{b.desc}</span>
                  </div>
                ))}
              </div>

              <Link href="/products?category=korean-beauty"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-pink-200">
                Shop K-Beauty <ArrowRight size={16} />
              </Link>
            </div>

            {/* RIGHT — Product image grid */}
            <div className="flex-shrink-0 p-6 lg:p-10 grid grid-cols-2 gap-3 w-full lg:w-[420px]">
              {[
                { img: 'https://cdn.shopify.com/s/files/1/0733/2285/6745/files/anua-peach-70-niacinamide-serum-cosmetic-holic-1.webp?v=1740820397', name: 'ANUA Peach 70% Niacinamide Serum', slug: 'anua-peach-70-niacinamide-serum' },
                { img: 'https://cdn.shopify.com/s/files/1/0733/2285/6745/files/anua-pdrn-hyaluronic-acid-100-moisturizing-cream-cosmetic-holic-1.jpg?v=1740820394', name: 'ANUA PDRN Moisturizing Cream', slug: 'anua-pdrn-hyaluronic-acid-100-moisturizing-cream' },
                { img: 'https://cdn.shopify.com/s/files/1/0733/2285/6745/files/medicube-collagen-jelly-cream-cosmetic-holic-1.jpg?v=1740820364', name: 'MEDICUBE Collagen Jelly Cream', slug: 'medicube-collagen-jelly-cream' },
                { img: 'https://cdn.shopify.com/s/files/1/0733/2285/6745/files/medicube-collagen-glow-booster-milk-serum-cosmetic-holic-1.jpg?v=1740820362', name: 'MEDICUBE Collagen Glow Serum', slug: 'medicube-collagen-glow-booster-milk-serum' },
              ].map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`}
                  className="relative rounded-2xl overflow-hidden bg-white border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all group h-36 sm:h-44">
                  <img src={p.img} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-medium leading-tight line-clamp-2">{p.name}</p>
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* ANUA + MEDICUBE brand cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* ANUA card */}
          <Link href="/products?brand=ANUA"
            className="group relative rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-orange-50 via-white to-white border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(251,146,60,0.08)_0%,_transparent_60%)]" />
            <img src="https://cdn.shopify.com/s/files/1/0733/2285/6745/files/anua-rice-70-glow-milky-toner-250ml-cosmetic-holic-1.webp?v=1740820395"
              alt="ANUA" className="absolute right-0 bottom-0 h-full w-2/5 object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent" />
            <div className="relative z-10 p-7 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs text-orange-500 uppercase tracking-widest font-semibold">Korean Brand</span>
                <h3 className="font-heading text-3xl font-bold text-gray-900 mt-1">ANUA</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-[200px]">Heartleaf, PDRN & Rice 70 — serums, toners, masks & more.</p>
              </div>
              <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all">
                Shop ANUA <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* MEDICUBE card */}
          <Link href="/products?brand=MEDICUBE"
            className="group relative rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-purple-50 via-white to-white border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.08)_0%,_transparent_60%)]" />
            <img src="https://cdn.shopify.com/s/files/1/0733/2285/6745/files/medicube-age-r-glutathione-glow-toner-300ml-cosmetic-holic-1.webp?v=1740820367"
              alt="MEDICUBE" className="absolute right-0 bottom-0 h-full w-2/5 object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent" />
            <div className="relative z-10 p-7 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs text-purple-500 uppercase tracking-widest font-semibold">Korean Brand</span>
                <h3 className="font-heading text-3xl font-bold text-gray-900 mt-1">MEDICUBE</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-[200px]">Collagen, Glutathione & PDRN — science-backed Korean skincare.</p>
              </div>
              <div className="flex items-center gap-2 text-purple-500 font-semibold text-sm group-hover:gap-3 transition-all">
                Shop MEDICUBE <ArrowRight size={16} />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-20 bg-white">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-yellow-600 text-xs uppercase tracking-[0.25em] mb-2 font-semibold">Handpicked For You</p>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-yellow-600 hover:text-yellow-700 transition-colors text-sm font-semibold">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        <div className="sm:hidden text-center mt-8">
          <Link href="/products" className="text-yellow-600 text-sm flex items-center justify-center gap-1 font-semibold">
            View all products <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CATEGORY CARDS
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-24 bg-white">
        <div className="text-center mb-10">
          <p className="text-yellow-600 text-xs uppercase tracking-[0.25em] mb-2 font-semibold">Browse</p>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-gray-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              name: 'Skincare', slug: 'skincare',
              img: '/static/products/809b87cc44c843b194c7d2fc20192762.jpg',
              accent: 'text-blue-600', border: 'hover:border-blue-300',
              desc: 'Serums & creams',
            },
            {
              name: 'Face Care', slug: 'face-care',
              img: '/static/products/347bcbe759544db0a9f56f6500055588.jpg',
              accent: 'text-teal-600', border: 'hover:border-teal-300',
              desc: 'Cleansers & toners',
            },
            {
              name: 'Makeup', slug: 'makeup',
              img: '/static/products/3d1f8c8031d247cb90b45b844428104a.jpg',
              accent: 'text-rose-500', border: 'hover:border-rose-300',
              desc: 'Foundation & lips',
            },
            {
              name: 'Body Care', slug: 'body-care',
              img: '/static/products/136a7a12833545faac7616bfab682045.jpg',
              accent: 'text-emerald-600', border: 'hover:border-emerald-300',
              desc: 'Lotions & washes',
            },
            {
              name: 'Korean Beauty', slug: 'korean-beauty',
              img: '',
              accent: 'text-pink-500', border: 'hover:border-pink-300',
              desc: 'K-Beauty essentials',
              emoji: 'K',
            },
          ].map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}
              className={`group relative rounded-2xl overflow-hidden border border-gray-200 ${cat.border} hover:shadow-md transition-all duration-300 h-56 md:h-64`}>
              {cat.img ? (
                <img
                  src={getImageUrl(cat.img)}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-white">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-500 select-none">{cat.emoji}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-white" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <p className="font-heading font-bold text-lg text-white">{cat.name}</p>
                <p className="text-gray-300 text-xs mt-0.5">{cat.desc}</p>
                <div className={`mt-2 flex items-center gap-1 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Browse <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA BANNER
      ════════════════════════════════════════════ */}
      <section className="relative w-full border-y border-gray-200">
        <img
          src={getImageUrl('/static/products/8115a2eaf7a7456ba44f27bc8d677735.jpeg')}
          alt="Brands Galaxy Banner"
          className="w-full block"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 bg-gradient-to-t from-black/50 to-transparent pt-16">
          <Link href="/products"
            className="btn-gold px-10 py-4 rounded-xl font-semibold text-base inline-flex items-center gap-2 shadow-xl">
            Explore Full Collection <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
