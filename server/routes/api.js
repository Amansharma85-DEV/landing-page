import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import User from '../models/User.js';
import Theme from '../models/Theme.js';
import Setting from '../models/Setting.js';
import Hero from '../models/Hero.js';
import About from '../models/About.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import Gallery from '../models/Gallery.js';
import Chef from '../models/Chef.js';
import Offer from '../models/Offer.js';
import Testimonial from '../models/Testimonial.js';
import Reservation from '../models/Reservation.js';
import Message from '../models/Message.js';
import SEO from '../models/SEO.js';

import { protect } from '../middleware/auth.js';
import { upload, cloudinary, useCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// ==========================================
// AUTHENTICATION
// ==========================================

// Admin Login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback-secret-key-123',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Current Logged-In User
router.get('/auth/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Update Profile
router.put('/auth/profile', protect, async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // pre-save middleware will hash it

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// PUBLIC DATA & ACTION ROUTERS
// ==========================================

// Consolidated Landing Page Payload
router.get('/public/data', async (req, res) => {
  try {
    const [
      settings,
      hero,
      about,
      categories,
      menuItems,
      gallery,
      chefs,
      offers,
      testimonials,
      theme,
      seo
    ] = await Promise.all([
      Setting.findOne() || new Setting().save(),
      Hero.findOne() || new Hero().save(),
      About.findOne() || new About().save(),
      Category.find().sort({ createdAt: -1 }),
      MenuItem.find({ isAvailable: true }).sort({ createdAt: -1 }),
      Gallery.find().sort({ createdAt: -1 }),
      Chef.find().sort({ createdAt: -1 }),
      Offer.find({ isActive: true }).sort({ createdAt: -1 }),
      Testimonial.find().sort({ createdAt: -1 }),
      Theme.findOne() || new Theme().save(),
      SEO.findOne() || new SEO().save()
    ]);

    // Format the local image paths if cloudinary is not used
    const formatUrl = (url) => {
      if (!url) return '';
      if (url.startsWith('http') || url.startsWith('data:')) return url;
      // Convert backslashes/relative paths to absolute server paths
      const normalizedPath = url.replace(/\\/g, '/');
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      return `${baseUrl}/${normalizedPath}`;
    };

    // Helper function to map assets
    const processUrls = (doc, fields) => {
      if (!doc) return doc;
      const obj = doc.toObject();
      fields.forEach(field => {
        if (obj[field]) {
          obj[field] = formatUrl(obj[field]);
        }
      });
      return obj;
    };

    const formattedSettings = processUrls(settings, ['logo']);
    const formattedHero = processUrls(hero, ['backgroundImage']);
    const formattedAbout = processUrls(about, ['image']);
    const formattedSEO = processUrls(seo, ['ogImage', 'favicon']);

    const formattedMenuItems = menuItems.map(item => {
      const obj = item.toObject();
      if (obj.images && obj.images.length > 0) {
        obj.images = obj.images.map(img => formatUrl(img));
      }
      return obj;
    });

    const formattedChefs = chefs.map(item => {
      const obj = item.toObject();
      if (obj.image) obj.image = formatUrl(obj.image);
      return obj;
    });

    const formattedOffers = offers.map(item => {
      const obj = item.toObject();
      if (obj.image) obj.image = formatUrl(obj.image);
      return obj;
    });

    const formattedTestimonials = testimonials.map(item => {
      const obj = item.toObject();
      if (obj.photo) obj.photo = formatUrl(obj.photo);
      return obj;
    });

    const formattedGallery = gallery.map(item => {
      const obj = item.toObject();
      if (obj.url) obj.url = formatUrl(obj.url);
      return obj;
    });

    res.json({
      success: true,
      data: {
        settings: formattedSettings,
        hero: formattedHero,
        about: formattedAbout,
        categories,
        menuItems: formattedMenuItems,
        gallery: formattedGallery,
        chefs: formattedChefs,
        offers: formattedOffers,
        testimonials: formattedTestimonials,
        theme,
        seo: formattedSEO
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Book a table (Public)
router.post('/public/reserve', async (req, res) => {
  const { name, email, phone, date, time, guests, specialRequests } = req.body;

  try {
    const reservation = new Reservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests
    });

    await reservation.save();
    res.status(201).json({ success: true, message: 'Reservation requested successfully!', data: reservation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Contact Message / Newsletter Subscription (Public)
router.post('/public/contact', async (req, res) => {
  const { type, name, email, phone, message } = req.body;

  try {
    const newMessage = new Message({
      type,
      name,
      email,
      phone,
      message
    });

    await newMessage.save();
    res.status(201).json({ success: true, message: type === 'newsletter' ? 'Subscribed successfully!' : 'Message sent successfully!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// FILE UPLOADS (Admin)
// ==========================================

// Handle single image upload
router.post('/admin/upload', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // For Local Storage fallback, req.file.path holds the path.
    // For Cloudinary Storage, req.file.path holds the Cloudinary URL.
    const fileUrl = useCloudinary ? req.file.path : req.file.path.replace(/\\/g, '/');
    const publicId = useCloudinary ? req.file.filename : null;

    res.json({
      success: true,
      url: fileUrl,
      publicId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Handle multiple images upload
router.post('/admin/upload-multiple', protect, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const files = req.files.map(file => ({
      url: useCloudinary ? file.path : file.path.replace(/\\/g, '/'),
      publicId: useCloudinary ? file.filename : null
    }));

    res.json({
      success: true,
      files
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete uploaded image
router.post('/admin/upload/delete', protect, async (req, res) => {
  const { url, publicId } = req.body;

  try {
    if (useCloudinary && publicId) {
      await cloudinary.uploader.destroy(publicId);
      return res.json({ success: true, message: 'Image deleted from Cloudinary' });
    } else if (url) {
      // Local file delete logic
      // Get filename from URL
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const filepath = path.join('uploads', filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return res.json({ success: true, message: 'Image deleted from server storage' });
      } else {
        return res.status(404).json({ success: false, message: 'Image file not found locally' });
      }
    }
    res.status(400).json({ success: false, message: 'No image identifier provided' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN CRUDS
// ==========================================

// --- WEBSITE SETTINGS ---
router.get('/admin/settings', protect, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await new Setting().save();
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/settings', protect, async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- HERO SECTION ---
router.get('/admin/hero', protect, async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await new Hero().save();
    }
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/hero', protect, async (req, res) => {
  try {
    const hero = await Hero.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- ABOUT SECTION ---
router.get('/admin/about', protect, async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await new About().save();
    }
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/about', protect, async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- THEME SETTINGS ---
router.get('/admin/theme', protect, async (req, res) => {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      theme = await new Theme().save();
    }
    res.json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/theme', protect, async (req, res) => {
  try {
    const theme = await Theme.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json({ success: true, data: theme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- SEO SETTINGS ---
router.get('/admin/seo', protect, async (req, res) => {
  try {
    let seo = await SEO.findOne();
    if (!seo) {
      seo = await new SEO().save();
    }
    res.json({ success: true, data: seo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/seo', protect, async (req, res) => {
  try {
    const seo = await SEO.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json({ success: true, data: seo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- CATEGORIES ---
router.get('/admin/categories', protect, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/categories', protect, async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const category = new Category({ name, slug });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/admin/categories/:id', protect, async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { name, slug }, { new: true });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/admin/categories/:id', protect, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- MENU ITEMS ---
router.get('/admin/menu', protect, async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });
    res.json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/menu', protect, async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/admin/menu/:id', protect, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: menuItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/admin/menu/:id', protect, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- CHEF MANAGEMENT ---
router.get('/admin/chefs', protect, async (req, res) => {
  try {
    const chefs = await Chef.find().sort({ createdAt: -1 });
    res.json({ success: true, data: chefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/chefs', protect, async (req, res) => {
  try {
    const chef = new Chef(req.body);
    await chef.save();
    res.status(201).json({ success: true, data: chef });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/admin/chefs/:id', protect, async (req, res) => {
  try {
    const chef = await Chef.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: chef });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/admin/chefs/:id', protect, async (req, res) => {
  try {
    await Chef.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Chef deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- OFFERS ---
router.get('/admin/offers', protect, async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/offers', protect, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/admin/offers/:id', protect, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/admin/offers/:id', protect, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Offer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- TESTIMONIALS ---
router.get('/admin/testimonials', protect, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/testimonials', protect, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/admin/testimonials/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/admin/testimonials/:id', protect, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- GALLERY ---
router.get('/admin/gallery', protect, async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/gallery', protect, async (req, res) => {
  const { url, publicId } = req.body;
  try {
    const item = new Gallery({ url, publicId });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/admin/gallery/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    
    // Automatically delete from Cloudinary or local if references match
    if (useCloudinary && item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    } else if (item.url) {
      const parts = item.url.split('/');
      const filename = parts[parts.length - 1];
      const filepath = path.join('uploads', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- RESERVATIONS ---
router.get('/admin/reservations', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: -1, time: -1 });
    res.json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/reservations/:id', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, data: reservation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/admin/reservations/:id', protect, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- MESSAGES / NEWSLETTERS ---
router.get('/admin/messages', protect, async (req, res) => {
  try {
    const type = req.query.type;
    const filter = type ? { type } : {};
    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/admin/messages/:id', protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- DASHBOARD HOME STATISTICS ---
router.get('/admin/stats', protect, async (req, res) => {
  try {
    const [
      totalReservations,
      pendingReservations,
      totalNewsletter,
      totalMessages,
      totalMenuItems,
      totalGallery,
      recentBookings,
      recentMessages
    ] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'pending' }),
      Message.countDocuments({ type: 'newsletter' }),
      Message.countDocuments({ type: 'contact' }),
      MenuItem.countDocuments(),
      Gallery.countDocuments(),
      Reservation.find().sort({ createdAt: -1 }).limit(5),
      Message.find({ type: 'contact' }).sort({ createdAt: -1 }).limit(5)
    ]);

    // Simple rating / reviews from settings to show stats
    const settings = await Setting.findOne() || { googleReviewRating: 4.9, totalReviews: 1200 };

    res.json({
      success: true,
      data: {
        stats: {
          totalReservations,
          pendingReservations,
          totalNewsletter,
          totalMessages,
          totalMenuItems,
          totalGallery,
          rating: settings.googleReviewRating,
          reviewsCount: settings.totalReviews
        },
        recentBookings,
        recentMessages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
