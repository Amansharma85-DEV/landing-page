import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: '' // Cloudinary URL
    },
    title: {
      type: String,
      default: 'Crafting Culinary Memories Since 2012'
    },
    description: {
      type: String,
      default: 'Every dish we serve is a story of passion, precision, and the finest local produce. Our team of world-class chefs works tirelessly to push the boundaries of modern gastronomy, while respecting the age-old culinary traditions that ground us. We believe dining is not just about eating; it is an immersive sensory performance.'
    },
    experienceYears: {
      type: Number,
      default: 14
    },
    happyCustomers: {
      type: String,
      default: '150k+'
    },
    signatureDishesCount: {
      type: Number,
      default: 25
    },
    signatureDishesList: {
      type: [String],
      default: ['Truffle Butter Roasted Lobster', 'Pan-Seared Wagyu Ribeye', 'Saffron Infused Risotto']
    }
  },
  { timestamps: true }
);

export default mongoose.model('About', AboutSchema);
