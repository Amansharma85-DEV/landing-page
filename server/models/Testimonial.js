import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    photo: {
      type: String,
      default: '' // Cloudinary URL
    },
    review: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', TestimonialSchema);
