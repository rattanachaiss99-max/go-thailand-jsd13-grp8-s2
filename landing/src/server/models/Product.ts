import { Schema, model, models, Document, Model } from 'mongoose';

// ============================================================================
// Product Model — Go Thailand E-Commerce Platform (Sprint 2 Task 7)
// Meets all rubric fields: name, description, price, quantity, date, tag, isService
// ============================================================================

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  date: Date;
  tag: string;
  province?: string;
  serviceType?: string;
  isService: boolean;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'ชื่อสินค้า/บริการจำเป็นต้องกรอก (Name is required)'],
      trim: true,
      minlength: [3, 'ชื่อสินค้าต้องมีความยาวอย่างน้อย 3 ตัวอักษร']
    },
    description: {
      type: String,
      required: [true, 'คำอธิบายสินค้า/บริการจำเป็นต้องกรอก (Description is required)'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'ราคาจำเป็นต้องกรอก (Price is required)'],
      min: [0, 'ราคาต้องไม่ติดลบ (Price must be >= 0)']
    },
    quantity: {
      type: Number,
      required: [true, 'จำนวนสินค้าจำเป็นต้องกรอก (Quantity is required)'],
      min: [0, 'จำนวนสินค้าต้องไม่ติดลบ (Quantity must be >= 0)'],
      default: 1
    },
    date: {
      type: Date,
      required: [true, 'วันที่เดินทาง/จัดกิจกรรมจำเป็นต้องกรอก (Date is required)'],
      default: Date.now
    },
    tag: {
      type: String,
      required: [true, 'หมวดหมู่/แท็กจำเป็นต้องระบุ (Tag is required)'],
      trim: true,
      default: 'ทัวร์'
    },
    province: {
      type: String,
      trim: true,
      default: 'chiang-mai'
    },
    serviceType: {
      type: String,
      trim: true,
      default: 'tour'
    },
    isService: {
      type: Boolean,
      default: true // Default true for Go Thailand travel services
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, collection: 'products' }
);

// Prevent re-compilation during Next.js hot reloads
export const Product: Model<IProduct> = models.Product || model<IProduct>('Product', productSchema);
export default Product;
