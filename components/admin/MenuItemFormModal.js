import { useState, useRef } from 'react';
import { X, Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { uploadImageToImgBB } from '../../lib/imgbb';

const CATEGORIES = ['Snacks', 'Drinks', 'Meals', 'Desserts'];

function MenuItemFormInner({ item, onSave, onClose, submitting }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || 'Snacks',
    price: item?.price ? item.price.toString() : '',
    description: item?.description || '',
    imageUrl: item?.imageUrl || '',
    isAvailable: item?.isAvailable ?? true,
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageInputMode, setImageInputMode] = useState(item?.imageUrl ? 'url' : 'upload');
  const fileInputRef = useRef(null);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      setUploadError('Image size exceeds 32MB limit.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const hostedUrl = await uploadImageToImgBB(file);
      setFormData((prev) => ({ ...prev, imageUrl: hostedUrl }));
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image to imgBB');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    if (isUploading) return;
    if (validate()) {
      onSave({
        ...formData,
        price: Number(formData.price),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">
            {item ? 'Edit Menu Item' : 'Add New Item'}
          </h2>
          <button
            type="button"
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.name ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                }`}
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
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.price ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none h-20 text-sm"
                placeholder="Brief description of the item..."
              ></textarea>
            </div>

            {/* Image Upload / URL Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-gray-700">Item Image</label>
                <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                      imageInputMode === 'upload'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Upload size={12} />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                      imageInputMode === 'url'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LinkIcon size={12} />
                    URL
                  </button>
                </div>
              </div>

              {imageInputMode === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />

                  {formData.imageUrl ? (
                    <div className="relative border border-gray-200 rounded-xl p-2.5 bg-gray-50 flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Food';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md mb-1">
                          ✓ Hosted on imgBB
                        </span>
                        <p className="text-xs text-gray-500 truncate" title={formData.imageUrl}>
                          {formData.imageUrl}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isUploading
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-300 hover:border-primary/60 hover:bg-orange-50/20 bg-gray-50/50'
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center py-2 text-primary">
                          <Loader2 size={24} className="animate-spin mb-2" />
                          <p className="text-xs font-bold">Uploading to imgBB...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-1 text-gray-500">
                          <div className="w-10 h-10 rounded-full bg-orange-100/70 text-primary flex items-center justify-center mb-2">
                            <Upload size={18} />
                          </div>
                          <p className="text-xs font-bold text-gray-700">Click to upload an image</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP (hosted on imgBB)</p>
                        </div>
                      )}
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-red-500 text-xs mt-1.5 font-semibold">{uploadError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                    placeholder="https://i.ibb.co/..."
                  />
                  {formData.imageUrl && (
                    <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Food';
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 truncate flex-1">{formData.imageUrl}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
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
              disabled={isUploading || submitting}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || submitting}
              className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-orange-600 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {(isUploading || submitting) && <Loader2 size={16} className="animate-spin" />}
              {isUploading ? 'Uploading...' : submitting ? 'Saving...' : item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenuItemFormModal({ isOpen, item, onSave, onClose, submitting }) {
  if (!isOpen) return null;

  // Key by item ID (or 'new') so state resets cleanly on open/edit without setState inside useEffect
  const key = item ? item._id || item.id || 'editing' : 'new';

  return (
    <MenuItemFormInner
      key={key}
      item={item}
      onSave={onSave}
      onClose={onClose}
      submitting={submitting}
    />
  );
}
