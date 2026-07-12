import mongoose from 'mongoose';

const ChefSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      default: 'Executive Chef'
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: '' // Cloudinary URL
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Chef', ChefSchema);
