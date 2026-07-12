import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema(
  {
    backgroundImage: {
      type: String,
      default: '' // Cloudinary URL
    },
    restaurantName: {
      type: String,
      default: 'L’Étoile Dorée'
    },
    mainHeading: {
      type: String,
      default: 'A Symphony of Flavors on Every Plate'
    },
    subHeading: {
      type: String,
      default: 'Indulge in our exquisite Michelin-star menu curated by Chef de Cuisine Marcus Sterling.'
    },
    primaryBtnText: {
      type: String,
      default: 'Book A Table'
    },
    primaryBtnLink: {
      type: String,
      default: '#reservation'
    },
    secondaryBtnText: {
      type: String,
      default: 'Explore Menu'
    },
    secondaryBtnLink: {
      type: String,
      default: '#menu'
    },
    badgeText: {
      type: String,
      default: 'Welcome to Gastronomy Excellence'
    },
    isOpenStatus: {
      type: Boolean,
      default: true
    },
    animationStyle: {
      type: String,
      enum: ['fade', 'slide-up', 'zoom-in'],
      default: 'fade'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Hero', HeroSchema);
