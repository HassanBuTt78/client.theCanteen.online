'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const adminLogin = useAuthStore((state) => state.adminLogin);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please enter your credentials');
      return;
    }

    setLoading(true);

    try {
      await adminLogin(formData.identifier, formData.password);
      router.push('/admin');
    } catch (err) {
      setError(err.body?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E2E] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="bg-gray-50 px-8 py-10 border-b border-gray-100 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <UtensilsCrossed size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {process.env.NEXT_PUBLIC_CANTEEN_NAME || 'CANTEEN'}
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-1 tracking-wide">
            theCanteen.online
          </p>
          <p className="text-sm font-semibold text-gray-500 mt-3 uppercase tracking-widest">
            Operations Panel
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Username / Email</label>
              <input
                type="text"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-14 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}