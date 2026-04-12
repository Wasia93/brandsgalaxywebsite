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

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/923413157159"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: '#25D366' }}
          aria-label="Chat on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
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
