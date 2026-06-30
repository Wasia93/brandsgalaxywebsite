'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const { user, token, logout } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">

        {/* Logo + Brand Name */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <img
            src={getImageUrl('/static/products/f7d0690b740a4d8a8f0444de8bffe6a2.jpeg')}
            alt="Brands Galaxy"
            className="h-20 w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-yellow-600 font-bold tracking-widest text-base sm:text-lg uppercase">Brands</span>
            <span className="text-yellow-600 font-bold tracking-widest text-base sm:text-lg uppercase">Galaxy</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 flex-1 justify-center">
          <Link href="/products" className="hover:text-yellow-600 transition-colors font-medium">Shop</Link>
          <Link href="/products?is_featured=true" className="hover:text-yellow-600 transition-colors font-medium">Featured</Link>
          <Link href="/products?category=skincare" className="hover:text-yellow-600 transition-colors font-medium">Skincare</Link>
          <Link href="/products?category=makeup" className="hover:text-yellow-600 transition-colors font-medium">Makeup</Link>
          <Link href="/products?category=korean-beauty" className="hover:text-pink-500 transition-colors font-medium flex items-center gap-1">
            K-Beauty
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative p-2 text-gray-500 hover:text-yellow-600 transition-colors">
            <Heart size={20} />
            {mounted && wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-gray-500 hover:text-yellow-600 transition-colors">
            <ShoppingCart size={20} />
            {mounted && itemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {mounted && token ? (
            <div className="hidden md:flex items-center gap-2 ml-1">
              {user?.is_admin && (
                <Link href="/admin" className="text-xs bg-yellow-50 border border-yellow-300 text-yellow-700 px-2.5 py-1 rounded-full hover:bg-yellow-100 transition-colors">
                  Admin
                </Link>
              )}
              <span className="text-sm text-gray-500 max-w-[80px] truncate">
                {user?.full_name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-yellow-600 transition-colors ml-1 px-2 py-1 font-medium">
              <User size={18} />
              Login
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-2 flex flex-col text-sm text-gray-700 shadow-lg">
          <Link href="/products" onClick={() => setMenuOpen(false)} className="py-3.5 border-b border-gray-100 hover:text-yellow-600 transition-colors font-medium">Shop All</Link>
          <Link href="/products?is_featured=true" onClick={() => setMenuOpen(false)} className="py-3.5 border-b border-gray-100 hover:text-yellow-600 transition-colors font-medium">Featured</Link>
          <Link href="/products?category=skincare" onClick={() => setMenuOpen(false)} className="py-3.5 border-b border-gray-100 hover:text-yellow-600 transition-colors font-medium">Skincare</Link>
          <Link href="/products?category=makeup" onClick={() => setMenuOpen(false)} className="py-3.5 border-b border-gray-100 hover:text-yellow-600 transition-colors font-medium">Makeup</Link>
          <Link href="/products?category=korean-beauty" onClick={() => setMenuOpen(false)} className="py-3.5 border-b border-gray-100 hover:text-pink-500 transition-colors font-medium flex items-center gap-2">K-Beauty</Link>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="py-3.5 border-b border-gray-100 hover:text-red-500 transition-colors font-medium flex items-center gap-2">
            <Heart size={16} /> Wishlist {mounted && wishlistCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{wishlistCount}</span>}
          </Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="py-3.5 border-b border-gray-100 hover:text-yellow-600 transition-colors font-medium flex items-center gap-2">
            <ShoppingCart size={16} /> Cart {mounted && itemCount > 0 && <span className="bg-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>}
          </Link>
          {mounted && token ? (
            <>
              {user?.is_admin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="py-3.5 border-b border-gray-100 text-yellow-700 font-semibold flex items-center gap-2">
                  ⚙️ Admin Dashboard
                </Link>
              )}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="py-3.5 text-left text-red-500 font-medium">
                Logout ({user?.full_name?.split(' ')[0]})
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="py-3.5 hover:text-yellow-600 transition-colors font-medium">Login / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}
