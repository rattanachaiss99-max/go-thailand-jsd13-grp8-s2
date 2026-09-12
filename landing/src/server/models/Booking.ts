import { Schema, model, models, Document, Model } from 'mongoose';

// ============================================================================
// Booking Model — Go Thailand Shared Service
// Tracks bookings and completed travel for unlocking passport trophies & stamps
// ============================================================================

export interface IBookingItem {
  title: string;
  category: 'tour' | 'hotel' | 'guide' | 'car' | 'package';
  location?: string;
  province: string; // Province ID or slug (e.g. 'chiang-mai', 'phuket', 'nan')
  pickupDate?: string;
  returnDate?: string;
  pricePerUnit: number;
  quantity: number;
  imageUrl?: string;
}

export interface IBookingPricing {
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
}

export interface ICustomerContact {
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface IBooking extends Document {
  bookingReference: string; // e.g. "GT202609-8812"
  userId: string;          // Customer User ID
  customerInfo: ICustomerContact;
  item: IBookingItem;
  province: string;        // Normalized province slug (e.g. 'chiang-mai')
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  pricing: IBookingPricing;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    customerInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      specialRequests: { type: String, default: '' }
    },
    item: {
      title: { type: String, required: true },
      category: {
        type: String,
        enum: ['tour', 'hotel', 'guide', 'car', 'package'],
        default: 'tour'
      },
      location: { type: String, default: '' },
      province: { type: String, required: true },
      pickupDate: { type: String, default: '' },
      returnDate: { type: String, default: '' },
      pricePerUnit: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      imageUrl: { type: String, default: '' }
    },
    province: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid'
    },
    pricing: {
      subtotal: { type: Number, required: true },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      currency: { type: String, default: 'THB' }
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true, collection: 'bookings' }
);

export const Booking: Model<IBooking> = models.Booking || model<IBooking>('Booking', bookingSchema);
export default Booking;
