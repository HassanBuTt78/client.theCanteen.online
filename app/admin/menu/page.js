'use client';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAdminStore } from '../../../store/adminStore';
import MenuItemRow from '../../../components/admin/MenuItemRow';
import MenuItemFormModal from '../../../components/admin/MenuItemFormModal';
import ConfirmModal from '../../../components/admin/ConfirmModal';

export default function MenuManagementPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } = useAdminStore();
  
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Snacks', 'Drinks', 'Meals', 'Desserts'];

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    item: null
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Handlers
  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSaveForm = (formData) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, formData);
    } else {
      addMenuItem(formData);
    }
    setIsFormOpen(false);
  };

  const handleDeleteClick = (item) => {
    setConfirmModal({
      isOpen: true,
      item
    });
  };

  const handleConfirmDelete = () => {
    if (confirmModal.item) {
      deleteMenuItem(confirmModal.item.id);
    }
    setConfirmModal({ isOpen: false, item: null });
  };

  const handleToggleAvailability = (item) => {
    toggleItemAvailability(item.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add Button */}
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {/* Main Content Area — Table Only */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
            <p className="text-xl font-bold text-gray-900 mb-2">No items found</p>
            <p className="text-gray-500 mb-6">There are no menu items in this category.</p>
            <button onClick={handleAddNew} className="text-primary font-bold hover:underline">Add one now</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="py-4 px-6 w-20">Image</th>
                  <th className="py-4 px-6">Item Info</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map(item => (
                  <MenuItemRow 
                    key={item.id} 
                    item={item} 
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onToggle={handleToggleAvailability}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <MenuItemFormModal 
        isOpen={isFormOpen}
        item={editingItem}
        onSave={handleSaveForm}
        onClose={() => setIsFormOpen(false)}
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Delete Item?"
        message={`Are you sure you want to delete "${confirmModal.item?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, item: null })}
      />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
