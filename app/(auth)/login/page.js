'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ identifier: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Simulate auth
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    }, 800);
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
          <label className="block text-sm font-bold mb-1.5 pl-1">Email / Roll Number</label>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            placeholder="e.g., ali@uni.edu.pk or 084569"
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5 pl-1">Password</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
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
