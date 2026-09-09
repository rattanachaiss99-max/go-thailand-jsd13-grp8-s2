import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // ข้อมูลรถและทริป (จาก BookingSummary)
  carName:       { type: String, default: "Toyota Fortuner" },
  carImage:      { type: String, default: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=240" },
  carDetails:    { type: String, default: "SUV · 7 Seats · Diesel" },
  carRating:     { type: String, default: "4.9" },
  pickupReturn:  { type: String, default: "Suvarnabhumi Airport (BKK), Bangkok" },
  dates:         { type: String, default: "Oct 15, 10:00 AM - Oct 18, 10:00 AM (3 Days)" },
  rentalPrice:   { type: Number, default: 7500 },
  serviceFee:    { type: Number, default: 0 },
  totalPrice:    { type: Number, default: 7500 },

  // Traveler Information (จาก TravelerSection)
  fullName:      { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, required: true },
  country:       { type: String, default: "United States" },

  // Driver Information (จาก DriverSection)
  driverName:     { type: String, required: true },
  licenseCountry: { type: String, default: "United States" },
  driverAge:      { type: String, required: true },
  licenseNumber:  { type: String, required: true },

  // Payment & Billing (จาก PaymentPanel & BillingSection)
  paymentMethod:  { type: String, enum: ['card', 'promptpay', 'bank'], default: 'card' },
  cardName:       { type: String },
  cardNumber:     { type: String },
  expiryDate:     { type: String },
  cvv:            { type: String },
  saveCard:       { type: Boolean, default: false },
  sameAsTraveler: { type: Boolean, default: true },
  termsAccepted:  { type: Boolean, required: true },

  status:         { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);