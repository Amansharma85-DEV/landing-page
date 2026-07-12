import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Leaf, ChefHat, Gem, Zap } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    desc: 'Daily sourced organic produce and seasonal ingredients from local farms and premium suppliers.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: ChefHat,
    title: 'Expert Chefs',
    desc: 'Michelin-starred culinary masters with 20+ years of international fine-dining expertise.',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Gem,
    title: 'Premium Dining',
    desc: 'An unmatched luxury atmosphere designed to make every occasion extraordinary and unforgettable.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    desc: 'Gourmet cuisine delivered to your door in premium packaging, maintaining restaurant quality.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
];

const Features: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 bg-forest relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="section-label justify-center">Why Choose Us</div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream">
            The <span className="gold-gradient">Perfect Experience</span>
          </h2>
        </div>

        {/* Desktop: Grid | Mobile: Snap Scroll */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6" ref={ref}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="card p-6 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-cream mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Snap Scroll */}
        <div className="sm:hidden snap-scroll px-1">
          {features.map((f) => (
            <div key={f.title} className="snap-item w-[75vw] card p-6">
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-serif text-base font-semibold text-cream mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile scroll dots */}
        <div className="flex sm:hidden justify-center gap-2 mt-4">
          {features.map((_f, _i) => (
            <div key={_i} className={`w-1.5 h-1.5 rounded-full ${_i === 0 ? 'bg-gold' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
