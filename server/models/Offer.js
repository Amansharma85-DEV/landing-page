import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Exclusive Culinary Offer'
    },
    discountText: {
      type: String,
      required: true,
      default: '20% OFF'
    },
    couponCode: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: 'Enjoy an exclusive discount on our premium chef specials.'
    },
    image: {
      type: String,
      default: '' // Cloudinary URL for offer banner
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Offer', OfferSchema);
