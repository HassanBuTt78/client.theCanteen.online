export default function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}
