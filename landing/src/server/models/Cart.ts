import { Schema, model, models, Document, Model, Types } from 'mongoose';

// ============================================================================
// Cart Model — User Shopping Cart (Sprint 2 Task 6 & Task 7)
// ============================================================================

export interface ICartItem {
  _id?: Types.ObjectId | string;
  productId: Types.ObjectId | string;
  name: string;
  price: number;
  quantity: number;
  date?: Date;
  tag?: string;
  imageUrl?: string;
}

export interface ICart extends Document {
  userRef: string; // User ID string or ObjectId string (can support guest sessionId too)
  items: ICartItem[];
  status: 'active' | 'completed' | 'abandoned';
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    date: {
      type: Date
    },
    tag: {
      type: String,
      default: 'ทัวร์'
    },
    imageUrl: {
      type: String
    }
  },
  { timestamps: true }
);

const cartSchema = new Schema<ICart>(
  {
    userRef: {
      type: String,
      required: true,
      index: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active'
    }
  },
  { timestamps: true, collection: 'carts' }
);

export const Cart: Model<ICart> = models.Cart || model<ICart>('Cart', cartSchema);
export default Cart;
