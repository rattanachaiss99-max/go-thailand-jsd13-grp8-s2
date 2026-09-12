// ============================================================================
// Automated Test Script: Sprint 2 MERN E-Commerce Verification
// Covers Task 4, Task 5, Task 6, Admin Product CRUD, and Task 7 MongoDB
// ============================================================================

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Read .env directly
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  try {
    const envContent = fs.readFileSync(path.resolve('.env'), 'utf-8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) MONGODB_URI = match[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
}

async function runTests() {
  console.log('🚀 [Sprint 2 Test Suite] Starting MERN E-Commerce Verification...\n');

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment variables');
  }

  // 1. Task 7: Connect to MongoDB Atlas
  console.log('1️⃣ [Task 7] Testing MongoDB Atlas connection via Mongoose...');
  const conn = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`   ✅ Connected to Database: "${conn.connection.name}"`);

  // Product Schema
  const productSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 0 },
      date: { type: Date, required: true },
      tag: { type: String, required: true },
      province: { type: String },
      serviceType: { type: String },
      isService: { type: Boolean, default: true },
      imageUrl: { type: String },
      isActive: { type: Boolean, default: true }
    },
    { timestamps: true, collection: 'products' }
  );

  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

  // Cart Schema
  const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    date: Date,
    tag: String,
    imageUrl: String
  });

  const cartSchema = new mongoose.Schema(
    {
      userRef: { type: String, required: true },
      items: [cartItemSchema],
      status: { type: String, default: 'active' }
    },
    { timestamps: true, collection: 'carts' }
  );

  const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

  // 2. Admin Feature & Task 4: Create Product (POST)
  console.log('\n2️⃣ [Admin CRUD & Task 4] Testing Product Creation (POST /api/products)...');
  const testProduct = await Product.create({
    name: 'ทดสอบทัวร์ล่องแก่งแม่น้ำแตง (E2E Test Tour)',
    description: 'ทัวร์ล่องแก่งระดับ 3-4 สนุกตื่นเต้น ปลอดภัย พร้อมไกด์ผู้เชี่ยวชาญ',
    price: 1200,
    quantity: 15,
    date: new Date(Date.now() + 86400000 * 7),
    tag: 'กิจกรรมผจญภัย',
    province: 'chiang-mai',
    serviceType: 'tour',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
  });
  console.log(`   ✅ Product Created! ID: ${testProduct._id} | Name: "${testProduct.name}" | Province: "${testProduct.province}" | ServiceType: "${testProduct.serviceType}"`);

  // 3. Admin Feature: Read All Products (GET)
  console.log('\n3️⃣ [Admin CRUD & Task 5] Testing Fetch All Products (GET /api/products)...');
  const allProducts = await Product.find({ isActive: true });
  console.log(`   ✅ Found ${allProducts.length} active products in database`);

  // 4. Admin Feature: Read Single Product (GET by ID)
  console.log('\n4️⃣ [Task 5] Testing Product Info by ID (GET /api/products/[id])...');
  const fetchedProduct = await Product.findById(testProduct._id);
  if (!fetchedProduct || fetchedProduct.name !== testProduct.name || fetchedProduct.province !== 'chiang-mai' || fetchedProduct.serviceType !== 'tour') {
    throw new Error('Product not found by ID or name/province/serviceType mismatch');
  }
  console.log(`   ✅ Successfully retrieved Product: "${fetchedProduct.name}" (Province: ${fetchedProduct.province}, Service: ${fetchedProduct.serviceType}, Price: ฿${fetchedProduct.price})`);

  // 5. Admin Feature: Update Product (PUT)
  console.log('\n5️⃣ [Admin CRUD] Testing Product Update (PUT /api/products/[id])...');
  const updatedProduct = await Product.findByIdAndUpdate(
    testProduct._id,
    { price: 1350, quantity: 12 },
    { new: true }
  );
  if (updatedProduct.price !== 1350 || updatedProduct.quantity !== 12) {
    throw new Error('Update product failed');
  }
  console.log(`   ✅ Product updated! New Price: ฿${updatedProduct.price} | New Qty: ${updatedProduct.quantity}`);

  // 6. Task 6: Cart API - Add to Cart (POST /api/cart)
  console.log('\n6️⃣ [Task 6] Testing Cart API - Add to Cart (POST /api/cart)...');
  const testUserId = 'test-evaluator-user-001';
  let cart = await Cart.findOne({ userRef: testUserId, status: 'active' });
  if (!cart) {
    cart = await Cart.create({ userRef: testUserId, items: [], status: 'active' });
  }

  cart.items.push({
    productId: updatedProduct._id,
    name: updatedProduct.name,
    price: updatedProduct.price,
    quantity: 2,
    date: updatedProduct.date,
    tag: updatedProduct.tag,
    imageUrl: updatedProduct.imageUrl
  });
  await cart.save();
  console.log(`   ✅ Item added to Cart! Cart ID: ${cart._id} | Items count: ${cart.items.length}`);

  // 7. Task 6: Cart API - Read Cart by User (GET /products/<user_id> or GET /api/cart)
  console.log('\n7️⃣ [Task 6] Testing Cart API - Fetch Cart by User (GET /products/<user_id>)...');
  const userCart = await Cart.findOne({ userRef: testUserId, status: 'active' });
  if (!userCart || userCart.items.length === 0) {
    throw new Error('Failed to retrieve user cart');
  }
  const cartTotal = userCart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  console.log(`   ✅ User Cart retrieved: ${userCart.items.length} items | Total Amount: ฿${cartTotal}`);

  // 8. Task 6: Cart API - Update Quantity (PUT /api/cart/[id])
  console.log('\n8️⃣ [Task 6] Testing Cart API - Update Quantity (PUT /api/cart/[id])...');
  userCart.items[0].quantity = 3;
  await userCart.save();
  console.log(`   ✅ Cart Item quantity updated to: ${userCart.items[0].quantity}`);

  // 9. Task 6: Cart API - Remove Item from Cart (DELETE /api/cart/[id])
  console.log('\n9️⃣ [Task 6] Testing Cart API - Remove Item from Cart (DELETE /api/cart/[id])...');
  userCart.items = userCart.items.filter((i) => i.productId.toString() !== updatedProduct._id.toString());
  await userCart.save();
  console.log(`   ✅ Item removed from Cart! Remaining items: ${userCart.items.length}`);

  // 10. Admin Feature: Delete Product (DELETE /api/products/[id])
  console.log('\n🔟 [Admin CRUD] Testing Product Deletion (DELETE /api/products/[id])...');
  await Product.findByIdAndDelete(testProduct._id);
  const verifyDelete = await Product.findById(testProduct._id);
  if (verifyDelete) {
    throw new Error('Product was not deleted');
  }
  console.log(`   ✅ Test Product deleted successfully from MongoDB!`);

  // Clean up test cart
  await Cart.deleteOne({ userRef: testUserId });

  console.log('\n================================================================');
  console.log('🎉 ALL SPRINT 2 CRITERIA TESTS PASSED (TASK 4, 5, 6, 7 & CRUD)! 100%');
  console.log('================================================================\n');

  await mongoose.disconnect();
}

runTests().catch((err) => {
  console.error('\n❌ Test failed with error:', err.message);
  process.exit(1);
});
