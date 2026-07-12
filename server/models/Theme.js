import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema(
  {
    primaryColor: {
      type: String,
      required: true,
      default: '#D4AF37' // Luxury Gold
    },
    secondaryColor: {
      type: String,
      required: true,
      default: '#1a1a1a' // Dark Gray
    },
    accentColor: {
      type: String,
      required: true,
      default: '#ffffff'
    },
    backgroundColor: {
      type: String,
      required: true,
      default: '#0a0a0a' // Sleek Black
    },
    buttonStyle: {
      type: String,
      enum: ['square', 'rounded', 'pill'],
      default: 'rounded'
    },
    fontFamily: {
      type: String,
      default: 'Playfair Display' // Elegant header font
    },
    bodyFontFamily: {
      type: String,
      default: 'Inter' // Highly legible body font
    },
    isDark: {
      type: Boolean,
      default: true
    },
    borderRadius: {
      type: String,
      default: '8px'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Theme', ThemeSchema);
