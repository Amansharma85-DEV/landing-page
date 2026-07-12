import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String, // Cloudinary identifier, if using Cloudinary
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', GallerySchema);
