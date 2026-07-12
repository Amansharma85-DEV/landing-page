import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X, Loader2, Check, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Offer } from '../../context/AppContext';
import api from '../../services/api';

const OffersManagement: React.FC = () => {
  const { previewData, refreshData } = useApp();
  const [offers, setOffers] = useState<Offer[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (previewData?.offers) {
      setOffers(previewData.offers);
    }
  }, [previewData?.offers]);

  const openModal = (o: Offer | null = null) => {
    setEditingOffer(o);
    if (o) {
      setTitle(o.title);
      setDiscountText(o.discountText);
      setCouponCode(o.couponCode || '');
      setDescription(o.description || '');
      setImage(o.image || '');
      setStartDate(o.startDate ? new Date(o.startDate).toISOString().split('T')[0] : '');
      setEndDate(o.endDate ? new Date(o.endDate).toISOString().split('T')[0] : '');
      setIsActive(o.isActive !== undefined ? o.isActive : true);
    } else {
      setTitle('Exclusive Offer');
      setDiscountText('15% OFF');
      setCouponCode('');
      setDescription('');
      setImage('');
      setStartDate('');
      setEndDate('');
      setIsActive(true);
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
      setError(err.message || 'Failed to upload banner.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !discountText.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload = {
      title,
      discountText,
      couponCode,
      description,
      image,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      isActive
    };

    try {
      let res;
      if (editingOffer) {
        res = await api.put(`/admin/offers/${editingOffer._id}`, payload);
      } else {
        res = await api.post('/admin/offers', payload);
      }

      if (res.success) {
        await refreshData();
        setShowModal(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save offer details.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleOfferActive = async (offer: Offer) => {
    try {
      const res = await api.put(`/admin/offers/${offer._id}`, { isActive: !offer.isActive });
      if (res.success) {
        await refreshData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle offer status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        const res = await api.delete(`/admin/offers/${id}`);
        if (res.success) {
          await refreshData();
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete offer.');
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
          <span>Create Offer</span>
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-10 bg-[#0e0e0e] border border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-500">No offers configured yet. Click Create Offer to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map(offer => (
            <div
              key={offer._id}
              className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                    offer.isActive
                      ? 'bg-green-950/55 text-green-400 border border-green-500/10'
                      : 'bg-zinc-800/40 text-zinc-500 border border-zinc-700/20'
                  }`}>
                    {offer.isActive ? 'Active' : 'Disabled'}
                  </span>
                  
                  {offer.couponCode && (
                    <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {offer.couponCode}
                    </span>
                  )}
                </div>

                <div className="flex gap-4 items-center mb-4">
                  <div className="w-20 h-16 rounded border border-zinc-800 bg-[#161616] overflow-hidden shrink-0">
                    {offer.image ? (
                      <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[10px]">No Banner</div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-zinc-200">{offer.title}</h4>
                    <p className="text-sm font-bold text-primary">{offer.discountText}</p>
                    <p className="text-[10px] text-zinc-400 line-clamp-1">{offer.description}</p>
                  </div>
                </div>

                {offer.startDate && offer.endDate && (
                  <p className="text-[10px] text-zinc-500">
                    Campaign: {new Date(offer.startDate).toLocaleDateString()} to {new Date(offer.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-zinc-850 pt-4 mt-5">
                <button
                  onClick={() => toggleOfferActive(offer)}
                  className={`px-3 py-1 text-[10px] font-medium rounded-lg cursor-pointer transition-colors ${
                    offer.isActive
                      ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      : 'bg-green-950/45 text-green-400 hover:bg-green-900/40 border border-green-500/10'
                  }`}
                >
                  {offer.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => openModal(offer)}
                  className="p-1.5 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="p-1.5 hover:bg-red-950/25 border border-transparent hover:border-red-900 text-zinc-500 hover:text-red-400 rounded cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OFFERS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <form onSubmit={handleSave} className="w-full max-w-md glass-premium rounded-xl p-6 relative border border-primary/10 my-8">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-md font-serif text-zinc-200 mb-4">
              {editingOffer ? 'Edit Offer Configuration' : 'Create Special Offer'}
            </h3>

            {error && (
              <div className="mb-4 p-2.5 bg-red-950/30 border border-red-500/20 text-red-300 text-[10px] rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Offer Banner Image</label>
                <div className="flex items-center gap-4 p-3 bg-[#121212] border border-zinc-800 rounded-lg">
                  <div className="w-20 h-12 rounded border border-zinc-800 bg-[#161616] flex items-center justify-center overflow-hidden shrink-0">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] text-zinc-600 font-serif">No Image</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="offer-banner-input"
                    />
                    <label
                      htmlFor="offer-banner-input"
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      {isUploading ? <Loader2 className="w-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      <span>{isUploading ? 'Uploading...' : 'Upload Banner'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Title & Discount Text */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Discount Text *</label>
                  <input
                    type="text"
                    required
                    value={discountText}
                    onChange={(e) => setDiscountText(e.target.value)}
                    placeholder="e.g. 20% OFF, Buy 1 Get 1"
                    className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Coupon Code</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. DISCOUNT20"
                    className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Campaign Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between border border-zinc-850 p-2.5 rounded-lg bg-[#121212]">
                <label htmlFor="offerIsActive" className="text-[10px] text-zinc-400 font-bold uppercase select-none cursor-pointer">Activate Offer Campaign</label>
                <input
                  id="offerIsActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 bg-[#161616] text-primary focus:ring-0 accent-primary cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 bg-primary hover:bg-[#b59870] disabled:bg-primary/50 text-[#0d0d0d] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Saving...' : 'Save Offer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default OffersManagement;
