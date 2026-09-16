import StatusBadge from '../customer/StatusBadge';

export default function OrderRow({ order, onActionClick, onRowClick }) {
  const getActionButtons = () => {
    switch (order.status) {
      case 'Pending':
        return (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onActionClick(order, 'Confirmed', 'Confirm Order?')}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded"
            >
              Confirm
            </button>
            <button 
              onClick={() => onActionClick(order, 'Cancelled', 'Cancel Order? This cannot be undone.', 'destructive')}
              className="px-3 py-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded"
            >
              Cancel
            </button>
          </div>
        );
      case 'Confirmed':
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onActionClick(order, 'Preparing', 'Start Preparing?')}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded"
            >
              Start Prep
            </button>
          </div>
        );
      case 'Preparing':
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onActionClick(order, 'Ready for Pickup', 'Mark Ready for Pickup?')}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded"
            >
              Mark Ready
            </button>
          </div>
        );
      case 'Ready for Pickup':
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onActionClick(order, 'Completed', 'Mark as Completed?')}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded"
            >
              Complete
            </button>
          </div>
        );
      default:
        return <span className="text-gray-400 text-xs font-medium">—</span>;
    }
  };

  return (
    <tr 
      onClick={() => onRowClick(order)}
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="py-4 px-6 font-mono text-sm font-semibold">{order._id}</td>
      <td className="py-4 px-6">
        <p className="font-bold text-sm text-gray-900">{order.studentName}</p>
        <p className="text-xs text-gray-500">{order.rollNumber}</p>
      </td>
      <td className="py-4 px-6 text-sm text-gray-600">
        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
      </td>
      <td className="py-4 px-6 text-sm font-bold">Rs. {order.totalAmount}</td>
      <td className="py-4 px-6 text-sm font-medium text-gray-700">{order.pickupTime}</td>
      <td className="py-4 px-6">
        <StatusBadge status={order.status} />
      </td>
      <td className="py-4 px-6">
        {getActionButtons()}
      </td>
    </tr>
  );
}
