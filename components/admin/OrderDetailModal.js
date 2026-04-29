import { X } from 'lucide-react';
import StatusBadge from '../customer/StatusBadge';

export default function OrderDetailModal({ isOpen, order, onClose }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900">{order.id}</h2>
            <p className="text-sm text-gray-500">Placed: {new Date(order.placedAt).toLocaleString()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Customer Info */}
          <div className="flex justify-between items-start mb-6 bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Customer</p>
              <p className="font-bold text-gray-900">{order.studentName}</p>
              <p className="text-sm text-gray-600">{order.rollNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Status</p>
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Pickup Time</p>
            <p className="font-bold text-lg text-primary">{order.pickupTime}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Order Items</p>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-500 bg-gray-100 w-6 h-6 flex items-center justify-center rounded-md text-xs">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <span className="font-semibold text-gray-600">Total Amount</span>
          <span className="text-2xl font-black text-gray-900">Rs. {order.totalAmount}</span>
        </div>

      </div>
    </div>
  );
}
