import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const AboutSection: React.FC = () => {
  const { previewData, saveSection, updatePreview } = useApp();

  // Local form states
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [happyCustomers, setHappyCustomers] = useState('');
  const [signatureDishesList, setSignatureDishesList] = useState<string[]>([]);

  // Load flags
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when context data loads
  useEffect(() => {
    if (previewData?.about) {
      const a = previewData.about;
      setImage(a.image || '');
      setTitle(a.title || '');
      setDescription(a.description || '');
      setExperienceYears(a.experienceYears || 0);
      setHappyCustomers(a.happyCustomers || '');
      setSignatureDishesList(a.signatureDishesList ? [...a.signatureDishesList] : []);
    }
  }, [previewData?.about]);

  // Handle edit events (real-time preview synchronization)
  const handleFieldChange = (field: string, val: any) => {
    updatePreview('about', field, val);

    if (field === 'title') setTitle(val);
    if (field === 'description') setDescription(val);
    if (field === 'experienceYears') setExperienceYears(parseInt(val) || 0);
    if (field === 'happyCustomers') setHappyCustomers(val);
  };

  // Handle signature dishes rows
  const handleDishChange = (index: number, val: string) => {
    const updated = signatureDishesList.map((item, idx) => (idx === index ? val : item));
    setSignatureDishesList(updated);
    updatePreview('about', 'signatureDishesList', updated);
  };

  const addDishRow = () => {
    const updated = [...signatureDishesList, 'New Signature Dish'];
    setSignatureDishesList(updated);
    updatePreview('about', 'signatureDishesList', updated);
  };

  const removeDishRow = (index: number) => {
    const updated = signatureDishesList.filter((_, idx) => idx !== index);
    setSignatureDishesList(updated);
    updatePreview('about', 'signatureDishesList', updated);
  };

  // Upload background image
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
        updatePreview('about', 'image', res.url);
      }
    } catch (err: any) {
      setError(err.message || 'About image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  // Save changes to db
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      await saveSection('about', {
        image,
        title,
        description,
        experienceYears,
        happyCustomers,
        signatureDishesList
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save about section data.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn pb-10">
      
      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-950/20 border border-red-500/25 text-red-300 text-xs rounded-lg">{error}</div>
      )}
      
      {saveSuccess && (
        <div className="p-3 bg-green-950/20 border border-green-500/25 text-green-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          About section configuration saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* About Image Upload */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">About Section Cover Image</label>
          <div className="flex items-center gap-6 p-4 bg-[#121212] border border-zinc-800 rounded-lg">
            <div className="w-32 h-24 rounded border border-zinc-800 bg-[#161616] flex items-center justify-center overflow-hidden shrink-0">
              {image ? (
                <img src={image} alt="About Section" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-600 font-serif text-xs">No Cover Image</span>
              )}
            </div>
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="about-img-upload-input"
                />
                <label
                  htmlFor="about-img-upload-input"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg cursor-pointer flex items-center gap-1.5 w-fit transition-colors"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploading ? 'Uploading...' : 'Replace Image'}</span>
                </label>
              </div>
              <p className="text-[10px] text-zinc-500">A beautiful landscape or cooking photo. Supports PNG, JPG, or WEBP.</p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Section Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Story Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Our Story Details</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Experience Years */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Years of Experience</label>
          <input
            type="number"
            required
            value={experienceYears}
            onChange={(e) => handleFieldChange('experienceYears', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Happy Customers count */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Happy Customers Counter (Display text)</label>
          <input
            type="text"
            required
            value={happyCustomers}
            onChange={(e) => handleFieldChange('happyCustomers', e.target.value)}
            placeholder="e.g. 150k+"
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Signature Dishes Rows */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400">Signature Highlights</label>
            <button
              type="button"
              onClick={addDishRow}
              className="text-xs font-semibold text-primary hover:text-[#e5c8a0] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Highlight Item</span>
            </button>
          </div>

          <div className="space-y-3 p-4 bg-[#121212] border border-zinc-800 rounded-lg">
            {signatureDishesList.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-2">No highlight dishes listed. Click Add to create one.</p>
            ) : (
              signatureDishesList.map((dish, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    value={dish}
                    onChange={(e) => handleDishChange(idx, e.target.value)}
                    placeholder="e.g. Pan-Seared Wagyu Ribeye"
                    className="flex-1 px-4 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                  />
                  <button
                    type="button"
                    onClick={() => removeDishRow(idx)}
                    className="p-2 text-zinc-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-zinc-800">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-primary hover:bg-[#b59870] disabled:bg-primary/50 text-[#0d0d0d] font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-primary/10"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving About Data...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save About
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default AboutSection;
