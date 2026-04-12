'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Truck, Star, Sparkles, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productsAPI } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Fixed hero collage cards — update slot 5 & 6 when Clinique/La Roche added
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
  { tag: 'Skincare Essentials', title: 'Glow From', accent: 'Within.', sub: 'Science-backed skincare with Ceramides, Hyaluronic Acid & Retinol.', href: '/products?category=skincare', cta: 'Shop Skincare' },
  { tag: 'Makeup Collection', title: 'Bold &', accent: 'Beautiful.', sub: 'Charlotte Tilbury, Tarte, Huda Beauty — iconic looks delivered to you.', href: '/products?category=makeup', cta: 'Shop Makeup' },
];

/* ── Premium Gradient Hero ── */
function PremiumHero({ products }) {
  const [idx, setIdx] = useState(0);
  const withImages = products.filter(p => p.images?.length > 0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HEADLINES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const h = HEADLINES[idx];

  // pick 6 products with images for collage
  const col1 = withImages.filter((_, i) => i % 3 === 0).slice(0, 3);
  const col2 = withImages.filter((_, i) => i % 3 === 1).slice(0, 3);
  const col3 = withImages.filter((_, i) => i % 3 === 2).slice(0, 2);

  return (
    <section className="relative min-h-[92vh] bg-black overflow-hidden flex items-center">

      {/* Background — pure CSS, zero pixelation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,_rgba(218,165,32,0.10)_0%,_transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_80%_30%,_rgba(255,215,0,0.06)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_60%_80%,_rgba(218,165,32,0.05)_0%,_transparent_55%)]" />
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,215,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* ── LEFT: Text ── */}
          <div>
            {/* tag */}
            <div key={idx + 'tag'} className="animate-[fadeSlideUp_0.5s_ease_forwards]">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-yellow-400 font-medium mb-5 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5">
                <Sparkles size={11} /> {h.tag}
              </span>
            </div>

            {/* headline */}
            <div key={idx + 'title'} className="animate-[fadeSlideUp_0.55s_ease_forwards]">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.06] mb-5 tracking-tight">
                <span className="text-white block">{h.title}</span>
                <span className="gold-gradient block">{h.accent}</span>
              </h1>
            </div>

            <div key={idx + 'sub'} className="animate-[fadeSlideUp_0.6s_ease_forwards]">
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md">{h.sub}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link href={h.href}
                className="btn-gold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20">
                {h.cta} <ArrowRight size={18} />
              </Link>
              <Link href="/products"
                className="border border-gray-700 text-gray-300 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-center hover:border-yellow-500/40 hover:text-yellow-400 transition-all">
                View All
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-4 sm:gap-8 pt-6 border-t border-gray-800/60">
              {[['100+','Products'],['6','Brands'],['100%','Authentic']].map(([v,l]) => (
                <div key={l} className="text-center">
                  <p className="font-heading text-xl sm:text-3xl font-bold text-yellow-400">{v}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-8">
              {HEADLINES.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === idx ? 'w-7 h-2 bg-yellow-400' : 'w-2 h-2 bg-gray-700 hover:bg-gray-500'}`} />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Image Collage (6 cards, 3 cols x 2 rows) ── */}
          <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-3 h-[460px]">
            {HERO_COLLAGE.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`}
                className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-yellow-500/40 transition-all group">
                <img src={`${API_URL}${p.img}`} alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
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
    <div className="overflow-x-hidden">

      {/* ════════════════════════════════════════════
          HERO — Premium Gradient + Product Collage
      ════════════════════════════════════════════ */}
      <PremiumHero products={allProds} />

      {/* ════════════════════════════════════════════
          TRUST BAR
      ════════════════════════════════════════════ */}
      <section className="border-y border-gray-800/60 py-6 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: <Truck size={22} className="text-yellow-400" />, title: 'Free Shipping', desc: 'Orders over Rs. 5,000' },
            { icon: <Shield size={22} className="text-yellow-400" />, title: '100% Authentic', desc: 'Every product verified' },
            { icon: <Star size={22} className="text-yellow-400 fill-yellow-400" />, title: 'Top Brands', desc: "MAC · CeraVe · L'Oreal" },
          ].map((p) => (
            <div key={p.title} className="flex flex-col items-center gap-1.5">
              {p.icon}
              <p className="font-semibold text-white text-sm">{p.title}</p>
              <p className="text-gray-500 text-xs hidden sm:block">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SKINCARE EDITORIAL BANNER
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Skincare card */}
          <Link href="/products?category=skincare"
            className="group relative rounded-3xl overflow-hidden h-52 sm:h-64 md:h-72 bg-gradient-to-br from-blue-950 via-gray-900 to-black border border-blue-900/30 hover:border-blue-500/40 transition-all duration-500">
            {/* bg glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.15)_0%,_transparent_60%)]" />
            {/* product image */}
            {bannerA?.images?.[0] && (
              <img src={`${API_URL}${bannerA.images[0]}`} alt="Skincare"
                className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.target.style.display = 'none'; }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-transparent" />
            <div className="relative z-10 p-5 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs text-blue-400 uppercase tracking-widest font-medium">Science-Backed</span>
                <h3 className="font-heading text-xl sm:text-3xl font-bold text-white mt-2 leading-tight">
                  Skincare<br />That Works
                </h3>
                <p className="text-gray-400 text-sm mt-3 max-w-[200px]">
                  Ceramides, Hyaluronic Acid & Retinol for visibly healthier skin.
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                Shop Skincare <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Face Care / Makeup card */}
          <Link href="/products?category=makeup"
            className="group relative rounded-3xl overflow-hidden h-52 sm:h-64 md:h-72 bg-gradient-to-br from-rose-950 via-gray-900 to-black border border-rose-900/30 hover:border-rose-500/40 transition-all duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(244,63,94,0.15)_0%,_transparent_60%)]" />
            <img src={`${API_URL}/static/products/92004adc288247caab3af2b91694191b.webp`} alt="MAC Foundation"
              className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-transparent" />
            <div className="relative z-10 p-5 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs text-rose-400 uppercase tracking-widest font-medium">Bold & Beautiful</span>
                <h3 className="font-heading text-xl sm:text-3xl font-bold text-white mt-2 leading-tight">
                  Makeup<br />Collection
                </h3>
                <p className="text-gray-400 text-sm mt-3 max-w-[200px]">
                  MAC, L'Oreal & more — from foundation to the perfect lip color.
                </p>
              </div>
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm group-hover:gap-3 transition-all">
                Shop Makeup <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-yellow-400 text-xs uppercase tracking-[0.25em] mb-2">Handpicked For You</p>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold">Featured Products</h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        <div className="sm:hidden text-center mt-8">
          <Link href="/products" className="text-yellow-400 text-sm flex items-center justify-center gap-1">
            View all products <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CATEGORY CARDS (visual gradient style)
      ════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <p className="text-yellow-400 text-xs uppercase tracking-[0.25em] mb-2">Browse</p>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              name: 'Skincare', slug: 'skincare',
              img: '/static/products/809b87cc44c843b194c7d2fc20192762.jpg',
              accent: 'text-blue-300', border: 'hover:border-blue-400/50',
              desc: 'Serums & creams',
            },
            {
              name: 'Face Care', slug: 'face-care',
              img: '/static/products/347bcbe759544db0a9f56f6500055588.jpg',
              accent: 'text-teal-300', border: 'hover:border-teal-400/50',
              desc: 'Cleansers & toners',
            },
            {
              name: 'Makeup', slug: 'makeup',
              img: '/static/products/3d1f8c8031d247cb90b45b844428104a.jpg',
              accent: 'text-rose-300', border: 'hover:border-rose-400/50',
              desc: 'Foundation & lips',
            },
            {
              name: 'Body Care', slug: 'body-care',
              img: '/static/products/136a7a12833545faac7616bfab682045.jpg',
              accent: 'text-emerald-300', border: 'hover:border-emerald-400/50',
              desc: 'Lotions & washes',
            },
          ].map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}
              className={`group relative rounded-2xl overflow-hidden border border-gray-800 ${cat.border} transition-all duration-300 h-56 md:h-64`}>
              {/* category image */}
              <img
                src={`${API_URL}${cat.img}`}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
              {/* hover colour tint */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white" />
              {/* text */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <p className={`font-heading font-bold text-lg text-white group-hover:${cat.accent} transition-colors`}>{cat.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{cat.desc}</p>
                <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Browse <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM FULL-WIDTH CTA BANNER
      ════════════════════════════════════════════ */}
      <section className="relative w-full border-y border-yellow-800/20">
        {/* Full picture — no crop */}
        <img
          src={`${API_URL}/static/products/8115a2eaf7a7456ba44f27bc8d677735.jpeg`}
          alt="Brands Galaxy Banner"
          className="w-full block"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {/* Button overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 bg-gradient-to-t from-black/60 to-transparent pt-16">
          <Link href="/products"
            className="btn-gold px-10 py-4 rounded-xl font-semibold text-base inline-flex items-center gap-2 shadow-xl shadow-yellow-500/20">
            Explore Full Collection <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
