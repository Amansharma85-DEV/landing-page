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
import SEO from '../models/SEO.js';

export const checkAndSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping automatic seeding.');
      return;
    }

    console.log('No users found in database. Starting automatic seeding...');

    // 1. Seed User
    await new User({
      name: 'Chef Marcus Sterling',
      email: 'admin@restaurant.com',
      password: 'admin123'
    }).save();

    // 2. Seed Theme
    await new Theme({
      primaryColor: '#c5a880',
      secondaryColor: '#161616',
      accentColor: '#ffffff',
      backgroundColor: '#0c0c0c',
      buttonStyle: 'rounded',
      fontFamily: 'Playfair Display',
      bodyFontFamily: 'Inter',
      isDark: true,
      borderRadius: '8px'
    }).save();

    // 3. Seed SEO
    await new SEO({
      title: 'L’Étoile Dorée | Premium Fine Dining Restaurant NYC',
      metaDescription: 'Experience culinary excellence at L’Étoile Dorée, NYC’s premier Michelin-starred dining destination. Book your table for a memorable culinary journey.',
      keywords: 'letoile doree, michelin star nyc, fine dining new york, luxury restaurant, wagyu beef, table reservation',
      ogImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      favicon: '/favicon.ico'
    }).save();

    // 4. Seed Settings
    await new Setting({
      name: 'L’Étoile Dorée',
      logo: '',
      tagline: 'Fine Dining & Exquisite Culinary Art',
      description: 'Awarded three Michelin stars, L’Étoile Dorée offers an unmatched sensory journey, blending classical French techniques with modern flavor profiles in a stunning, luxury atmosphere.',
      address: '123 Michelin Avenue, Gourmet District, NY 10001',
      phone: '+1 (555) 123-4567',
      whatsapp: '+15551234567',
      email: 'reservations@letoiledoree.com',
      googleMapsLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4282570058306!2d-73.985428!3d40.748440!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus',
      googleReviewRating: 4.9,
      totalReviews: 1482,
      priceRange: '₹₹₹₹',
      currency: '₹',
      workingHours: [
        { day: 'Monday - Thursday', hours: '5:00 PM - 10:30 PM' },
        { day: 'Friday - Saturday', hours: '4:30 PM - 11:30 PM' },
        { day: 'Sunday Brunch', hours: '11:00 AM - 3:00 PM' }
      ]
    }).save();

    // 5. Seed Hero
    await new Hero({
      backgroundImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920&auto=format&fit=crop',
      restaurantName: 'L’Étoile Dorée',
      mainHeading: 'A Symphony of Flavors on Every Plate',
      subHeading: 'Indulge in an extraordinary fine-dining experience curated by world-class chefs, set in the heart of Manhattan.',
      primaryBtnText: 'Reserve A Table',
      primaryBtnLink: '#reservation',
      secondaryBtnText: 'View Menu',
      secondaryBtnLink: '#menu',
      badgeText: '★ THREE MICHELIN STARS 2026',
      isOpenStatus: true,
      animationStyle: 'fade'
    }).save();

    // 6. Seed About
    await new About({
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop',
      title: 'Our Journey of Taste & Elegance',
      description: 'Established in 2012, L’Étoile Dorée started as a modest vision to bring authentic, high-concept French cooking to NYC. Today, led by Executive Chef Marcus Sterling, our kitchen is a laboratory of taste where local heritage ingredients are elevated to modern art pieces. Every plate is detailed, every wine pair curated, and every moment unforgettable.',
      experienceYears: 14,
      happyCustomers: '120k+',
      signatureDishesCount: 15,
      signatureDishesList: [
        'Truffle Butter Roasted Maine Lobster',
        'Pan-Seared A5 Wagyu Ribeye',
        'Aged Duck Breast with Honey-Cherry Gastrique'
      ]
    }).save();

    // 7. Seed Categories
    await new Category({ name: 'Appetizers', slug: 'appetizers' }).save();
    await new Category({ name: 'Mains', slug: 'mains' }).save();
    await new Category({ name: 'Desserts', slug: 'desserts' }).save();
    await new Category({ name: 'Fine Wines', slug: 'wines' }).save();

    // 8. Seed Menu Items
    await MenuItem.insertMany([
      {
        name: 'French Onion Soup Gratinée',
        description: 'Slow-caramelized sweet onions, rich beef consommé, aged Gruyère crust, sourdough crouton.',
        price: 22,
        images: ['https://images.unsplash.com/photo-1547592165-e1d17fed6006?q=80&w=600&auto=format&fit=crop'],
        category: 'Appetizers',
        isVeg: false,
        spicyLevel: 0,
        isPopular: true,
        isChefSpecial: false,
        isAvailable: true
      },
      {
        name: 'Escargots de Bourgogne',
        description: 'Wild Burgundy snails baked in rich garlic, herb, and French butter, served with warm brioche.',
        price: 26,
        images: ['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop'],
        category: 'Appetizers',
        isVeg: false,
        spicyLevel: 0,
        isPopular: false,
        isChefSpecial: true,
        isAvailable: true
      },
      {
        name: 'Heirloom Burrata',
        description: 'Creamy burrata, heirloom cherry tomatoes, cold-pressed basil olive oil, aged balsamic pearls, microgreens.',
        price: 24,
        images: ['https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop'],
        category: 'Appetizers',
        isVeg: true,
        spicyLevel: 0,
        isPopular: true,
        isChefSpecial: false,
        isAvailable: true
      },
      {
        name: 'Pan-Seared A5 Miyazaki Wagyu',
        description: '3oz A5 Wagyu beef, parsnip purée, wild chanterelle mushrooms, rosemary red wine reduction.',
        price: 95,
        images: ['https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop'],
        category: 'Mains',
        isVeg: false,
        spicyLevel: 0,
        isPopular: true,
        isChefSpecial: true,
        isAvailable: true
      },
      {
        name: 'Truffle Butter Roasted Lobster Tail',
        description: 'Butter-poached Maine lobster tail, saffron risotto, roasted asparagus, lemon-tarragon foam.',
        price: 68,
        images: ['https://images.unsplash.com/photo-1559742811-82428b49223e?q=80&w=600&auto=format&fit=crop'],
        category: 'Mains',
        isVeg: false,
        spicyLevel: 0,
        isPopular: true,
        isChefSpecial: true,
        isAvailable: true
      },
      {
        name: 'Forest Wild Mushroom Risotto',
        description: 'Creamy carnaroli rice, slow-cooked forest mushrooms, white truffle oil, shaved 24-month Parmigiano-Reggiano.',
        price: 42,
        images: ['https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop'],
        category: 'Mains',
        isVeg: true,
        spicyLevel: 0,
        isPopular: false,
        isChefSpecial: false,
        isAvailable: true
      },
      {
        name: 'Grand Marnier Chocolate Soufflé',
        description: 'Dark Belgian chocolate soufflé, Grand Marnier liqueur, dark chocolate sauce, Madagascar vanilla bean gelato.',
        price: 18,
        images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop'],
        category: 'Desserts',
        isVeg: true,
        spicyLevel: 0,
        isPopular: true,
        isChefSpecial: true,
        isAvailable: true
      },
      {
        name: 'Tahitian Vanilla Bean Crème Brûlée',
        description: 'Rich custard base flavored with Tahitian vanilla beans, topped with a layer of hardened caramelized sugar.',
        price: 16,
        images: ['https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=600&auto=format&fit=crop'],
        category: 'Desserts',
        isVeg: true,
        spicyLevel: 0,
        isPopular: false,
        isChefSpecial: false,
        isAvailable: true
      },
      {
        name: 'Château Margaux 2015',
        description: 'Exquisite Bordeaux wine with deep berry notes, velvet tannins, and a long, complex finish.',
        price: 180,
        images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop'],
        category: 'Fine Wines',
        isVeg: true,
        spicyLevel: 0,
        isPopular: true,
        isChefSpecial: true,
        isAvailable: true
      }
    ]);

    // 9. Seed Chefs
    await Chef.insertMany([
      {
        name: 'Chef Marcus Sterling',
        position: 'Executive Chef / Owner',
        description: 'With over 20 years in Michelin-starred kitchens across Paris and New York, Chef Marcus balances visual art with culinary precision.',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop',
        socialLinks: { instagram: '@marcus_sterling', facebook: 'marcus.sterling' }
      },
      {
        name: 'Elena Rostova',
        position: 'Head Pastry Chef',
        description: 'Elena transforms chocolates and pastries into three-dimensional sculptures. Her desserts are legendary sweet endings.',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop',
        socialLinks: { instagram: '@elena_pastries' }
      }
    ]);

    // 10. Seed Testimonials
    await Testimonial.insertMany([
      {
        name: 'Charlotte Dubois',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
        review: 'The Truffle Lobster was absolutely sublime. The service was impeccable—each course was timed to absolute perfection. A masterpiece of a restaurant!',
        rating: 5
      },
      {
        name: 'David Vance',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
        review: 'Simply the best Wagyu in NYC. The atmosphere feels so private and luxurious, and the custom golden theme matches the gold standards of food they serve.',
        rating: 5
      },
      {
        name: 'Sophia Martinez',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
        review: 'The chocolate soufflé alone is worth coming back for! Incredible attention to detail in every single element of the experience.',
        rating: 5
      }
    ]);

    // 11. Seed Gallery
    await Gallery.insertMany([
      { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop' }
    ]);

    // 12. Seed Offers
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    await new Offer({
      title: 'Romantic Evening Package',
      discountText: 'Free Champagne Bottle',
      couponCode: 'CHAMPAGNE2026',
      description: 'Book a table for two on a Friday or Saturday night and receive a complimentary bottle of our finest vintage champagne.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
      startDate: new Date(),
      endDate: oneMonthFromNow,
      isActive: true
    }).save();

    console.log('Database successfully auto-seeded!');
  } catch (error) {
    console.error(`Error in auto-seeding database: ${error.message}`);
  }
};
