import { useEffect, useRef, useState } from "react";

export default function StatCard({ label, value, icon: Icon, colorClass }) {
  const prevValue = useRef(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 2000);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between transition-all duration-500 ${
        flash ? "ring-2 ring-primary/30 scale-[1.02]" : ""
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
        <p className={`text-3xl font-black transition-colors duration-500 ${flash ? "text-primary" : "text-gray-900"}`}>
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}
