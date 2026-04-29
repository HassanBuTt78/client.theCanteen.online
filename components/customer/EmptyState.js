import { Search } from 'lucide-react';

export default function EmptyState({ icon: Icon = Search, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Icon size={48} className="text-text-muted opacity-50" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {subtitle && <p className="text-text-muted text-sm mb-6 max-w-[250px]">{subtitle}</p>}
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-md active:scale-95 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
