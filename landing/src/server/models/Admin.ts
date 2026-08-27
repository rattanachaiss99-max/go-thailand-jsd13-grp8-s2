import { Schema, model, models, Document, Model } from 'mongoose';
import User, { IUser } from './User';

// ============================================================================
// Admin — platform owner / manager who manages products, bookings, users.
// Extends the base User via discriminator.
// ============================================================================

export type AdminLevel = 'super' | 'manager' | 'staff';

export interface IAdmin extends IUser {
  role: 'admin';
  adminLevel: AdminLevel;
  permissions: string[]; // e.g. ["product:write", "user:read"]
  managedCategories?: string[]; // product categories they oversee
}

const adminSchema = new Schema<IAdmin>(
  {
    adminLevel: { type: String, enum: ['super', 'manager', 'staff'], default: 'staff' },
    permissions: { type: [String], default: [] },
    managedCategories: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> = models.Admin || User.discriminator<IAdmin>('admin', adminSchema);
export default Admin;
