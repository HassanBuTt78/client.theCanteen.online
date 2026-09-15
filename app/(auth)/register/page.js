"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", phone: "", password: "", confirm: "" });

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password || !form.confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(form.name, form.phone, form.password);
      router.push("/login");
    } catch (err) {
      setError(err.body?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 my-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black tracking-tight mb-0">
          {process.env.NEXT_PUBLIC_CANTEEN_NAME || "CANTEEN"}
        </h1>
        <p className="text-[11px] font-semibold text-gray-400 tracking-wide">theCanteen.online</p>
        <p className="text-text-muted text-sm">Create a new account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-1.5 pl-1">Full Name</label>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5 pl-1">Phone Number</label>
          <input
            type="tel"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            placeholder="e.g., 03123456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5 pl-1">Password</label>
          <input
            type="password"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1.5 pl-1">Confirm Password</label>
          <input
            type="password"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors active:scale-[0.98] mt-4 flex justify-center items-center h-[52px]"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
        </button>
      </form>

      <p className="text-center mt-8 text-sm text-text-muted font-semibold">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
