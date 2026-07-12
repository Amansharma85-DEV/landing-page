import mongoose from 'mongoose';

const WorkingHourSchema = new mongoose.Schema({
  day: { type: String, required: true },
  hours: { type: String, required: true }
}, { _id: false });

const SettingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'L’Étoile Dorée'
    },
    logo: {
      type: String,
      default: '' // Cloudinary URL
    },
    tagline: {
      type: String,
      default: 'Fine Dining & Exquisite Culinary Art'
    },
    description: {
      type: String,
      default: 'Experience a culinary journey featuring the finest ingredients, hand-picked herbs, and masterfully crafted dishes in an atmosphere of pure luxury.'
    },
    address: {
      type: String,
      default: '123 Michelin Avenue, Gourmet District, NY 10001'
    },
    phone: {
      type: String,
      default: '+1 (555) 123-4567'
    },
    whatsapp: {
      type: String,
      default: '+15551234567'
    },
    email: {
      type: String,
      default: 'reservations@letoiledoree.com'
    },
    googleMapsLink: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4282570058306!2d-73.985428!3d40.748440!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus'
    },
    workingHours: {
      type: [WorkingHourSchema],
      default: [
        { day: 'Monday - Friday', hours: '12:00 PM - 11:00 PM' },
        { day: 'Saturday - Sunday', hours: '10:00 AM - 11:30 PM' }
      ]
    },
    googleReviewRating: {
      type: Number,
      default: 4.9
    },
    totalReviews: {
      type: Number,
      default: 1248
    },
    priceRange: {
      type: String,
      default: '$$$$'
    },
    currency: {
      type: String,
      default: '₹'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', SettingSchema);
