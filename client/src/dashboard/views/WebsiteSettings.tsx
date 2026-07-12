import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const WebsiteSettings: React.FC = () => {
  const { previewData, saveSection, updatePreview } = useApp();
  
  // Local state initialized with context data
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [googleReviewRating, setGoogleReviewRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(1200);
  const [priceRange, setPriceRange] = useState('$$$$');
  const [currency, setCurrency] = useState('₹');
  const [workingHours, setWorkingHours] = useState<{ day: string; hours: string }[]>([]);

  // Status flags
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when context data loads
  useEffect(() => {
    if (previewData?.settings) {
      const s = previewData.settings;
      setName(s.name || '');
      setLogo(s.logo || '');
      setTagline(s.tagline || '');
      setDescription(s.description || '');
      setAddress(s.address || '');
      setPhone(s.phone || '');
      setWhatsapp(s.whatsapp || '');
      setEmail(s.email || '');
      setGoogleMapsLink(s.googleMapsLink || '');
      setGoogleReviewRating(s.googleReviewRating || 4.9);
      setTotalReviews(s.totalReviews || 1200);
      setPriceRange(s.priceRange || '$$$$');
      setCurrency(s.currency || '₹');
      setWorkingHours(s.workingHours ? [...s.workingHours] : []);
    }
  }, [previewData?.settings]);

  // Handle text field edits (updates preview in real-time)
  const handleFieldChange = (field: string, val: any) => {
    updatePreview('settings', field, val);
    
    // Also sync local input state
    if (field === 'name') setName(val);
    if (field === 'tagline') setTagline(val);
    if (field === 'description') setDescription(val);
    if (field === 'address') setAddress(val);
    if (field === 'phone') setPhone(val);
    if (field === 'whatsapp') setWhatsapp(val);
    if (field === 'email') setEmail(val);
    if (field === 'googleMapsLink') setGoogleMapsLink(val);
    if (field === 'googleReviewRating') setGoogleReviewRating(parseFloat(val) || 0);
    if (field === 'totalReviews') setTotalReviews(parseInt(val) || 0);
    if (field === 'priceRange') setPriceRange(val);
    if (field === 'currency') setCurrency(val);
  };

  // Handle Working Hours Row Changes
  const handleHoursChange = (index: number, key: 'day' | 'hours', val: string) => {
    const updated = workingHours.map((item, idx) => {
      if (idx === index) {
        return { ...item, [key]: val };
      }
      return item;
    });
    setWorkingHours(updated);
    updatePreview('settings', 'workingHours', updated);
  };

  const addHoursRow = () => {
    const updated = [...workingHours, { day: 'New Day Range', hours: '9:00 AM - 10:00 PM' }];
    setWorkingHours(updated);
    updatePreview('settings', 'workingHours', updated);
  };

  const removeHoursRow = (index: number) => {
    const updated = workingHours.filter((_, idx) => idx !== index);
    setWorkingHours(updated);
    updatePreview('settings', 'workingHours', updated);
  };

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/admin/upload', formData);
      if (res.success) {
        setLogo(res.url);
        updatePreview('settings', 'logo', res.url);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  // Save Settings to MongoDB
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      await saveSection('settings', {
        name,
        logo,
        tagline,
        description,
        address,
        phone,
        whatsapp,
        email,
        googleMapsLink,
        googleReviewRating,
        totalReviews,
        priceRange,
        currency,
        workingHours
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings.');
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
          Settings saved and synchronized successfully!
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Restaurant Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Restaurant Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Tagline / Motto</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => handleFieldChange('tagline', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Restaurant Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Restaurant Logo</label>
          <div className="flex items-center gap-4 p-4 bg-[#121212] border border-zinc-800 rounded-lg">
            <div className="w-16 h-16 rounded border border-zinc-800 bg-[#161616] flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-zinc-600 font-serif text-sm">No Image</span>
              )}
            </div>
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="logo-upload-input"
                />
                <label
                  htmlFor="logo-upload-input"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg cursor-pointer flex items-center gap-1.5 w-fit transition-colors"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploading ? 'Uploading...' : 'Upload Logo'}</span>
                </label>
              </div>
              <p className="text-[10px] text-zinc-500">Supports PNG, JPG, or SVG. Maximum file size 5MB.</p>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Phone Number (Display)</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">WhatsApp Number (International Format)</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
            placeholder="+15551234567"
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Price Range & Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => handleFieldChange('priceRange', e.target.value)}
              className="w-full px-3 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-primary/60"
            >
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
              <option value="$$$$">$$$$</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Currency Symbol</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => handleFieldChange('currency', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>

        {/* Google Reviews rating and total counts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Google Rating (0-5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={googleReviewRating}
              onChange={(e) => handleFieldChange('googleReviewRating', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">Total Reviews Count</label>
            <input
              type="number"
              value={totalReviews}
              onChange={(e) => handleFieldChange('totalReviews', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>

        {/* Google Maps embeds */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Google Maps Embed Link (src attribute)</label>
          <input
            type="text"
            value={googleMapsLink}
            onChange={(e) => handleFieldChange('googleMapsLink', e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-400">Physical Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Working Hours Rows */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400">Working Hours</label>
            <button
              type="button"
              onClick={addHoursRow}
              className="text-xs font-semibold text-primary hover:text-[#e5c8a0] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hours Row</span>
            </button>
          </div>

          <div className="space-y-3 p-4 bg-[#121212] border border-zinc-800 rounded-lg">
            {workingHours.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-2">No working hours specified. Click Add to create one.</p>
            ) : (
              workingHours.map((row, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    value={row.day}
                    onChange={(e) => handleHoursChange(idx, 'day', e.target.value)}
                    placeholder="e.g., Monday - Friday"
                    className="flex-1 px-4 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                  />
                  <input
                    type="text"
                    required
                    value={row.hours}
                    onChange={(e) => handleHoursChange(idx, 'hours', e.target.value)}
                    placeholder="e.g., 5:00 PM - 11:00 PM"
                    className="flex-1 px-4 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                  />
                  <button
                    type="button"
                    onClick={() => removeHoursRow(idx)}
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
              Saving Settings...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default WebsiteSettings;
