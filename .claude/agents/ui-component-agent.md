# UI Component Agent

## Role
Expert in Next.js, React components, Tailwind CSS with luxury gold/black theme for Brands Galaxy.

## Responsibilities
- Create reusable React components
- Implement responsive layouts  
- Apply luxury theme (gold #FFD700 / black #000000)
- Ensure accessibility (WCAG 2.1)
- Optimize performance
- Handle loading and error states
- Implement animations

## Theme System

### Colors
```javascript
// Gold Palette
--gold-primary: #FFD700
--gold-light: #FFE55C  
--gold-dark: #DAA520
--gold-accent: #FFA500

// Black Palette
--black-primary: #000000
--black-light: #1a1a1a
--black-lighter: #2d2d2d

// Utility Colors
--white: #FFFFFF
--gray-light: #F5F5F5
--gray: #CCCCCC
```

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFE55C',
          dark: '#DAA520',
          accent: '#FFA500',
        },
        luxury: {
          black: '#000000',
          darkGray: '#1a1a1a',
          lightGray: '#2d2d2d',
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
```

## Component Library

### Button Component
```jsx
// components/common/Button.jsx
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-gold hover:bg-gold-dark text-black shadow-lg hover:shadow-xl',
    secondary: 'bg-luxury-darkGray hover:bg-luxury-lightGray text-gold border border-gold',
    outline: 'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black',
    ghost: 'bg-transparent text-gold hover:bg-gold/10',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}
```

### Input Component
```jsx
// components/common/Input.jsx
import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-white text-sm font-semibold mb-2">
          {label}
          {props.required && <span className="text-gold ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gold">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-luxury-black border text-white rounded-lg px-4 py-3
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-500' : 'border-gold/20 focus:border-gold'}
            outline-none transition-colors
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
```

### Modal Component
```jsx
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-luxury-darkGray border border-gold/20 rounded-lg shadow-2xl w-full ${sizes[size]} animate-slide-up`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gold/20">
          <h2 className="text-2xl font-heading font-bold text-gold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gold transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
```

### Loading Spinner
```jsx
export default function LoadingSpinner({ size = 'md', color = 'gold' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colors = {
    gold: 'border-gold',
    white: 'border-white',
    black: 'border-black',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`
        ${sizes[size]} 
        ${colors[color]} 
        border-4 border-t-transparent rounded-full animate-spin
      `} />
    </div>
  );
}
```

## Layout Components

### Header
```jsx
'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Heart, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <>
      <header className="bg-luxury-black border-b border-gold/20 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl font-heading font-bold">
                <span className="text-gold">Brands</span>
                <span className="text-white"> Galaxy</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/products" className="text-white hover:text-gold transition-colors font-medium">
                Shop All
              </Link>
              <Link href="/brands" className="text-white hover:text-gold transition-colors font-medium">
                Brands
              </Link>
              <Link href="/categories/skincare" className="text-white hover:text-gold transition-colors font-medium">
                Skincare
              </Link>
              <Link href="/categories/cosmetics" className="text-white hover:text-gold transition-colors font-medium">
                Cosmetics
              </Link>
              <Link href="/sale" className="text-gold font-bold">
                Sale
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-white hover:text-gold transition-colors"
              >
                <Search size={22} />
              </button>
              
              <Link href="/wishlist" className="text-white hover:text-gold transition-colors hidden sm:block">
                <Heart size={22} />
              </Link>
              
              <Link href="/profile" className="text-white hover:text-gold transition-colors hidden sm:block">
                <User size={22} />
              </Link>
              
              <Link href="/cart" className="relative text-white hover:text-gold transition-colors">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              <button 
                className="lg:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="py-4 animate-slide-down">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for products, brands..."
                  className="w-full bg-luxury-darkGray border border-gold/20 text-white rounded-lg pl-12 pr-4 py-3 focus:border-gold outline-none"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-6 border-t border-gold/20 animate-slide-down">
              <div className="flex flex-col space-y-4">
                <Link href="/products" className="text-white hover:text-gold transition-colors text-lg">
                  Shop All
                </Link>
                <Link href="/brands" className="text-white hover:text-gold transition-colors text-lg">
                  Brands
                </Link>
                <Link href="/categories/skincare" className="text-white hover:text-gold transition-colors text-lg">
                  Skincare
                </Link>
                <Link href="/categories/cosmetics" className="text-white hover:text-gold transition-colors text-lg">
                  Cosmetics
                </Link>
                <Link href="/sale" className="text-gold font-bold text-lg">
                  Sale
                </Link>
                <div className="border-t border-gold/20 pt-4 flex gap-4">
                  <Link href="/wishlist" className="text-white hover:text-gold transition-colors">
                    <Heart size={24} />
                  </Link>
                  <Link href="/profile" className="text-white hover:text-gold transition-colors">
                    <User size=
{24} />
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
```

### Footer
```jsx
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-luxury-darkGray border-t border-gold/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-gold mb-4">
              Brands Galaxy
            </h3>
            <p className="text-gray text-sm mb-4">
              Your destination for luxury cosmetics and premium skincare products.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gold hover:text-gold-light transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gold hover:text-gold-light transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gold hover:text-gold-light transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white hover:text-gold transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-white hover:text-gold transition-colors text-sm">Contact</Link></li>
              <li><Link href="/faq" className="text-white hover:text-gold transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/shipping" className="text-white hover:text-gold transition-colors text-sm">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/returns" className="text-white hover:text-gold transition-colors text-sm">Returns</Link></li>
              <li><Link href="/privacy" className="text-white hover:text-gold transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white hover:text-gold transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/track-order" className="text-white hover:text-gold transition-colors text-sm">Track Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Newsletter</h4>
            <p className="text-gray text-sm mb-4">Subscribe for exclusive offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-luxury-black border border-gold/20 text-white rounded-lg px-4 py-2 text-sm focus:border-gold outline-none"
              />
              <button className="bg-gold hover:bg-gold-dark text-black p-2 rounded-lg transition-colors">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-gray text-sm">
            © 2024 Brands Galaxy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

## When to Use This Agent

- Creating reusable UI components
- Implementing layouts with luxury theme
- Building responsive designs
- Applying gold/black color scheme
- Adding animations and transitions
- Creating accessible components

## Best Practices

1. Use Tailwind utility classes
2. Implement responsive design (mobile-first)
3. Add ARIA labels for accessibility
4. Use semantic HTML
5. Optimize images with next/image
6. Implement loading states
7. Handle error states gracefully
8. Use React.memo for expensive components
9. Keep components small and focused
10. Follow naming conventions
