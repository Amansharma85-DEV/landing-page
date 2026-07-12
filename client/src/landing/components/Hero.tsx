import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, ChevronRight, ArrowDown } from 'lucide-react';

interface HeroData {
  backgroundImage?: string;
  mainHeading?: string;
  subHeading?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  badgeText?: string;
  isOpenStatus?: boolean;
}

interface SettingsData {
  name?: string;
  googleReviewRating?: number;
  totalReviews?: number;
}

interface Props {
  hero: HeroData;
  settings: SettingsData;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

const Hero: React.FC<Props> = ({ hero, settings }) => {
  const rating = settings.googleReviewRating || 4.9;
  const reviews = settings.totalReviews || 1200;
  const formattedReviews = reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}k` : reviews;

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {hero.backgroundImage ? (
          <img
            src={hero.backgroundImage}
            alt="Hero"
            className="w-full h-full object-cover scale-105"
            style={{ objectPosition: 'center 30%' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-jade via-forest to-obsidian" />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
        {/* Green tint overlay */}
        <div className="absolute inset-0 bg-forest/30 mix-blend-multiply" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-jade/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-8rem)]">

          {/* ─── LEFT CONTENT ─── */}
          <div className="flex flex-col justify-center space-y-8 order-2 lg:order-1">

            {/* Badge */}
            {hero.badgeText && (
              <motion.div {...fadeUp(0.1)} className="flex items-center gap-3">
                <div className="glass-gold px-4 py-2 rounded-full flex items-center gap-2">
                  <Star className="w-3 h-3 text-gold fill-gold" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">
                    {hero.badgeText}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Heading */}
            <motion.h1 {...fadeUp(0.2)} className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-cream leading-[1.1] tracking-tight">
              {hero.mainHeading || 'A Symphony of Flavors'}
              <span className="block gold-gradient mt-2">on Every Plate</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p {...fadeUp(0.3)} className="text-cream/60 text-base sm:text-lg leading-relaxed max-w-lg">
              {hero.subHeading || 'Indulge in an extraordinary fine-dining experience curated by world-class chefs.'}
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-4">
              <a href={hero.primaryBtnLink || '#reservation'} className="btn-primary text-sm">
                {hero.primaryBtnText || 'Reserve A Table'}
                <ChevronRight className="w-4 h-4" />
              </a>
              <a href={hero.secondaryBtnLink || '#menu'} className="btn-outline text-sm">
                {hero.secondaryBtnText || 'View Menu'}
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div {...fadeUp(0.5)} className="flex items-center gap-8 pt-4 border-t border-white/8">
              <div>
                <div className="font-serif text-2xl font-bold text-gold">{formattedReviews}+</div>
                <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Happy Guests</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="font-serif text-2xl font-bold text-gold">{rating}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Google Rating</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="font-serif text-2xl font-bold text-gold">3★</div>
                <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Michelin Stars</div>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT IMAGE ─── */}
          <div className="relative flex items-center justify-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative w-full max-w-sm lg:max-w-none"
            >
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-gold/15 shadow-2xl shadow-black/60"
                style={{ aspectRatio: '4/5' }}>
                {hero.backgroundImage ? (
                  <img
                    src={hero.backgroundImage}
                    alt="Featured Dish"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-jade to-obsidian" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
              </div>

              {/* ─── Floating: Open Now Badge ─── */}
              {hero.isOpenStatus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="absolute top-6 left-2 sm:-left-8 glass px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-2.5 shadow-xl z-20"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 pulse-ring shrink-0" />
                  <span className="text-[11px] font-semibold text-cream tracking-wider">Open Now</span>
                </motion.div>
              )}

              {/* ─── Floating: Rating Card ─── */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-24 right-2 sm:-right-8 glass px-3 sm:px-4 py-2 sm:py-3.5 rounded-2xl shadow-2xl min-w-[120px] sm:min-w-[140px] z-20"
              >
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-gold fill-gold" />
                  ))}
                </div>
                <div className="font-serif text-xl font-bold text-gold">{rating}</div>
                <div className="text-[10px] text-muted mt-0.5">{formattedReviews}+ Reviews</div>
              </motion.div>

              {/* ─── Floating: Customers Card ─── */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                style={{ animation: 'float 5s ease-in-out infinite' }}
                className="absolute bottom-6 left-2 sm:-left-8 glass px-3 sm:px-4 py-2 sm:py-3.5 rounded-2xl shadow-xl flex items-center gap-2 sm:gap-3 z-20"
              >
                <div className="w-10 h-10 bg-gold/15 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="font-serif text-base font-bold text-cream">{formattedReviews}+</div>
                  <div className="text-[10px] text-muted">Happy Guests</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
