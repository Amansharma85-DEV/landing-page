import React from 'react';
import { useApp } from '../context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import PopularDishes from './components/PopularDishes';
import SpecialMenu from './components/SpecialMenu';
import About from './components/About';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Reservation from './components/Reservation';
import Location from './components/Location';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';

// ─── Loading Screen ──────────────────────────────────────────────────────────
const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 bg-obsidian flex flex-col items-center justify-center z-[999] gap-6">
    <div className="relative">
      <div className="w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gold" />
      </div>
    </div>
    <p className="text-[10px] tracking-[0.35em] uppercase text-muted">Loading Experience</p>
  </div>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const { previewData } = useApp();

  if (!previewData) return <LoadingScreen />;

  const {
    settings,
    hero,
    about,
    categories,
    menuItems,
    gallery,
    testimonials,
  } = previewData;

  return (
    <div className="min-h-screen bg-obsidian text-cream overflow-x-hidden">

      {/* ─── Navigation ─────────────────────────── */}
      <Header
        restaurantName={settings?.name || 'Restaurant'}
        logo={settings?.logo}
      />

      {/* ─── Hero ───────────────────────────────── */}
      <Hero
        hero={hero || {}}
        settings={{
          name: settings?.name,
          googleReviewRating: settings?.googleReviewRating,
          totalReviews: settings?.totalReviews,
        }}
      />

      {/* ─── Features ───────────────────────────── */}
      <Features />

      {/* ─── Popular Dishes ─────────────────────── */}
      <PopularDishes
        menuItems={menuItems || []}
        categories={categories || []}
        currency={settings?.currency || '₹'}
      />

      {/* ─── Special Menu ───────────────────────── */}
      <SpecialMenu menuItems={menuItems || []} currency={settings?.currency || '₹'} />

      {/* ─── About ──────────────────────────────── */}
      <About
        about={about || {}}
        settings={{ name: settings?.name }}
      />

      {/* ─── Gallery ────────────────────────────── */}
      <Gallery gallery={gallery || []} />

      {/* ─── Testimonials ───────────────────────── */}
      <Testimonials testimonials={testimonials || []} />

      {/* ─── Reservation ────────────────────────── */}
      <Reservation
        settings={{
          phone: settings?.phone,
          email: settings?.email,
        }}
      />

      {/* ─── Location ───────────────────────────── */}
      <Location
        settings={{
          address: settings?.address,
          phone: settings?.phone,
          whatsapp: settings?.whatsapp,
          googleMapsLink: settings?.googleMapsLink,
          workingHours: settings?.workingHours,
        }}
      />

      {/* ─── Footer ─────────────────────────────── */}
      <Footer
        settings={{
          name: settings?.name,
          logo: settings?.logo,
          tagline: settings?.tagline,
          phone: settings?.phone,
          email: settings?.email,
          address: settings?.address,
          whatsapp: settings?.whatsapp,
          workingHours: settings?.workingHours,
        }}
      />

      {/* ─── Floating Buttons ───────────────────── */}
      <FloatingButtons
        settings={{
          phone: settings?.phone,
          whatsapp: settings?.whatsapp,
        }}
      />
    </div>
  );
};

export default LandingPage;
