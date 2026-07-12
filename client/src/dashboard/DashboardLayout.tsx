import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  Compass,
  UtensilsCrossed,
  MessageSquare,
  Users as UsersIcon,
  Tag,
  Palette,
  Search,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Eye,
  EyeOff,
  Laptop,
  Smartphone,
  Tablet,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Views imports
import DashboardHome from './views/DashboardHome';
import WebsiteSettings from './views/WebsiteSettings';
import HeroSectionView from './views/HeroSection';
import AboutSectionView from './views/AboutSection';
import MenuManagement from './views/MenuManagement';
import GalleryManagement from './views/GalleryManagement';
import TestimonialsManagement from './views/TestimonialsManagement';
import ChefSectionView from './views/ChefSection';
import OffersManagement from './views/OffersManagement';
import ThemeSettingsView from './views/ThemeSettings';
import SEOSettingsView from './views/SEOSettings';
import UserProfile from './views/UserProfile';

// Preview frame import (we will create this so the admin can see their edits in a sub-view)
import LandingPagePreview from '../landing/LandingPagePreview';

const DashboardLayout: React.FC = () => {
  const { logout, adminUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Preview configuration states
  const [showPreviewPane, setShowPreviewPane] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'hero', label: 'Hero Section', icon: Compass },
    { id: 'about', label: 'About Section', icon: UserIcon },
    { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'chef', label: 'Chef Section', icon: UsersIcon },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'theme', label: 'Theme Settings', icon: Palette },
    { id: 'seo', label: 'SEO Config', icon: Search },
    { id: 'users', label: 'User Profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const getActiveTitle = () => {
    const activeItem = navigationItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.label : 'Dashboard';
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'settings': return <WebsiteSettings />;
      case 'hero': return <HeroSectionView />;
      case 'about': return <AboutSectionView />;
      case 'menu': return <MenuManagement />;
      case 'gallery': return <GalleryManagement />;
      case 'testimonials': return <TestimonialsManagement />;
      case 'chef': return <ChefSectionView />;
      case 'offers': return <OffersManagement />;
      case 'theme': return <ThemeSettingsView />;
      case 'seo': return <SEOSettingsView />;
      case 'users': return <UserProfile />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-zinc-200 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-800 bg-[#0d0d0d] px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-zinc-200 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center">
              <span className="text-primary font-serif font-bold text-sm">E</span>
            </div>
            <span className="font-serif tracking-widest text-sm uppercase hidden sm:inline-block">L’Étoile Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick links to live preview and device toggles */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#161616] p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setShowPreviewPane(!showPreviewPane)}
              className={`p-1.5 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors ${showPreviewPane ? 'bg-primary text-[#0d0d0d]' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Toggle Live Preview Pane"
            >
              {showPreviewPane ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPreviewPane ? 'Hide Preview' : 'Show Preview'}</span>
            </button>

            {showPreviewPane && (
              <>
                <div className="w-[1px] h-4 bg-zinc-800 mx-1"></div>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded cursor-pointer ${previewDevice === 'desktop' ? 'bg-zinc-800 text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded cursor-pointer ${previewDevice === 'tablet' ? 'bg-zinc-800 text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded cursor-pointer ${previewDevice === 'mobile' ? 'bg-zinc-800 text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-primary flex items-center gap-1 border border-zinc-800 hover:border-primary/20 px-3 py-1.5 bg-[#121212] rounded-lg transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="w-[1px] h-6 bg-zinc-800"></div>

          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-zinc-300">{adminUser?.name || 'Chef Sterling'}</p>
            <p className="text-[10px] text-zinc-500">Administrator</p>
          </div>
        </div>
      </header>

      {/* Main Work Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar (Desktop) */}
        <aside className="w-64 border-r border-zinc-800 bg-[#0d0d0d] hidden lg:flex flex-col justify-between shrink-0">
          <div className="p-4 space-y-1">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary pl-3.5'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 z-50 lg:hidden"
              />
              {/* Drawer Content */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 bottom-0 left-0 w-64 bg-[#0d0d0d] z-50 border-r border-zinc-800 flex flex-col justify-between lg:hidden"
              >
                <div>
                  <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800">
                    <span className="font-serif tracking-widest text-sm uppercase text-primary">L’Étoile Admin</span>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-130px)]">
                    {navigationItems.map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-zinc-500'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 border-t border-zinc-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content & Live Preview Split Container */}
        <main className="flex-1 flex overflow-hidden">
          {/* Active Editor Panel */}
          <section className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-serif text-zinc-100">{getActiveTitle()}</h1>
                <p className="text-xs text-zinc-500 mt-1">Configure and manage your restaurant details below.</p>
              </div>
              
              {renderActiveView()}
            </div>
          </section>

          {/* Dynamic Live Preview Panel */}
          {showPreviewPane && (
            <section className="hidden xl:flex w-[480px] xxl:w-[560px] shrink-0 border-l border-zinc-800 bg-[#0e0e0e] flex-col overflow-hidden">
              <div className="h-12 border-b border-zinc-800 px-4 flex items-center justify-between bg-[#0a0a0a]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">Real-time Preview</span>
                </div>
                <div className="text-[10px] text-zinc-500 italic">No page refresh required</div>
              </div>
              
              <div className="flex-1 p-4 bg-[#111111] flex items-center justify-center overflow-hidden">
                {/* Simulated Web Browser Container */}
                <div className={`h-full w-full border border-zinc-800 bg-[#0c0c0c] rounded-xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
                  previewDevice === 'mobile' ? 'max-w-[340px] h-[640px] rounded-3xl border-4' :
                  previewDevice === 'tablet' ? 'max-w-[420px] h-[780px]' : 'max-w-full h-full'
                }`}>
                  {/* Browser Address Bar */}
                  <div className="bg-[#181818] h-8 border-b border-zinc-900/60 flex items-center px-3 gap-2 shrink-0">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-zinc-700 rounded-full"></div>
                      <div className="w-2 h-2 bg-zinc-700 rounded-full"></div>
                      <div className="w-2 h-2 bg-zinc-700 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-[#0d0d0d] text-[10px] text-zinc-500 rounded py-0.5 px-3 truncate text-center select-none font-mono">
                      localhost:5173/preview
                    </div>
                  </div>
                  
                  {/* Inner Page Preview Viewport */}
                  <div className="flex-1 overflow-y-auto">
                    <LandingPagePreview />
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
