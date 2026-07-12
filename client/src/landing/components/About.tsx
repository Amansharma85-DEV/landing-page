import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Heart, Users, Sparkles } from 'lucide-react';

interface AboutData {
  image?: string;
  title?: string;
  description?: string;
  experienceYears?: number;
  happyCustomers?: string;
  signatureDishesList?: string[];
}

interface SettingsData {
  name?: string;
}

interface Props {
  about: AboutData;
  settings: SettingsData;
}

const stats = (about: AboutData) => [
  { icon: Award, label: 'Years Experience', value: `${about.experienceYears || 14}+`, color: 'text-gold' },
  { icon: Users, label: 'Happy Guests', value: about.happyCustomers || '120k+', color: 'text-green-400' },
  { icon: Heart, label: 'Michelin Stars', value: '3 ★', color: 'text-red-400' },
  { icon: Sparkles, label: 'Signature Dishes', value: `${about.signatureDishesList?.length || 15}+`, color: 'text-blue-400' },
];

const About: React.FC<Props> = ({ about, settings }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-24 bg-obsidian relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-jade/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center" ref={ref}>

          {/* ─── Image ─── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            {/* Corner accents */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl z-10" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-gold/40 rounded-br-2xl z-10" />

            <div className="relative rounded-3xl overflow-hidden border border-gold/10 shadow-2xl shadow-black/60" style={{ aspectRatio: '4/5' }}>
              {about.image ? (
                <img
                  src={about.image}
                  alt={about.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-jade to-obsidian" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
            </div>

            {/* Floating years badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 left-8 glass p-5 rounded-2xl shadow-2xl"
            >
              <div className="font-serif text-4xl font-bold text-gold leading-none">{about.experienceYears || 14}</div>
              <div className="text-[10px] text-muted uppercase tracking-wider mt-1">Years of</div>
              <div className="text-xs text-cream font-medium">Excellence</div>
            </motion.div>
          </motion.div>

          {/* ─── Content ─── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <div>
              <div className="section-label">Our Story</div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight">
                {about.title || 'A Journey of Taste & Elegance'}
              </h2>
            </div>

            <p className="text-cream/60 text-base leading-relaxed whitespace-pre-wrap">
              {about.description || `Established with a vision to redefine fine dining, ${settings.name || 'our restaurant'} blends classical techniques with modern flavors. Every dish is a masterpiece, every moment unforgettable.`}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats(about).map((s) => (
                <div key={s.label} className="glass p-4 rounded-2xl flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${s.color === 'text-gold' ? 'bg-gold/10' : s.color === 'text-green-400' ? 'bg-green-400/10' : s.color === 'text-red-400' ? 'bg-red-400/10' : 'bg-blue-400/10'} flex items-center justify-center shrink-0`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div>
                    <div className={`font-serif text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[9px] text-muted uppercase tracking-wider">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Dishes */}
            {about.signatureDishesList && about.signatureDishesList.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest">House Signatures</h4>
                <div className="space-y-2">
                  {about.signatureDishesList.map((dish, _i) => (
                    <div key={_i} className="flex items-center gap-3 text-cream/70 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {dish}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
