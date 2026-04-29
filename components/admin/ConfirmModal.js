import { AlertTriangle, Info } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel', 
  onConfirm, 
  onCancel, 
  variant = 'primary' // 'primary' | 'destructive'
}) {
  if (!isOpen) return null;

  const isDestructive = variant === 'destructive';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-primary'}`}>
            {isDestructive ? <AlertTriangle size={24} /> : <Info size={24} />}
          </div>
          
          <h2 className="text-xl font-black text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm ${
              isDestructive 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-primary hover:bg-orange-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
