import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X, Loader2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Chef } from '../../context/AppContext';
import api from '../../services/api';

const ChefSection: React.FC = () => {
  const { previewData, refreshData } = useApp();
  const [chefs, setChefs] = useState<Chef[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingChef, setEditingChef] = useState<Chef | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (previewData?.chefs) {
      setChefs(previewData.chefs);
    }
  }, [previewData?.chefs]);

  const openModal = (c: Chef | null = null) => {
    setEditingChef(c);
    if (c) {
      setName(c.name);
      setPosition(c.position);
      setDescription(c.description || '');
      setImage(c.image || '');
      setInstagram(c.socialLinks?.instagram || '');
      setFacebook(c.socialLinks?.facebook || '');
    } else {
      setName('');
      setPosition('Sous Chef');
      setDescription('');
      setImage('');
      setInstagram('');
      setFacebook('');
    }
    setError(null);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/admin/upload', formData);
      if (res.success) {
        setImage(res.url);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload = {
      name,
      position,
      description,
      image,
      socialLinks: { instagram, facebook, twitter: '' }
    };

    try {
      let res;
      if (editingChef) {
        res = await api.put(`/admin/chefs/${editingChef._id}`, payload);
      } else {
        res = await api.post('/admin/chefs', payload);
      }

      if (res.success) {
        await refreshData();
        setShowModal(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save chef details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this chef?')) {
      try {
        const res = await api.delete(`/admin/chefs/${id}`);
        if (res.success) {
          await refreshData();
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete chef.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex justify-end">
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-primary hover:bg-[#b59870] text-[#0d0d0d] font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chef Profile</span>
        </button>
      </div>

      {chefs.length === 0 ? (
        <div className="text-center py-10 bg-[#0e0e0e] border border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-500">No chefs listed. Click Add Chef Profile to list one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chefs.map(chef => (
            <div
              key={chef._id}
              className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-5 flex gap-4 items-center justify-between"
            >
              <div className="flex gap-4 items-center overflow-hidden">
                <div className="w-20 h-20 rounded-lg bg-[#161616] border border-zinc-800 overflow-hidden shrink-0">
                  {chef.image ? (
                    <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Photo</div>
                  )}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-xs font-semibold text-zinc-200 truncate">{chef.name}</h4>
                  <p className="text-[10px] text-primary font-medium uppercase tracking-wider">{chef.position}</p>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 max-w-[280px]">{chef.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openModal(chef)}
                  className="p-1.5 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 cursor-pointer transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(chef._id)}
                  className="p-1.5 hover:bg-red-950/25 border border-transparent hover:border-red-900 text-zinc-500 hover:text-red-400 rounded cursor-pointer transition-colors"
                  title="Delete Profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHEF MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleSave} className="w-full max-w-md glass-premium rounded-xl p-6 relative border border-primary/10">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-md font-serif text-zinc-200 mb-4">
              {editingChef ? 'Edit Chef Profile' : 'Add Chef Profile'}
            </h3>

            {error && (
              <div className="mb-4 p-2.5 bg-red-950/30 border border-red-500/20 text-red-300 text-[10px] rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Photo Upload */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Chef Photo</label>
                <div className="flex items-center gap-4 p-3 bg-[#121212] border border-zinc-800 rounded-lg">
                  <div className="w-12 h-12 rounded-lg border border-zinc-800 bg-[#161616] flex items-center justify-center overflow-hidden shrink-0">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] text-zinc-650 font-serif">No Photo</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="chef-photo-input"
                    />
                    <label
                      htmlFor="chef-photo-input"
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      {isUploading ? <Loader2 className="w-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Chef Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Chef Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              {/* Position */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Position / Role *</label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Executive Chef, Sous Chef"
                  className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              {/* Summary Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Bio / Summary Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Instagram Profile</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@chef_name"
                    className="w-full px-3 py-1.5 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Facebook Profile</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="chef.name"
                    className="w-full px-3 py-1.5 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 bg-primary hover:bg-[#b59870] disabled:bg-primary/50 text-[#0d0d0d] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Saving...' : 'Save Chef'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ChefSection;
