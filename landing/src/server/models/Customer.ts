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

export interface IFeedback {
  rating: number; // 1-5 stars
  comment?: string;
  topic?: string; // e.g. "ทัวร์เชียงใหม่", "แอป", "เว็บ"
  createdAt?: Date;
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
  // Feedback left by the user (reviews, suggestions)
  feedbacks: IFeedback[];
  // Free-form bucket for future data points without schema changes:
  // user.metadata.set('favoriteRegion', 'ภาคเหนือ') / ('newsletterOptIn', true)
  metadata: Map<string, any>;
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
    wishlist: { type: [String], default: [] },
    // User feedback / reviews
    feedbacks: [
      {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        topic: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    // Flexible bucket for any future data points without schema changes.
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const Customer: Model<ICustomer> = models.Customer || User.discriminator<ICustomer>('customer', customerSchema);
export default Customer;
