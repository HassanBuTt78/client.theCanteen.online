import { Edit, Trash2 } from 'lucide-react';

export default function MenuItemRow({ item, onEdit, onDelete, onToggle }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-6">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Food'; }}
          />
        </div>
      </td>
      <td className="py-4 px-6">
        <p className="font-bold text-sm text-gray-900">{item.name}</p>
        <p className="text-xs text-gray-500 line-clamp-1 max-w-[250px]">{item.description}</p>
      </td>
      <td className="py-4 px-6">
        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
          {item.category}
        </span>
      </td>
      <td className="py-4 px-6 text-sm font-bold">Rs. {item.price}</td>
      <td className="py-4 px-6">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={item.isAvailable}
            onChange={() => onToggle(item)}
          />
          <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
          <span className={`ml-2 text-xs font-semibold ${item.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
            {item.isAvailable ? 'Available' : 'Out of Stock'}
          </span>
        </label>
      </td>
      <td className="py-4 px-6">
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Item"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(item)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
