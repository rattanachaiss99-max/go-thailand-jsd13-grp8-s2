import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/server/db';
import Product from '@/server/models/Product';

// Seed sample products if database collection is empty
const SEED_PRODUCTS = [
  {
    name: 'แพ็กเกจทัวร์เกาะพีพี & อ่าวมาหยา 1 วัน (เรือสปีดโบ๊ท VIP)',
    description: 'สัมผัสน้ำทะเลใส หาดทรายขาว อ่าวมาหยา และดำน้ำชมปะการัง พร้อมอาหารกลางวันบุฟเฟต์และอุปกรณ์ดำน้ำครบครัน',
    price: 1890,
    quantity: 30,
    date: new Date(Date.now() + 86400000 * 7),
    tag: 'ทัวร์ทางทะเล',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    name: 'ทัวร์ดอยอินทนนท์ ชมพระอาทิตย์ขึ้น & กิ่วแม่ปาน เชียงใหม่',
    description: 'ชมจุดสูงสุดแดนสยาม สัมผัสอากาศหนาว เดินเส้นทางศึกษาธรรมชาติกิ่วแม่ปาน พร้อมไกด์ท้องถิ่นดูแลตลอดทริป',
    price: 1450,
    quantity: 20,
    date: new Date(Date.now() + 86400000 * 10),
    tag: 'ภูเขาและธรรมชาติ',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    name: 'แพ็กเกจเรียนดำน้ำลึก Scuba Diving Open Water เกาะเต่า',
    description: 'คอร์สเรียนดำน้ำลึกมาตรฐานสากล PADI 3 วัน 2 คืน รวมที่พัก บัตรดำน้ำ และอุปกรณ์ครบชุด',
    price: 9900,
    quantity: 10,
    date: new Date(Date.now() + 86400000 * 14),
    tag: 'กิจกรรมผจญภัย',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    name: 'บริการรถตู้ VIP พาเที่ยวพระนครศรีอยุธยา พร้อมคนขับมืออาชีพ',
    description: 'เที่ยวชมวัดมหาธาตุ วัดพระศรีสรรเพชญ์ ชิมโรตีสายไหมเจ้าดัง แบบส่วนตัว 1 วันเต็ม รองรับสูงสุด 9 ที่นั่ง',
    price: 2500,
    quantity: 15,
    date: new Date(Date.now() + 86400000 * 5),
    tag: 'บริการเดินทาง',
    isService: true,
    imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&auto=format&fit=crop&q=80',
    isActive: true
  }
];

// GET /api/products — Fetch all products (Admin & User catalog)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const isService = searchParams.get('isService');
    const province = searchParams.get('province');
    const serviceType = searchParams.get('serviceType');

    // Auto-seed if empty so reviewers have test data immediately
    const totalCount = await Product.countDocuments();
    if (totalCount === 0) {
      await Product.insertMany(SEED_PRODUCTS);
    }

    const filter: Record<string, any> = { isActive: true };
    if (tag && tag !== 'ทั้งหมด') {
      filter.tag = tag;
    }
    if (isService !== null && isService !== undefined && isService !== '') {
      filter.isService = isService === 'true';
    }
    if (province && province !== 'all') {
      filter.province = province;
    }
    if (serviceType && serviceType !== 'all') {
      filter.serviceType = serviceType;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { province: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    console.error('[API Products GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products — Create new product (Admin CRUD Task 4 Validation)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, description, price, quantity, date, tag, isService, imageUrl, province, serviceType } = body;

    // Strict Form Validation per Task 4
    const errors: Record<string, string> = {};
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      errors.name = 'กรุณาระบุชื่อสินค้าอย่างน้อย 3 ตัวอักษร (Name is required)';
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      errors.description = 'กรุณาระบุคำอธิบายสินค้า/บริการ (Description is required)';
    }
    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
      errors.price = 'กรุณาระบุราคาที่ถูกต้องและไม่ติดลบ (Price must be >= 0)';
    }
    if (quantity === undefined || quantity === null || isNaN(Number(quantity)) || Number(quantity) < 0) {
      errors.quantity = 'กรุณาระบุจำนวนสินค้าที่ถูกต้องและไม่ติดลบ (Quantity must be >= 0)';
    }
    if (!date) {
      errors.date = 'กรุณาระบุวันที่จัดกิจกรรมหรือการเดินทาง (Date is required)';
    }
    if (!tag || typeof tag !== 'string' || !tag.trim()) {
      errors.tag = 'กรุณาระบุหมวดหมู่หรือแท็กสินค้า (Tag is required)';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors
        },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
      date: new Date(date),
      tag: tag.trim(),
      province: province?.trim() || 'chiang-mai',
      serviceType: serviceType?.trim() || 'tour',
      isService: isService !== undefined ? Boolean(isService) : true,
      imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      isActive: true
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: newProduct
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API Products POST Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
