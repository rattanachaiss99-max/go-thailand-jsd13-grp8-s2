import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import Cart from '@/server/models/Cart';
import Product from '@/server/models/Product';

// Helper to determine userRef from header or query param
function getUserRef(req: NextRequest): string {
  const { searchParams } = new URL(req.url);
  const paramUser = searchParams.get('user_id');
  if (paramUser) return paramUser;

  const headerUser = req.headers.get('x-user-id');
  if (headerUser) return headerUser;

  // Default guest session identifier if unauthenticated
  return 'guest-user-default';
}

// GET /api/cart — Fetch items in user's cart (Task 6)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userRef = getUserRef(req);

    let cart = await Cart.findOne({ userRef, status: 'active' });
    if (!cart) {
      cart = await Cart.create({ userRef, items: [], status: 'active' });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      success: true,
      user_id: userRef,
      cart_id: cart._id,
      items: cart.items,
      count: cart.items.length,
      totalAmount
    });
  } catch (error: any) {
    console.error('[API Cart GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart — Add product to cart (Task 6)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, quantity = 1, user_id } = body;

    const userRef = user_id || getUserRef(req);

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required (กรุณาระบุรหัสสินค้า)' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found (ไม่พบสินค้านี้ในระบบ)' },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ userRef, status: 'active' });
    if (!cart) {
      cart = await Cart.create({ userRef, items: [], status: 'active' });
    }

    // Check if product already in cart
    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      // Increment quantity
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      // Append new item to cart
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: Number(quantity),
        date: product.date,
        tag: product.tag,
        imageUrl: product.imageUrl
      });
    }

    await cart.save();

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json(
      {
        success: true,
        message: 'Item added to cart successfully',
        cart_id: cart._id,
        items: cart.items,
        count: cart.items.length,
        totalAmount
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API Cart POST Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
