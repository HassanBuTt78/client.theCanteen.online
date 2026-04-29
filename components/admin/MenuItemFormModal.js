import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Snacks', 'Drinks', 'Meals', 'Desserts'];

export default function MenuItemFormModal({ isOpen, item, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Snacks',
    price: '',
    description: '',
    imageUrl: '',
    isAvailable: true,
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'Snacks',
        price: item.price ? item.price.toString() : '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        isAvailable: item.isAvailable ?? true,
      });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        category: 'Snacks',
        price: '',
        description: '',
        imageUrl: '',
        isAvailable: true,
      });
    }
    setErrors({});
  }, [item, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        price: Number(formData.price),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden my-auto">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">
            {item ? 'Edit Menu Item' : 'Add New Item'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Item Name *</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}
                placeholder="e.g. Chicken Biryani"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Category & Price Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (Rs.) *</label>
                <input 
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.price ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}
                  placeholder="0"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.price}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none h-20 text-sm"
                placeholder="Brief description of the item..."
              ></textarea>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
              <input 
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                placeholder="https://..."
              />
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
              <span className="text-sm font-bold text-gray-700">Available for Order</span>
            </div>

          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-orange-600 rounded-lg transition-colors shadow-sm"
            >
              {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
