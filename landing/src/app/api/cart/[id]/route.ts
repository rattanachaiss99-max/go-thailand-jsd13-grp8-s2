import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import Cart from '@/server/models/Cart';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function getUserRef(req: NextRequest): string {
  const { searchParams } = new URL(req.url);
  const paramUser = searchParams.get('user_id');
  if (paramUser) return paramUser;

  const headerUser = req.headers.get('x-user-id');
  if (headerUser) return headerUser;

  return 'guest-user-default';
}

// PUT /api/cart/[id] — Update item quantity in cart (Task 6)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id: itemId } = await params;
    const body = await req.json();
    const { quantity, user_id } = body;

    const userRef = user_id || getUserRef(req);

    if (quantity === undefined || Number(quantity) < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1 (จำนวนต้องมีอย่างน้อย 1 ชิ้น)' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userRef, status: 'active' });
    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    // Find item by item._id or productId
    const item = cart.items.find(
      (item) => item._id?.toString() === itemId || item.productId?.toString() === itemId
    );

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    item.quantity = Number(quantity);
    await cart.save();

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully',
      items: cart.items,
      count: cart.items.length,
      totalAmount
    });
  } catch (error: any) {
    console.error('[API Cart PUT Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] — Remove item from cart (Task 6)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id: itemId } = await params;
    const userRef = getUserRef(req);

    const cart = await Cart.findOne({ userRef, status: 'active' });
    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item._id?.toString() !== itemId && item.productId?.toString() !== itemId
    );

    if (cart.items.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    await cart.save();

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      items: cart.items,
      count: cart.items.length,
      totalAmount
    });
  } catch (error: any) {
    console.error('[API Cart DELETE Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
