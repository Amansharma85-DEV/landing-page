import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, Upload, X, Loader2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Testimonial } from '../../context/AppContext';
import api from '../../services/api';

const TestimonialsManagement: React.FC = () => {
  const { previewData, refreshData } = useApp();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  // Form Fields
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (previewData?.testimonials) {
      setTestimonials(previewData.testimonials);
    }
  }, [previewData?.testimonials]);

  const openModal = (t: Testimonial | null = null) => {
    setEditingTestimonial(t);
    if (t) {
      setName(t.name);
      setPhoto(t.photo || '');
      setReview(t.review);
      setRating(t.rating);
    } else {
      setName('');
      setPhoto('');
      setReview('');
      setRating(5);
    }
    setError(null);
    setShowModal(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/admin/upload', formData);
      if (res.success) {
        setPhoto(res.url);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload = { name, photo, review, rating };

    try {
      let res;
      if (editingTestimonial) {
        res = await api.put(`/admin/testimonials/${editingTestimonial._id}`, payload);
      } else {
        res = await api.post('/admin/testimonials', payload);
      }

      if (res.success) {
        await refreshData();
        setShowModal(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save testimonial.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const res = await api.delete(`/admin/testimonials/${id}`);
        if (res.success) {
          await refreshData();
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete testimonial.');
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
          <span>Add Testimonial</span>
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-10 bg-[#0e0e0e] border border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-500">No testimonials written yet. Click Add to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(t => (
            <div
              key={t._id}
              className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < t.rating ? 'fill-primary text-primary' : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">"{t.review}"</p>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-850 pt-4 mt-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#161616] border border-zinc-800 overflow-hidden shrink-0">
                    {t.photo ? (
                      <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px]">Pic</div>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-300">{t.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(t)}
                    className="p-1.5 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1.5 hover:bg-red-950/25 border border-transparent hover:border-red-900 text-zinc-500 hover:text-red-400 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
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
              {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>

            {error && (
              <div className="mb-4 p-2.5 bg-red-950/30 border border-red-500/20 text-red-300 text-[10px] rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Photo Upload */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Customer Photo</label>
                <div className="flex items-center gap-4 p-3 bg-[#121212] border border-zinc-800 rounded-lg">
                  <div className="w-12 h-12 rounded-full border border-zinc-800 bg-[#161616] flex items-center justify-center overflow-hidden shrink-0">
                    {photo ? (
                      <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] text-zinc-600 font-serif">No Pic</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="testimonial-photo-input"
                    />
                    <label
                      htmlFor="testimonial-photo-input"
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      {isUploading ? <Loader2 className="w-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                />
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block">Rating *</label>
                <div className="flex gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="text-zinc-500 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          num <= rating ? 'fill-primary text-primary' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Quote */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Review Text *</label>
                <textarea
                  rows={3}
                  required
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-4 py-2 bg-[#121212] border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-primary/60"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 bg-primary hover:bg-[#b59870] disabled:bg-primary/50 text-[#0d0d0d] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Saving...' : 'Save Testimonial'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default TestimonialsManagement;
