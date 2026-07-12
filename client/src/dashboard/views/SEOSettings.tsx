import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Loader2, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const SEOSettings: React.FC = () => {
  const { previewData, saveSection, updatePreview } = useApp();

  // Local state
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [favicon, setFavicon] = useState('');

  // Status flags
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [isUploadingFav, setIsUploadingFav] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when context data loads
  useEffect(() => {
    if (previewData?.seo) {
      const s = previewData.seo;
      setTitle(s.title || '');
      setMetaDescription(s.metaDescription || '');
      setKeywords(s.keywords || '');
      setOgImage(s.ogImage || '');
      setFavicon(s.favicon || '');
    }
  }, [previewData?.seo]);

  // Handle edit events
  const handleFieldChange = (field: string, val: any) => {
    updatePreview('seo', field, val);

    if (field === 'title') setTitle(val);
    if (field === 'metaDescription') setMetaDescription(val);
    if (field === 'keywords') setKeywords(val);
  };

  // Upload handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'og' | 'fav') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'og') setIsUploadingOg(true);
    else setIsUploadingFav(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/admin/upload', formData);
      if (res.success) {
        if (type === 'og') {
          setOgImage(res.url);
          updatePreview('seo', 'ogImage', res.url);
        } else {
          setFavicon(res.url);
          updatePreview('seo', 'favicon', res.url);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setIsUploadingOg(false);
      setIsUploadingFav(false);
    }
  };

  // Save changes to db
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      await saveSection('seo', {
        title,
        metaDescription,
        keywords,
        ogImage,
        favicon
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save SEO meta tags.');
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
          SEO tags saved and synchronized successfully!
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Website Meta Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Meta Description</label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Meta Keywords (Comma separated list)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => handleFieldChange('keywords', e.target.value)}
            placeholder="restaurant, gourmet, michelin, reservation..."
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Open Graph share image */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Open Graph Social Image (1200x630px recommended)</label>
          <div className="flex gap-4 p-4 bg-[#121212] border border-zinc-800 rounded-lg h-[98px] items-center">
            <div className="w-16 h-12 rounded border border-zinc-800 bg-[#161616] flex items-center justify-center overflow-hidden shrink-0">
              {ogImage ? (
                <img src={ogImage} alt="OG Card" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-650 text-[9px] font-mono">No Image</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'og')}
                disabled={isUploadingOg}
                className="hidden"
                id="seo-og-upload-input"
              />
              <label
                htmlFor="seo-og-upload-input"
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
              >
                {isUploadingOg ? <Loader2 className="w-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                <span>{isUploadingOg ? 'Uploading...' : 'Upload Image'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Favicon icon */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Website Favicon Icon (.ico, .png, or .svg)</label>
          <div className="flex gap-4 p-4 bg-[#121212] border border-zinc-800 rounded-lg h-[98px] items-center">
            <div className="w-12 h-12 rounded border border-zinc-800 bg-[#161616] flex items-center justify-center overflow-hidden shrink-0">
              {favicon ? (
                <img src={favicon} alt="Favicon" className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-zinc-650 text-[9px] font-mono">No Icon</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'fav')}
                disabled={isUploadingFav}
                className="hidden"
                id="seo-fav-upload-input"
              />
              <label
                htmlFor="seo-fav-upload-input"
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
              >
                {isUploadingFav ? <Loader2 className="w-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                <span>{isUploadingFav ? 'Uploading...' : 'Upload Icon'}</span>
              </label>
            </div>
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
              Saving SEO...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save SEO settings
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default SEOSettings;
