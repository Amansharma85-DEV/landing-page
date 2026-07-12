import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Category, MenuItem } from '../../context/AppContext';
import api from '../../services/api';

const MenuManagement: React.FC = () => {
  const { previewData, refreshData } = useApp();
  const currency = previewData?.settings?.currency || '₹';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Navigation tabs: 'dishes' | 'categories'
  const [activeSubTab, setActiveSubTab] = useState<'dishes' | 'categories'>('dishes');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Dish Modal State
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishPrice, setDishPrice] = useState(0);
  const [dishCategory, setDishCategory] = useState('');
  const [dishIsVeg, setDishIsVeg] = useState(false);
  const [dishSpicyLevel, setDishSpicyLevel] = useState(0);
  const [dishIsPopular, setDishIsPopular] = useState(false);
  const [dishIsChefSpecial, setDishIsChefSpecial] = useState(false);
  const [dishIsAvailable, setDishIsAvailable] = useState(true);
  const [dishImages, setDishImages] = useState<string[]>([]);
  
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSavingDish, setIsSavingDish] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with context payload
  useEffect(() => {
    if (previewData) {
      setCategories(previewData.categories || []);
      setMenuItems(previewData.menuItems || []);
      if (previewData.categories && previewData.categories.length > 0 && !dishCategory) {
        setDishCategory(previewData.categories[0].name);
      }
    }
  }, [previewData]);

  // Open Category Add/Edit Modal
  const openCategoryModal = (cat: Category | null = null) => {
    setEditingCategory(cat);
    setCategoryName(cat ? cat.name : '');
    setError(null);
    setShowCategoryModal(true);
  };

  // Save Category (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSavingCategory(true);
    setError(null);

    try {
      let res;
      if (editingCategory) {
        res = await api.put(`/admin/categories/${editingCategory._id}`, { name: categoryName });
      } else {
        res = await api.post('/admin/categories', { name: categoryName });
      }

      if (res.success) {
        await refreshData();
        setShowCategoryModal(false);
      }
    } catch (err: any) {
      setError(err.message || 'Error saving category.');
    } finally {
      setIsSavingCategory(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Dishes in this category will remain, but their category association will need updating.')) {
      try {
        const res = await api.delete(`/admin/categories/${id}`);
        if (res.success) {
          await refreshData();
        }
      } catch (err: any) {
        alert(err.message || 'Error deleting category.');
      }
    }
  };

  // Open Dish Add/Edit Modal
  const openDishModal = (dish: MenuItem | null = null) => {
    setEditingDish(dish);
    if (dish) {
      setDishName(dish.name);
      setDishDescription(dish.description || '');
      setDishPrice(dish.price);
      setDishCategory(dish.category);
      setDishIsVeg(dish.isVeg);
      setDishSpicyLevel(dish.spicyLevel);
      setDishIsPopular(dish.isPopular);
      setDishIsChefSpecial(dish.isChefSpecial);
      setDishIsAvailable(dish.isAvailable);
      setDishImages(dish.images || []);
    } else {
      setDishName('');
      setDishDescription('');
      setDishPrice(0);
      setDishCategory(categories[0]?.name || 'Appetizers');
      setDishIsVeg(false);
      setDishSpicyLevel(0);
      setDishIsPopular(false);
      setDishIsChefSpecial(false);
      setDishIsAvailable(true);
      setDishImages([]);
    }
    setError(null);
    setShowDishModal(true);
  };

  // Handle Multi Image Upload
  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    setError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await api.post('/admin/upload-multiple', formData);
      if (res.success) {
        const newUrls = res.files.map((f: any) => f.url);
        setDishImages(prev => [...prev, ...newUrls]);
      }
    } catch (err: any) {
      setError(err.message || 'Multiple images upload failed.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  // Remove uploaded image from list
  const removeDishImage = (idx: number) => {
    setDishImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Save Dish (Create or Update)
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim() || dishPrice <= 0 || !dishCategory) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSavingDish(true);
    setError(null);

    const payload = {
      name: dishName,
      description: dishDescription,
      price: dishPrice,
      category: dishCategory,
      isVeg: dishIsVeg,
      spicyLevel: dishSpicyLevel,
      isPopular: dishIsPopular,
      isChefSpecial: dishIsChefSpecial,
      isAvailable: dishIsAvailable,
      images: dishImages
    };

    try {
      let res;
      if (editingDish) {
        res = await api.put(`/admin/menu/${editingDish._id}`, payload);
      } else {
        res = await api.post('/admin/menu', payload);
      }

      if (res.success) {
        await refreshData();
        setShowDishModal(false);
      }
    } catch (err: any) {
      setError(err.message || 'Error saving menu item.');
    } finally {
      setIsSavingDish(false);
    }
  };

  // Toggle Dish Availability instantly (fast helper)
  const toggleAvailability = async (dish: MenuItem) => {
    try {
      const res = await api.put(`/admin/menu/${dish._id}`, { isAvailable: !dish.isAvailable });
      if (res.success) {
        await refreshData();
      }
    } catch (err: any) {
      alert(err.message || 'Error toggling availability.');
    }
  };

  // Delete Dish
  const handleDeleteDish = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dish from the menu?')) {
      try {
        const res = await api.delete(`/admin/menu/${id}`);
        if (res.success) {
          await refreshData();
        }
      } catch (err: any) {
        alert(err.message || 'Error deleting menu item.');
      }
    }
  };

  // Filter dishes based on search query and category filter
  const filteredDishes = menuItems.filter(dish => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory =
      selectedCategoryFilter === 'all' || dish.category === selectedCategoryFilter;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* Sub-tab selection */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveSubTab('dishes')}
          className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
            activeSubTab === 'dishes' ? 'border-primary text-primary' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Dishes ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
            activeSubTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* DISHES SUB-TAB */}
      {activeSubTab === 'dishes' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full sm:w-auto flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-400 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => openDishModal()}
              className="px-4 py-2 bg-primary hover:bg-[#b59870] text-[#0d0d0d] font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish</span>
            </button>
          </div>

          {/* Dishes list */}
          {filteredDishes.length === 0 ? (
            <div className="text-center py-10 bg-[#0e0e0e] border border-zinc-800 rounded-xl">
              <p className="text-xs text-zinc-500">No dishes found. Add menu items or adjust filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDishes.map(dish => (
                <div
                  key={dish._id}
                  className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-4 flex gap-4 items-center justify-between"
                >
                  <div className="flex gap-4 items-center overflow-hidden">
                    <div className="w-16 h-16 rounded-lg bg-[#161616] border border-zinc-800 overflow-hidden shrink-0">
                      {dish.images && dish.images[0] ? (
                        <img src={dish.images[0]} alt={dish.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[10px]">No Pic</div>
                      )}
                    </div>
                    
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-semibold text-zinc-200 truncate">{dish.name}</h4>
                        {dish.isVeg && <span className="text-[9px] border border-green-500/30 text-green-400 px-1 py-0.2 rounded bg-green-950/20">Veg</span>}
                        {dish.isChefSpecial && <span className="text-[9px] border border-primary/30 text-primary px-1 py-0.2 rounded bg-primary/5">Special</span>}
                      </div>
                      <p className="text-[10px] text-zinc-500 font-medium">{dish.category} • <span className="text-primary">{currency}&nbsp;{dish.price}</span></p>
                      <p className="text-[10px] text-zinc-400 truncate max-w-[240px]">{dish.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Availability Button */}
                    <button
                      onClick={() => toggleAvailability(dish)}
                      className={`p-1.5 rounded border transition-colors cursor-pointer ${
                        dish.isAvailable
                          ? 'bg-green-950/30 border-green-500/20 text-green-400 hover:bg-green-900/50'
                          : 'bg-zinc-800/40 border-zinc-700/20 text-zinc-500 hover:bg-zinc-800/80'
                      }`}
                      title={dish.isAvailable ? 'Available (Click to disable)' : 'Unavailable (Click to enable)'}
                    >
                      {dish.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    
                    {/* Edit Button */}
                    <button
                      onClick={() => openDishModal(dish)}
                      className="p-1.5 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 cursor-pointer transition-colors"
                      title="Edit Dish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteDish(dish._id)}
                      className="p-1.5 hover:bg-red-950/25 border border-transparent hover:border-red-900 text-zinc-500 hover:text-red-400 rounded cursor-pointer transition-colors"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES SUB-TAB */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => openCategoryModal()}
              className="px-4 py-2 bg-primary hover:bg-[#b59870] text-[#0d0d0d] font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-10 bg-[#0e0e0e] border border-zinc-800 rounded-xl">
              <p className="text-xs text-zinc-500">No categories created yet. Click Add Category to get started.</p>
            </div>
          ) : (
            <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl divide-y divide-zinc-850">
              {categories.map((cat) => (
                <div key={cat._id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-300">{cat.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">slug: {cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCategoryModal(cat)}
                      className="p-1.5 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-1.5 hover:bg-red-950/25 border border-transparent hover:border-red-900 text-zinc-500 hover:text-red-400 rounded cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleSaveCategory} className="w-full max-w-sm glass-premium rounded-xl p-6 relative border border-primary/10">
            <button
              type="button"
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-md font-serif text-zinc-200 mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            {error && (
              <div className="mb-4 p-2.5 bg-red-950/30 border border-red-500/20 text-red-300 text-[10px] rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Entrées, Aperitifs, Desserts"
                  className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingCategory}
                className="w-full py-2 bg-primary hover:bg-[#b59870] disabled:bg-primary/50 text-[#0d0d0d] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                {isSavingCategory ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{isSavingCategory ? 'Saving...' : 'Save Category'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DISH MODAL */}
      {showDishModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <form onSubmit={handleSaveDish} className="w-full max-w-xl glass-premium rounded-xl p-6 relative border border-primary/10 my-8">
            <button
              type="button"
              onClick={() => setShowDishModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-md font-serif text-zinc-200 mb-4">
              {editingDish ? 'Edit Menu Item' : 'Create Menu Item'}
            </h3>

            {error && (
              <div className="mb-4 p-2.5 bg-red-950/30 border border-red-500/20 text-red-300 text-[10px] rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Dish Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                />
              </div>

              {/* Price & Category */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Price ({currency}) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={dishPrice}
                  onChange={(e) => setDishPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Category *</label>
                <select
                  value={dishCategory}
                  onChange={(e) => setDishCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-primary/60"
                >
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Description</label>
                <textarea
                  rows={2}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                />
              </div>

              {/* Veg and Spicy levels */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block">Spicy Level (0 - 3)</label>
                <select
                  value={dishSpicyLevel}
                  onChange={(e) => setDishSpicyLevel(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                >
                  <option value={0}>Not Spicy</option>
                  <option value={1}>Mild (Spicy 1)</option>
                  <option value={2}>Medium (Spicy 2)</option>
                  <option value={3}>Hot (Spicy 3)</option>
                </select>
              </div>

              <div className="space-y-2 flex items-center justify-between border border-zinc-850 p-2.5 rounded-lg bg-[#121212] h-[40px] mt-4">
                <label htmlFor="dishIsVeg" className="text-[10px] text-zinc-400 font-bold uppercase select-none cursor-pointer">Veg Option</label>
                <input
                  id="dishIsVeg"
                  type="checkbox"
                  checked={dishIsVeg}
                  onChange={(e) => setDishIsVeg(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 bg-[#161616] text-primary focus:ring-0 accent-primary cursor-pointer"
                />
              </div>

              {/* Toggle checklist flags */}
              <div className="sm:col-span-2 grid grid-cols-3 gap-4 border-t border-b border-zinc-850 py-3 my-2">
                <div className="flex items-center justify-between bg-[#121212]/50 p-2 rounded border border-zinc-850">
                  <label htmlFor="dishIsAvailable" className="text-[10px] text-zinc-500 font-semibold select-none cursor-pointer">Available</label>
                  <input
                    id="dishIsAvailable"
                    type="checkbox"
                    checked={dishIsAvailable}
                    onChange={(e) => setDishIsAvailable(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center justify-between bg-[#121212]/50 p-2 rounded border border-zinc-850">
                  <label htmlFor="dishIsPopular" className="text-[10px] text-zinc-500 font-semibold select-none cursor-pointer">Popular</label>
                  <input
                    id="dishIsPopular"
                    type="checkbox"
                    checked={dishIsPopular}
                    onChange={(e) => setDishIsPopular(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between bg-[#121212]/50 p-2 rounded border border-zinc-850">
                  <label htmlFor="dishIsChefSpecial" className="text-[10px] text-zinc-500 font-semibold select-none cursor-pointer">Chef Special</label>
                  <input
                    id="dishIsChefSpecial"
                    type="checkbox"
                    checked={dishIsChefSpecial}
                    onChange={(e) => setDishIsChefSpecial(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Images Manager */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block">Upload Images</label>
                <div className="grid grid-cols-4 gap-2">
                  {/* Upload Trigger */}
                  <div className="relative border border-dashed border-zinc-800 rounded-lg hover:border-primary/40 bg-[#121212] flex flex-col items-center justify-center p-2 h-16 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImagesUpload}
                      disabled={isUploadingImages}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {isUploadingImages ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-zinc-500" />
                        <span className="text-[8px] text-zinc-500 mt-1">Upload</span>
                      </>
                    )}
                  </div>

                  {/* Uploaded items listing */}
                  {dishImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative rounded-lg border border-zinc-800 bg-[#161616] overflow-hidden h-16">
                      <img src={imgUrl} alt="Dish Pic" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeDishImage(idx)}
                        className="absolute top-1 right-1 p-0.5 bg-black/70 hover:bg-black text-red-400 rounded-full cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex gap-4 border-t border-zinc-800 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setShowDishModal(false)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingDish}
                className="flex-1 py-2.5 bg-primary hover:bg-[#b59870] disabled:bg-primary/50 text-[#0d0d0d] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {isSavingDish ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{isSavingDish ? 'Saving...' : 'Save Dish'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};

export default MenuManagement;
