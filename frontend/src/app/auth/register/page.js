'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI, getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register({ full_name: form.full_name, email: form.email, phone: form.phone || undefined, password: form.password });
      setAuth(res.data.user, res.data.access_token);
      toast.success(`Welcome to Brands Galaxy, ${res.data.user.full_name.split(' ')[0]}!`);
      router.push('/');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join Brands Galaxy for exclusive access</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Full Name</label>
              <input type="text" required value={form.full_name} onChange={set('full_name')} placeholder="Jane Doe" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Email Address</label>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+92 300 0000000" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                  placeholder="Min. 8 characters" className={`${inputCls} pr-12`} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Confirm Password</label>
              <input type={showPw ? 'text' : 'password'} required value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" className={inputCls} />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-lg font-semibold disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-yellow-600 hover:text-yellow-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
