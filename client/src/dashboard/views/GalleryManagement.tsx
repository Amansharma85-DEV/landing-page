import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { GalleryItem } from '../../context/AppContext';
import api from '../../services/api';

const GalleryManagement: React.FC = () => {
  const { previewData, refreshData } = useApp();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationNote, setOptimizationNote] = useState<string | null>(null);

  useEffect(() => {
    if (previewData?.gallery) {
      setGallery(previewData.gallery);
    }
  }, [previewData?.gallery]);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Upload Logic
  const uploadFiles = async (files: FileList) => {
    setIsUploading(true);
    setError(null);
    setOptimizationNote(null);

    const formData = new FormData();
    let containsLargeFile = false;

    for (let i = 0; i < files.length; i++) {
      // Check size (warn if > 2MB for SEO / loading performance)
      if (files[i].size > 2 * 1024 * 1024) {
        containsLargeFile = true;
      }
      formData.append('images', files[i]);
    }

    if (containsLargeFile) {
      setOptimizationNote("Some images exceed 2MB. We highly recommend resizing/compressing them for faster loading speeds.");
    }

    try {
      const res = await api.post('/admin/upload-multiple', formData);
      if (res.success) {
        // Save uploaded items to gallery model
        const savePromises = res.files.map((file: any) =>
          api.post('/admin/gallery', { url: file.url, publicId: file.publicId })
        );
        await Promise.all(savePromises);
        await refreshData();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload gallery images.');
    } finally {
      setIsUploading(false);
    }
  };

  // Drop File handler
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  // File Selector Change handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFiles(e.target.files);
    }
  };

  // Delete Gallery Image
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image from your gallery?')) {
      setIsDeleting(id);
      try {
        const res = await api.delete(`/admin/gallery/${id}`);
        if (res.success) {
          await refreshData();
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete gallery image.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-950/20 border border-red-500/25 text-red-300 text-xs rounded-lg">{error}</div>
      )}

      {optimizationNote && (
        <div className="p-3 bg-yellow-950/20 border border-yellow-500/25 text-yellow-400 text-xs rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{optimizationNote}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
          dragActive
            ? 'border-primary bg-primary/5 scale-[0.99]'
            : 'border-zinc-800 bg-[#121212] hover:border-primary/30'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="gallery-drag-drop-input"
        />
        
        <div className="w-12 h-12 rounded-full bg-[#181818] border border-zinc-850 flex items-center justify-center text-zinc-500 mb-3">
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>

        <h4 className="text-xs font-semibold text-zinc-300">
          {isUploading ? 'Uploading and optimizing...' : 'Drag and drop images here'}
        </h4>
        <p className="text-[10px] text-zinc-500 mt-1">or click to browse from local drive. Supports JPG, PNG, WEBP.</p>
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="text-center py-10 bg-[#0e0e0e] border border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-500">No images in media library. Upload files above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {gallery.map(item => {
            const loading = isDeleting === item._id;
            return (
              <div
                key={item._id}
                className="group relative rounded-xl border border-zinc-800 bg-[#121212] overflow-hidden aspect-square shadow-md"
              >
                <img
                  src={item.url}
                  alt="Gallery Item"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    disabled={loading}
                    className="p-2.5 bg-red-950/70 border border-red-500/20 text-red-400 rounded-full hover:bg-red-600 hover:text-black cursor-pointer transition-colors shadow-lg shadow-red-900/10"
                    title="Delete Image"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default GalleryManagement;
