'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/';
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ phone: '', password: '' });

  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(form.phone, form.password);
      router.push(redirect);
    } catch (err) {
      setError(err.body?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-safe">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black tracking-tight mb-0">
          {process.env.NEXT_PUBLIC_CANTEEN_NAME || 'CANTEEN'}
        </h1>
        <p className="text-[11px] font-semibold text-gray-400 tracking-wide">theCanteen.online</p>
        <p className="text-text-muted text-sm">Welcome back! Please login.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-1.5 pl-1">Phone Number</label>
          <input
            type="tel"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            placeholder="e.g., 03123456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5 pl-1">Password</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm pr-12"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors active:scale-[0.98] mt-4 flex justify-center items-center h-[52px]"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Login'}
        </button>
      </form>

      <p className="text-center mt-8 text-sm text-text-muted font-semibold">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}