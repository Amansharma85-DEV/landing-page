import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

interface Props {
  restaurantName: string;
  logo?: string;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const Header: React.FC<Props> = ({ restaurantName, logo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ['home', 'menu', 'gallery', 'about', 'testimonials', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= -120 && rect.top <= 280) { setActive(id); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-2xl shadow-black/40 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 shrink-0">
            {logo ? (
              <img src={logo} alt={restaurantName} className="h-8 w-auto object-contain" />
            ) : (
              <div className="shrink-0 min-w-0">
                <div className="font-serif text-sm sm:text-lg font-bold gold-gradient tracking-[0.15em] sm:tracking-[0.18em] uppercase leading-none whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
                  {restaurantName}
                </div>
                <div className="text-[7px] sm:text-[8px] text-muted tracking-[0.25em] sm:tracking-[0.35em] uppercase mt-0.5 whitespace-nowrap">Fine Dining</div>
              </div>
            )}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className={`text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-300 relative group ${
                  active === link.href.slice(1) ? 'text-gold' : 'text-cream/60 hover:text-cream'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                  active === link.href.slice(1) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <a href="#reservation" className="btn-primary gap-2">
              Reserve Table <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-3">
            <a href="#reservation" className="btn-primary py-2 px-4 text-[10px] min-h-0 h-9">
              Reserve
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-cream/70 hover:text-gold transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-obsidian/95 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] glass-dark z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <span className="font-serif gold-gradient text-base font-bold tracking-wider uppercase">
                  {restaurantName}
                </span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 text-cream/50 hover:text-gold transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-0 px-6 pt-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-white/5 text-cream/60 hover:text-gold transition-colors group"
                  >
                    <span className="text-sm font-medium tracking-widest uppercase">{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </motion.a>
                ))}
              </nav>

              <div className="p-6 space-y-3">
                <a
                  href="#reservation"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center text-sm"
                >
                  Reserve A Table
                </a>
                <p className="text-center text-muted text-[10px] tracking-widest">Mon – Sun · 5PM – 11PM</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
