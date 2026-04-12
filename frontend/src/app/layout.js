import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Brands Galaxy — Luxury Cosmetics & Skincare',
  description: 'Discover premium skincare and cosmetics from the world\'s most prestigious brands.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <Navbar />

        {/* Trust Badges Bar */}
        <div className="bg-gray-950 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-6 md:gap-12 flex-wrap text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span> 100% Authentic Products
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="text-yellow-400">✓</span> Free Shipping over Rs. 5,000
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-blue-400">✓</span> Secure Payment
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <span className="text-purple-400">✓</span> Imported from Canada
            </span>
          </div>
        </div>

        <main>{children}</main>
        <footer className="border-t border-gray-800 py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p className="text-gold font-heading text-xl mb-3">BRANDS GALAXY</p>
            {/* Social Links */}
            <div className="flex items-center justify-center gap-5 mb-4">
              <a href="https://www.facebook.com/brandsgalaxy2022/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                Facebook
              </a>
              <a href="https://www.instagram.com/brandsgalaxy22/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                Instagram
              </a>
            </div>
            <p>© {new Date().getFullYear()} Brands Galaxy. All rights reserved.</p>
          </div>
        </footer>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a1a', color: '#fff', border: '1px solid #FFD700' },
          }}
        />
      </body>
    </html>
  );
}
