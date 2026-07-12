import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    images: {
      type: [String],
      default: [] // Array of image URLs (Cloudinary/local)
    },
    category: {
      type: String, // Matches the Category name or slug
      required: true
    },
    isVeg: {
      type: Boolean,
      default: false
    },
    spicyLevel: {
      type: Number,
      default: 0, // 0 = Not spicy, 1 = Mild, 2 = Medium, 3 = Hot
      min: 0,
      max: 3
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isChefSpecial: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', MenuItemSchema);
