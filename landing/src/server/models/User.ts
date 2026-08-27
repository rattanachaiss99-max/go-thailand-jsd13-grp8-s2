import { Schema, model, models, Document, Model } from 'mongoose';

// ============================================================================
// User — base schema for the Go Thailand travel e-commerce platform.
// Uses Mongoose Discriminators so Customer and Admin share one collection
// (`users`) but carry different fields.
// ============================================================================

export type UserRole = 'customer' | 'admin';

export interface IAddress {
  label?: string; // e.g. "บ้าน", "ที่ทำงาน"
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2, default "TH"
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  firebaseUid?: string; // linked when using Firebase Auth
  emailVerified: boolean;
  isActive: boolean;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    province: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, default: 'TH', uppercase: true }
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'admin'], required: true, default: 'customer' },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    avatarUrl: { type: String },
    firebaseUid: { type: String, index: true, sparse: true },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    addresses: { type: [addressSchema], default: [] }
  },
  { timestamps: true, discriminatorKey: 'role', collection: 'users' }
);

// Avoid model re-compilation during dev hot reload.
export const User: Model<IUser> = models.User || model<IUser>('User', userSchema);
export default User;
