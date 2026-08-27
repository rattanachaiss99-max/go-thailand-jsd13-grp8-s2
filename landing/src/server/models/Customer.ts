import { Schema, model, models, Document, Model } from 'mongoose';
import User, { IUser } from './User';

// ============================================================================
// Customer — traveler who books tours / stays / packages.
// Extends the base User via discriminator, adding loyalty fields.
// ============================================================================

export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface ICoupon {
  code: string;
  description?: string;
  discountPercent?: number;
  expiresAt?: Date;
}

export interface ICustomer extends IUser {
  role: 'customer';
  membershipTier: MembershipTier;
  points: number; // loyalty points
  coupons: ICoupon[];
  // Travel preferences (GT-profile)
  preferredLanguage: string; // e.g. "th", "en"
  preferredCountry?: string;
  // Booking history is referenced from the bookings collection, kept lightweight here.
  bookingCount: number;
  wishlist?: string[]; // product/tour ids
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, uppercase: true },
    description: { type: String },
    discountPercent: { type: Number, min: 0, max: 100 },
    expiresAt: { type: Date }
  },
  { _id: false }
);

const customerSchema = new Schema<ICustomer>(
  {
    membershipTier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
    points: { type: Number, default: 0, min: 0 },
    coupons: { type: [couponSchema], default: [] },
    preferredLanguage: { type: String, default: 'th' },
    preferredCountry: { type: String },
    bookingCount: { type: Number, default: 0, min: 0 },
    wishlist: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Customer: Model<ICustomer> = models.Customer || User.discriminator<ICustomer>('customer', customerSchema);
export default Customer;
