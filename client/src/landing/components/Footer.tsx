import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SettingsData {
  name?: string;
  logo?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  workingHours?: Array<{ day: string; hours: string }>;
}

interface Props {
  settings: SettingsData;
}

const footerLinks = {
  'Quick Links': ['Home', 'Menu', 'Gallery', 'About Us', 'Contact'],
  'Dining': ['Fine Dining', 'Private Events', 'Wine Cellar', 'Chef\'s Table', 'Gift Cards'],
  'Company': ['About Us', 'Careers', 'Press', 'Privacy Policy', 'Terms of Service'],
};

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'TripAdvisor',
    href: '#',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135A5.93 5.93 0 0 0 0 12.04a5.935 5.935 0 0 0 5.63 5.927L4.08 19.705h3.947l1.822-2.496A9.72 9.72 0 0 0 12 17.5a9.72 9.72 0 0 0 2.151-.29l1.822 2.496h3.948l-1.55-1.739A5.936 5.936 0 0 0 24 12.04a5.93 5.93 0 0 0-1.963-4.399L24 5.507h-4.361a13.705 13.705 0 0 0-7.633-1.212zM12 6.052c3.531 0 6.4 2.819 6.4 6.295 0 3.476-2.869 6.295-6.4 6.295-3.531 0-6.4-2.819-6.4-6.295 0-3.476 2.869-6.295 6.4-6.295zM5.93 8.267A3.786 3.786 0 0 0 2.14 12.04a3.786 3.786 0 0 0 3.788 3.773 3.786 3.786 0 0 0 3.787-3.773A3.786 3.786 0 0 0 5.93 8.267zm12.14 0a3.786 3.786 0 0 0-3.787 3.773 3.786 3.786 0 0 0 3.787 3.773 3.786 3.786 0 0 0 3.787-3.773 3.786 3.786 0 0 0-3.787-3.773zM12 8.8a3.24 3.24 0 0 1 3.24 3.24A3.24 3.24 0 0 1 12 15.28a3.24 3.24 0 0 1-3.24-3.24A3.24 3.24 0 0 1 12 8.8zm-6.07 1.214a1.786 1.786 0 0 1 1.787 1.786 1.786 1.786 0 0 1-1.787 1.786 1.786 1.786 0 0 1-1.786-1.786 1.786 1.786 0 0 1 1.786-1.786zm12.14 0a1.786 1.786 0 0 1 1.787 1.786 1.786 1.786 0 0 1-1.787 1.786 1.786 1.786 0 0 1-1.786-1.786 1.786 1.786 0 0 1 1.786-1.786zm-6.07.24a1.785 1.785 0 0 0 0 3.57 1.785 1.785 0 0 0 0-3.57z" />
      </svg>
    ),
  },
];

const AccordionSection: React.FC<{ title: string; links: string[] }> = ({ title, links }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 space-y-2.5">
          {links.map(l => (
            <a key={l} href="#" className="block text-sm text-muted hover:text-cream transition-colors">{l}</a>
          ))}
        </div>
      )}
    </div>
  );
};

const Footer: React.FC<Props> = ({ settings }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pine border-t border-gold/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Desktop: 4-column grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16">

          {/* Brand Column */}
          <div className="space-y-5">
            <div>
              <div className="font-serif text-xl font-bold gold-gradient tracking-[0.15em] uppercase">{settings.name || 'Restaurant'}</div>
              <div className="text-[9px] text-muted tracking-[0.3em] uppercase mt-0.5">Fine Dining</div>
            </div>
            <p className="text-sm text-muted leading-relaxed">{settings.tagline || 'Fine Dining & Exquisite Culinary Art'}</p>
            <div className="flex gap-3">
              {socialLinks.map(s => (
                <a key={s.name} href={s.href}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted hover:text-gold hover:border-gold/30 border border-transparent transition-all duration-300">
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-5">
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">{title}</h4>
              <div className="space-y-2.5">
                {links.map(l => (
                  <a key={l} href="#"
                    className="block text-sm text-muted hover:text-cream hover:translate-x-1 transition-all duration-200">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Accordion */}
        <div className="sm:hidden py-10 space-y-1">
          {/* Brand */}
          <div className="py-6 border-b border-white/8">
            <div className="font-serif text-lg font-bold gold-gradient tracking-wider uppercase mb-2">{settings.name}</div>
            <p className="text-sm text-muted">{settings.tagline}</p>
            <div className="flex gap-3 mt-4">
              {socialLinks.map(s => (
                <a key={s.name} href={s.href}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted hover:text-gold transition-colors border border-transparent">
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <AccordionSection key={title} title={title} links={links} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted text-center">
            © {year} {settings.name || 'Restaurant'}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" className="text-[11px] text-muted hover:text-cream transition-colors">{l}</a>
            ))}
            <a href="/admin/login" className="text-[11px] text-gold hover:text-cream transition-colors font-semibold">Admin Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
