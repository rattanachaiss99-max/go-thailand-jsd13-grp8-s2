const mongoose = require('mongoose');
const User = require('./User');

const customerSchema = new mongoose.Schema(
  {
    membershipTier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
    points: { type: Number, default: 0 },
    bookingCount: { type: Number, default: 0 },
    wishlist: [{ type: String }],
    preferredLanguage: { type: String, default: 'th' },
    coupons: [
      {
        code: { type: String, uppercase: true },
        description: { type: String },
        discountPercent: { type: Number },
        expiresAt: { type: Date }
      }
    ]
  },
  { timestamps: true }
);

module.exports = User.discriminator('customer', customerSchema);
