import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, TrendingUp, Leaf } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  isChefSpecial?: boolean;
  isPopular?: boolean;
  isVeg?: boolean;
}

interface Props {
  menuItems: MenuItem[];
  currency: string;
}

const SpecialMenu: React.FC<Props> = ({ menuItems, currency }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const specials = [
    {
      tag: "Chef's Special",
      icon: Sparkles,
      color: 'text-gold',
      bg: 'from-gold/20 to-transparent',
      border: 'border-gold/30',
      items: menuItems.filter(d => d.isChefSpecial).slice(0, 1),
      fallbackImg: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
    },
    {
      tag: 'Most Popular',
      icon: TrendingUp,
      color: 'text-red-400',
      bg: 'from-red-600/20 to-transparent',
      border: 'border-red-500/30',
      items: menuItems.filter(d => d.isPopular).slice(0, 1),
      fallbackImg: 'https://images.unsplash.com/photo-1559742811-82428b49223e?q=80&w=600&auto=format&fit=crop',
    },
    {
      tag: 'Seasonal Menu',
      icon: Leaf,
      color: 'text-green-400',
      bg: 'from-green-600/20 to-transparent',
      border: 'border-green-500/30',
      items: menuItems.filter(d => d.isVeg).slice(0, 1),
      fallbackImg: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <section className="py-24 bg-forest relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-label justify-center">Chef Curated</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">
            Special <span className="gold-gradient">Collections</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={ref}>
          {specials.map((spec, i) => {
            const item = spec.items[0];
            const img = item?.images?.[0] || spec.fallbackImg;
            const name = item?.name || spec.tag;
            const desc = item?.description || 'A premium selection from our culinary masters, prepared with the finest ingredients.';
            const price = item?.price;

            return (
              <motion.div
                key={spec.tag}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative rounded-3xl overflow-hidden border ${spec.border} group cursor-pointer shadow-2xl shadow-black/40`}
                style={{ minHeight: '420px' }}
              >
                {/* Background Image */}
                <img
                  src={img}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-t ${spec.bg}`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-7">
                  {/* Tag */}
                  <div className={`self-start glass-gold px-3.5 py-1.5 rounded-full flex items-center gap-2 ${spec.color}`}>
                    <spec.icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{spec.tag}</span>
                  </div>

                  {/* Bottom content */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl font-bold text-cream leading-snug">{name}</h3>
                    <p className="text-sm text-cream/60 leading-relaxed line-clamp-2">{desc}</p>
                    <div className="flex items-center justify-between pt-2">
                      {price && (
                        <span className="font-serif text-2xl font-bold text-gold">{currency}&nbsp;{price}</span>
                      )}
                      <button className="btn-primary py-2.5 px-5 text-xs min-h-0">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialMenu;
