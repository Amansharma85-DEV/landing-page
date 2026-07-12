import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Interfaces for our dynamic database models
export interface Setting {
  name: string;
  logo: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsLink: string;
  workingHours: { day: string; hours: string }[];
  googleReviewRating: number;
  totalReviews: number;
  priceRange: string;
  currency: string;
}

export interface Hero {
  backgroundImage: string;
  restaurantName: string;
  mainHeading: string;
  subHeading: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  badgeText: string;
  isOpenStatus: boolean;
  animationStyle: string;
}

export interface About {
  image: string;
  title: string;
  description: string;
  experienceYears: number;
  happyCustomers: string;
  signatureDishesCount: number;
  signatureDishesList: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  isVeg: boolean;
  spicyLevel: number;
  isPopular: boolean;
  isChefSpecial: boolean;
  isAvailable: boolean;
}

export interface GalleryItem {
  _id: string;
  url: string;
  publicId?: string;
}

export interface Chef {
  _id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  socialLinks: { instagram: string; facebook: string; twitter: string };
}

export interface Offer {
  _id: string;
  title: string;
  discountText: string;
  couponCode: string;
  description: string;
  image: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface Testimonial {
  _id: string;
  name: string;
  photo: string;
  review: string;
  rating: number;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  buttonStyle: 'square' | 'rounded' | 'pill';
  fontFamily: string;
  bodyFontFamily: string;
  isDark: boolean;
  borderRadius: string;
}

export interface SEO {
  title: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  favicon: string;
}

export interface RestaurantData {
  settings: Setting;
  hero: Hero;
  about: About;
  categories: Category[];
  menuItems: MenuItem[];
  gallery: GalleryItem[];
  chefs: Chef[];
  offers: Offer[];
  testimonials: Testimonial[];
  theme: Theme;
  seo: SEO;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppContextType {
  data: RestaurantData | null;
  previewData: RestaurantData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  adminUser: User | null;
  
  // Preview Actions
  updatePreview: (section: keyof RestaurantData, field: string, value: any) => void;
  updatePreviewRaw: (newData: RestaurantData) => void;
  resetPreview: () => void;
  
  // Database Operations
  saveSection: (section: 'settings' | 'hero' | 'about' | 'theme' | 'seo', payload: any) => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Auth Operations
  login: (token: string, user: User) => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to inject theme rules into root styles
const applyTheme = (theme: Theme) => {
  if (!theme) return;
  const root = document.documentElement;
  
  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-secondary', theme.secondaryColor);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-background', theme.backgroundColor);
  root.style.setProperty('--border-radius', theme.borderRadius);
  
  let btnRadius = theme.borderRadius;
  if (theme.buttonStyle === 'square') btnRadius = '0px';
  if (theme.buttonStyle === 'pill') btnRadius = '9999px';
  root.style.setProperty('--button-radius', btnRadius);

  // Dynamic Font Loader
  const fontHeader = theme.fontFamily || 'Playfair Display';
  const fontBody = theme.bodyFontFamily || 'Inter';
  
  const linkId = 'dynamic-google-fonts';
  let link = document.getElementById(linkId) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = `https://fonts.googleapis.com/css2?family=${fontHeader.replace(/ /g, '+')}:wght@400;500;600;700;800&family=${fontBody.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
  
  root.style.setProperty('--font-header', `'${fontHeader}', serif`);
  root.style.setProperty('--font-body', `'${fontBody}', sans-serif`);
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<RestaurantData | null>(null);
  const [previewData, setPreviewData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  const refreshData = async () => {
    try {
      const response = await api.get('/public/data');
      if (response.success) {
        setData(response.data);
        setPreviewData(response.data);
        applyTheme(response.data.theme);
        
        // Update document SEO head elements
        if (response.data.seo) {
          document.title = response.data.seo.title;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', response.data.seo.metaDescription);
          const metaKeywords = document.querySelector('meta[name="keywords"]');
          if (metaKeywords) metaKeywords.setAttribute('content', response.data.seo.keywords);
          
          let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          if (favicon && response.data.seo.favicon) {
            favicon.href = response.data.seo.favicon;
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch restaurant data.');
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setIsAuthenticated(true);
            setAdminUser(res.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      await refreshData();
    };

    checkAuth();
  }, []);

  // Sync theme changes in preview mode
  useEffect(() => {
    if (previewData?.theme) {
      applyTheme(previewData.theme);
    }
  }, [previewData?.theme]);

  // Auth Operations
  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setAdminUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const updateProfile = (name: string, email: string) => {
    if (adminUser) {
      setAdminUser({ ...adminUser, name, email });
    }
  };

  // Preview Operations
  const updatePreview = (section: keyof RestaurantData, field: string, value: any) => {
    if (!previewData) return;
    
    setPreviewData(prev => {
      if (!prev) return null;
      
      const updatedSection = { ...prev[section] as any };
      updatedSection[field] = value;
      
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  const updatePreviewRaw = (newData: RestaurantData) => {
    setPreviewData(newData);
  };

  const resetPreview = () => {
    setPreviewData(data);
  };

  // Database Save Operations
  const saveSection = async (
    section: 'settings' | 'hero' | 'about' | 'theme' | 'seo',
    payload: any
  ) => {
    try {
      const response = await api.put(`/admin/${section}`, payload);
      if (response.success) {
        // Update both real database state and live preview state
        setData(prev => {
          if (!prev) return null;
          return { ...prev, [section]: response.data };
        });
        setPreviewData(prev => {
          if (!prev) return null;
          return { ...prev, [section]: response.data };
        });
      }
    } catch (err: any) {
      console.error(`Error saving ${section} details:`, err);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        data,
        previewData,
        loading,
        error,
        isAuthenticated,
        adminUser,
        updatePreview,
        updatePreviewRaw,
        resetPreview,
        saveSection,
        refreshData,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
