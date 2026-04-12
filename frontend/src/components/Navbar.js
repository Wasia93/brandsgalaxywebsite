'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store';
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
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">

        {/* Logo + Brand Name */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <img
            src="http://localhost:8000/static/products/f7d0690b740a4d8a8f0444de8bffe6a2.jpeg"
            alt="Brands Galaxy"
            className="h-20 w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-gold  font-bold tracking-widest text-lg uppercase">Brands</span>
            <span className="text-gold font-bold tracking-widest text-lg uppercase">Galaxy</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300 flex-1 justify-center">
          <Link href="/products" className="hover:text-yellow-400 transition-colors">Shop</Link>
          <Link href="/products?is_featured=true" className="hover:text-yellow-400 transition-colors">Featured</Link>
          <Link href="/products?category=skincare" className="hover:text-yellow-400 transition-colors">Skincare</Link>
          <Link href="/products?category=makeup" className="hover:text-yellow-400 transition-colors">Makeup</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative p-2 text-gray-300 hover:text-yellow-400 transition-colors">
            <Heart size={20} />
            {mounted && wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-gray-300 hover:text-yellow-400 transition-colors">
            <ShoppingCart size={20} />
            {mounted && itemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-yellow-400 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {mounted && token ? (
            <div className="hidden md:flex items-center gap-2 ml-1">
              {user?.is_admin && (
                <Link href="/admin" className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2.5 py-1 rounded-full hover:bg-yellow-500/20 transition-colors">
                  Admin
                </Link>
              )}
              <span className="text-sm text-gray-400 max-w-[80px] truncate">
                {user?.full_name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors ml-1 px-2 py-1">
              <User size={18} />
              Login
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black px-4 py-4 flex flex-col gap-4 text-sm text-gray-300">
          <Link href="/products" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Shop All</Link>
          <Link href="/products?is_featured=true" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Featured</Link>
          <Link href="/products?category=skincare" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Skincare</Link>
          <Link href="/products?category=makeup" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Makeup</Link>
          {token ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left text-red-400">
              Logout
            </button>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Login / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}
