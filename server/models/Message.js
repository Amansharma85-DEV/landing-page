import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['contact', 'newsletter'],
      required: true,
      default: 'contact'
    },
    name: {
      type: String,
      trim: true,
      required: function() { return this.type === 'contact'; }
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true,
      required: function() { return this.type === 'contact'; }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Message', MessageSchema);
