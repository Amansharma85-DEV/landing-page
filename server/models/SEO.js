import mongoose from 'mongoose';

const SEOSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'L’Étoile Dorée | Premium Fine Dining Restaurant NYC'
    },
    metaDescription: {
      type: String,
      default: 'Book your table at NYC’s premiere fine-dining establishment. Enjoy exquisite French-modern cuisine crafted by Michelin-starred culinary artists in a luxury setting.'
    },
    keywords: {
      type: String,
      default: 'restaurant, fine dining, new york, michelin star, luxury, gourmet, Letoile Doree, book table, reservation'
    },
    ogImage: {
      type: String,
      default: '' // Cloudinary URL or local image
    },
    favicon: {
      type: String,
      default: '' // Path or URL to icon
    }
  },
  { timestamps: true }
);

export default mongoose.model('SEO', SEOSchema);
