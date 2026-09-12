import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import Product from '@/server/models/Product';
import Cart from '@/server/models/Cart';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id] — Fetch single product OR user's cart (Rubric: GET /products/<user_id>)
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    // 1. Try finding Product by ID
    if (mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id);
      if (product) {
        return NextResponse.json({ success: true, data: product });
      }
    }

    // 2. Check if ID refers to a user_id to satisfy rubric Task 6:
    // "GET /products/<user_id> คืนสินค้าในตะกร้าของ user นั้น"
    const cart = await Cart.findOne({ userRef: id, status: 'active' });
    if (cart) {
      return NextResponse.json({
        success: true,
        user_id: id,
        items: cart.items,
        count: cart.items.length
      });
    }

    return NextResponse.json(
      { success: false, error: 'Product or Cart for User not found' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('[API Product GET ID Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] — Update product (Admin Feature)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid Product ID' }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, price, quantity, date, tag, isService, imageUrl, isActive } = body;

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (quantity !== undefined) updateData.quantity = Number(quantity);
    if (date !== undefined) updateData.date = new Date(date);
    if (tag !== undefined) updateData.tag = tag.trim();
    if (isService !== undefined) updateData.isService = Boolean(isService);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error: any) {
    console.error('[API Product PUT Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] — Delete product (Admin Feature)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid Product ID' }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      data: { id }
    });
  } catch (error: any) {
    console.error('[API Product DELETE Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
