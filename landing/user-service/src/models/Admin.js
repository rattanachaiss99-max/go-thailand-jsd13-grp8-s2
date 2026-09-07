const mongoose = require('mongoose');
const User = require('./User');

const adminSchema = new mongoose.Schema(
  {
    adminLevel: { type: String, enum: ['staff', 'manager', 'super'], default: 'staff' },
    permissions: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = User.discriminator('admin', adminSchema);
