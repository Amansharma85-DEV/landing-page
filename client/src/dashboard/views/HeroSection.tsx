import React, { useState, useEffect } from 'react';
import { Upload, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const HeroSection: React.FC = () => {
  const { previewData, saveSection, updatePreview } = useApp();

  // Local form states
  const [backgroundImage, setBackgroundImage] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [mainHeading, setMainHeading] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [primaryBtnText, setPrimaryBtnText] = useState('');
  const [primaryBtnLink, setPrimaryBtnLink] = useState('');
  const [secondaryBtnText, setSecondaryBtnText] = useState('');
  const [secondaryBtnLink, setSecondaryBtnLink] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [isOpenStatus, setIsOpenStatus] = useState(true);
  const [animationStyle, setAnimationStyle] = useState('fade');

  // Load flags
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when context data loads
  useEffect(() => {
    if (previewData?.hero) {
      const h = previewData.hero;
      setBackgroundImage(h.backgroundImage || '');
      setRestaurantName(h.restaurantName || '');
      setMainHeading(h.mainHeading || '');
      setSubHeading(h.subHeading || '');
      setPrimaryBtnText(h.primaryBtnText || '');
      setPrimaryBtnLink(h.primaryBtnLink || '');
      setSecondaryBtnText(h.secondaryBtnText || '');
      setSecondaryBtnLink(h.secondaryBtnLink || '');
      setBadgeText(h.badgeText || '');
      setIsOpenStatus(h.isOpenStatus !== undefined ? h.isOpenStatus : true);
      setAnimationStyle(h.animationStyle || 'fade');
    }
  }, [previewData?.hero]);

  // Handle edit events (real-time preview synchronization)
  const handleFieldChange = (field: string, val: any) => {
    updatePreview('hero', field, val);

    if (field === 'restaurantName') setRestaurantName(val);
    if (field === 'mainHeading') setMainHeading(val);
    if (field === 'subHeading') setSubHeading(val);
    if (field === 'primaryBtnText') setPrimaryBtnText(val);
    if (field === 'primaryBtnLink') setPrimaryBtnLink(val);
    if (field === 'secondaryBtnText') setSecondaryBtnText(val);
    if (field === 'secondaryBtnLink') setSecondaryBtnLink(val);
    if (field === 'badgeText') setBadgeText(val);
    if (field === 'isOpenStatus') setIsOpenStatus(val);
    if (field === 'animationStyle') setAnimationStyle(val);
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
        setBackgroundImage(res.url);
        updatePreview('hero', 'backgroundImage', res.url);
      }
    } catch (err: any) {
      setError(err.message || 'Background image upload failed.');
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
      await saveSection('hero', {
        backgroundImage,
        restaurantName,
        mainHeading,
        subHeading,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink,
        badgeText,
        isOpenStatus,
        animationStyle
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save hero section data.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn pb-10">
      
      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-950/20 border border-red-500/25 text-red-300 text-xs rounded-lg">{error}</div>
      )}
      
      {saveSuccess && (
        <div className="p-3 bg-green-950/20 border border-green-500/25 text-green-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Hero configuration saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Background Image Upload */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Hero Background Image</label>
          <div className="relative border border-zinc-800 rounded-lg overflow-hidden h-48 bg-[#121212] flex flex-col items-center justify-center p-4">
            {backgroundImage ? (
              <>
                <img src={backgroundImage} alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                  <span className="text-xs bg-black/60 px-3 py-1 rounded text-zinc-200 border border-zinc-700">Image Active</span>
                </div>
              </>
            ) : (
              <span className="text-zinc-600 text-xs font-serif">No Background Image Loaded</span>
            )}
            
            <div className="absolute bottom-4 right-4 z-20">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
                id="hero-bg-upload-input"
              />
              <label
                htmlFor="hero-bg-upload-input"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors border border-zinc-700 shadow-md"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{isUploading ? 'Uploading...' : 'Replace Background'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Restaurant Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Restaurant Name Override</label>
          <input
            type="text"
            required
            value={restaurantName}
            onChange={(e) => handleFieldChange('restaurantName', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Hero Section Badge */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Hero Section Badge (Top Pill Text)</label>
          <input
            type="text"
            value={badgeText}
            onChange={(e) => handleFieldChange('badgeText', e.target.value)}
            placeholder="e.g. ★ THREE MICHELIN STARS 2026"
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Main Heading */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Main Heading</label>
          <input
            type="text"
            required
            value={mainHeading}
            onChange={(e) => handleFieldChange('mainHeading', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Sub Heading */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Sub Heading</label>
          <textarea
            rows={2}
            value={subHeading}
            onChange={(e) => handleFieldChange('subHeading', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Primary Button details */}
        <div className="space-y-4 p-4 bg-[#121212] border border-zinc-800 rounded-lg">
          <h4 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-1.5">Primary Call-to-Action Button</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-semibold uppercase">Button Label</label>
              <input
                type="text"
                required
                value={primaryBtnText}
                onChange={(e) => handleFieldChange('primaryBtnText', e.target.value)}
                className="w-full px-3 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-semibold uppercase">Anchor Link / ID</label>
              <input
                type="text"
                required
                value={primaryBtnLink}
                onChange={(e) => handleFieldChange('primaryBtnLink', e.target.value)}
                className="w-full px-3 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Secondary Button details */}
        <div className="space-y-4 p-4 bg-[#121212] border border-zinc-800 rounded-lg">
          <h4 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-1.5">Secondary Action Button</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-semibold uppercase">Button Label</label>
              <input
                type="text"
                required
                value={secondaryBtnText}
                onChange={(e) => handleFieldChange('secondaryBtnText', e.target.value)}
                className="w-full px-3 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-semibold uppercase">Anchor Link / ID</label>
              <input
                type="text"
                required
                value={secondaryBtnLink}
                onChange={(e) => handleFieldChange('secondaryBtnLink', e.target.value)}
                className="w-full px-3 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Animation settings */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Entrance Animation Style</label>
          <select
            value={animationStyle}
            onChange={(e) => handleFieldChange('animationStyle', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none"
          >
            <option value="fade">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="zoom-in">Zoom In</option>
          </select>
        </div>

        {/* Restaurant Open status */}
        <div className="space-y-2 flex items-center justify-between border border-zinc-800 p-4 rounded-lg bg-[#121212] self-end h-[50px]">
          <label htmlFor="isOpenStatus" className="text-xs font-semibold text-zinc-400 select-none cursor-pointer">
            Restaurant Open Status Badge
          </label>
          <input
            id="isOpenStatus"
            type="checkbox"
            checked={isOpenStatus}
            onChange={(e) => handleFieldChange('isOpenStatus', e.target.checked)}
            className="w-5 h-5 rounded border-zinc-800 bg-[#161616] text-primary focus:ring-0 cursor-pointer accent-primary"
          />
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
              Saving Hero Info...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Hero
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default HeroSection;
