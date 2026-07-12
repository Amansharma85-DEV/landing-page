import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  _id: string;
  url: string;
}

interface Props {
  gallery: GalleryItem[];
}

const Gallery: React.FC<Props> = ({ gallery }) => {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-forest relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-label justify-center">Visual Tour</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">
            The <span className="gold-gradient">Ambience</span>
          </h2>
          <p className="text-cream/50 text-sm mt-3 max-w-md mx-auto">
            A glimpse into our world — where every corner tells a story of elegance.
          </p>
        </div>

        {/* Masonry Grid — desktop/tablet */}
        <div className="hidden sm:block masonry">
          {gallery.map((item, i) => (
            <div
              key={item._id}
              className="masonry-item group relative cursor-zoom-in rounded-2xl overflow-hidden border border-gold/8 hover:border-gold/25 transition-all duration-300 shadow-xl shadow-black/30"
              onClick={() => setLightbox(item.url)}
            >
              <img
                src={item.url}
                alt={`Gallery ${i + 1}`}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <div className="w-10 h-10 glass-gold rounded-full flex items-center justify-center">
                  <ZoomIn className="w-4 h-4 text-gold" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2-Column Mobile Grid */}
        <div className="sm:hidden grid grid-cols-2 gap-2">
          {gallery.map((item, i) => (
            <div
              key={item._id}
              className="relative rounded-xl overflow-hidden border border-gold/8 aspect-square cursor-pointer"
              onClick={() => setLightbox(item.url)}
            >
              <img
                src={item.url}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5 text-gold" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 p-2.5 glass-gold rounded-full text-gold hover:text-cream transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightbox}
              alt="Gallery Fullscreen"
              className="max-w-full max-h-[88vh] rounded-2xl shadow-2xl object-contain border border-gold/15"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
