import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  _id: string;
  name: string;
  photo?: string;
  review: string;
  rating: number;
}

interface Props {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<Props> = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const prev = () => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(p => (p + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-obsidian relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-jade/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-label justify-center">Testimonials</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">
            What Guests <span className="gold-gradient">Say</span>
          </h2>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="card p-7 relative"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-gold/15" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-cream/70 text-sm leading-relaxed italic mb-6">"{t.review}"</p>
              <div className="flex items-center gap-3 border-t border-white/5 pt-5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/20 bg-jade shrink-0">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-gold font-bold text-sm">
                      {t.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-cream">{t.name}</div>
                  <div className="text-[10px] text-muted">Verified Diner</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet: Auto-swipe slider */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="card p-8 relative"
              >
                <Quote className="absolute top-5 right-5 w-8 h-8 text-gold/15" />
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-cream/75 text-base leading-relaxed italic mb-7">
                  "{testimonials[current].review}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/25 bg-jade shrink-0">
                    {testimonials[current].photo ? (
                      <img src={testimonials[current].photo} alt={testimonials[current].name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-gold font-bold">
                        {testimonials[current].name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-cream">{testimonials[current].name}</div>
                    <div className="text-[10px] text-muted">Verified Diner</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={prev} className="p-2.5 glass rounded-full text-muted hover:text-gold transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <button onClick={next} className="p-2.5 glass rounded-full text-muted hover:text-gold transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
