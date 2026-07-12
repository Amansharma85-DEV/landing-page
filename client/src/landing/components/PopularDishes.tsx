import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Flame, ShoppingBag, ChevronRight } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  category: string;
  isVeg?: boolean;
  spicyLevel?: number;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  isAvailable?: boolean;
}

interface Category {
  _id: string;
  name: string;
}

interface Props {
  menuItems: MenuItem[];
  categories: Category[];
  currency: string;
}

const PopularDishes: React.FC<Props> = ({ menuItems, categories, currency }) => {
  const [active, setActive] = useState('All');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const cats = ['All', ...categories.map(c => c.name)];
  const filtered = active === 'All'
    ? menuItems.filter(d => d.isAvailable)
    : menuItems.filter(d => d.category === active && d.isAvailable);

  return (
    <section id="menu" className="py-24 bg-obsidian relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-jade/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label justify-center">Our Menu</div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-4">
            Popular <span className="gold-gradient">Dishes</span>
          </h2>
          <p className="text-cream/50 text-sm max-w-xl mx-auto">
            Curated selections from our award-winning kitchen. Every dish tells a story.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {cats.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 ${
                active === cat
                  ? 'bg-gold text-obsidian shadow-lg shadow-gold/30'
                  : 'glass text-muted hover:text-gold hover:border-gold/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" ref={ref}>
          {filtered.slice(0, 8).map((dish, i) => (
            <motion.div
              key={dish._id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                {dish.images?.[0] ? (
                  <img
                    src={dish.images[0]}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-jade to-moss flex items-center justify-center">
                    <span className="text-muted text-xs">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {dish.isChefSpecial && (
                    <span className="bg-gold text-obsidian text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider">
                      ★ CHEF'S PICK
                    </span>
                  )}
                  {dish.isPopular && (
                    <span className="bg-red-600/90 text-white text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider">
                      POPULAR
                    </span>
                  )}
                </div>

                {dish.isVeg && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/60 border border-green-500/40 flex items-center justify-center backdrop-blur">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-serif text-sm font-semibold text-cream group-hover:text-gold transition-colors leading-snug">
                    {dish.name}
                  </h3>
                  <span className="font-serif text-lg font-bold text-gold shrink-0">{currency}&nbsp;{dish.price}</span>
                </div>

                {dish.description && (
                  <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">{dish.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    <span className="text-[11px] text-cream/60">4.8</span>
                    {dish.spicyLevel ? (
                      <div className="flex ml-2">
                        {[...Array(dish.spicyLevel)].map((_, i) => (
                          <Flame key={i} className="w-3 h-3 text-red-500 fill-red-500" />
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <button className="flex items-center gap-1.5 bg-gold/10 hover:bg-gold text-gold hover:text-obsidian border border-gold/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300">
                    <ShoppingBag className="w-3 h-3" />
                    Order
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Snap Scroll */}
        <div className="sm:hidden snap-scroll">
          {filtered.slice(0, 8).map(dish => (
            <div key={dish._id} className="snap-item w-[75vw] card">
              <div className="relative h-44 overflow-hidden">
                {dish.images?.[0] ? (
                  <img src={dish.images[0]} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-jade flex items-center justify-center">
                    <span className="text-muted text-xs">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
                {dish.isChefSpecial && (
                  <span className="absolute top-2 left-2 bg-gold text-obsidian text-[8px] font-bold px-2 py-0.5 rounded-full">★ CHEF'S PICK</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-serif text-sm font-semibold text-cream">{dish.name}</h3>
                  <span className="text-gold font-bold">{currency}&nbsp;{dish.price}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    <span className="text-[10px] text-muted">4.8</span>
                  </div>
                  <button className="bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Menu Link */}
        <div className="text-center mt-12">
          <a href="#menu" className="btn-outline inline-flex">
            View Full Menu <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;
