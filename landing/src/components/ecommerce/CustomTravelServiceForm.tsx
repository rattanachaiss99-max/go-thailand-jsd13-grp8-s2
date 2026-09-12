'use client';

// ============================================================================
// CustomTravelServiceForm.tsx — User-Facing Travel Service & Package Form
// ----------------------------------------------------------------------------
// Technical Skills — Task 4 (Form Validation):
// 1. Validates all fields on submit:
//    - Name (ชื่อสินค้า/บริการ)
//    - Description (คำอธิบาย)
//    - Price (งบประมาณ/ราคา)
//    - Quantity (จำนวนสิทธิ์/ผู้เดินทาง)
//    - Date (วันที่เดินทาง/จัดกิจกรรม)
//    - Tag (แท็ก/หมวดหมู่)
//    - Province (จังหวัดเป้าหมาย — 77 จังหวัด)
//    - Service Type (ประเภทบริการ: ที่พัก, รถเช่า, ไกด์, ทัวร์)
// 2. Meaningful error messages for each invalid field
// 3. Submits to POST /api/products, stores in MongoDB, updates CartContext
// ============================================================================

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { THAILAND_PROVINCES } from '@/data/thailandProvinces';
import { useCart } from '@/contexts/CartContext';

// ประเภทบริการท่องเที่ยว (Service Types)
const SERVICE_TYPES = [
  { value: 'stay', label: '🏠 ที่พัก / โฮมสเตย์ / รีสอร์ท (Accommodation)', defaultTag: 'ที่พักโฮมสเตย์' },
  { value: 'car', label: '🚗 รถเช่า / บริการรับส่งสนามบิน (Car Rental & Transport)', defaultTag: 'บริการเดินทาง' },
  { value: 'guide', label: '🧭 มัคคุเทศก์ / ไกด์ท้องถิ่น (Local Tour Guide)', defaultTag: 'ไกด์นำเที่ยว' },
  { value: 'tour', label: '🛶 ทัวร์ชุมชน & กิจกรรมท่องเที่ยว (Tours & Activities)', defaultTag: 'ทัวร์และกิจกรรม' }
];

// หมวดหมู่แท็กแนะนำ
const POPULAR_TAGS = [
  'ที่พักโฮมสเตย์',
  'บริการเดินทาง',
  'ไกด์นำเที่ยว',
  'ทัวร์และกิจกรรม',
  'ทัวร์ทางทะเล',
  'ภูเขาและธรรมชาติ',
  'กิจกรรมผจญภัย',
  'วัฒนธรรมและประวัติศาสตร์'
];

interface FormData {
  name: string;
  description: string;
  price: string;
  quantity: string;
  date: string;
  tag: string;
  province: string;
  serviceType: string;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  quantity?: string;
  date?: string;
  tag?: string;
  province?: string;
  serviceType?: string;
  imageUrl?: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  description: '',
  price: '',
  quantity: '1',
  date: '',
  tag: 'ทัวร์และกิจกรรม',
  province: 'chiang-mai',
  serviceType: 'tour',
  imageUrl: ''
};

interface CustomTravelServiceFormProps {
  onSuccess?: (createdProduct: any) => void;
  defaultProvince?: string;
}

export default function CustomTravelServiceForm({ onSuccess, defaultProvince }: CustomTravelServiceFormProps) {
  const { addToCart } = useCart();
  const [formData, setFormData] = useState<FormData>({
    ...INITIAL_FORM,
    province: defaultProvince || INITIAL_FORM.province
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdItem, setCreatedItem] = useState<any | null>(null);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Strict Form Validation on Submit (Task 4)
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      newErrors.name = '❌ กรุณากรอกชื่อบริการหรือแพ็กเกจท่องเที่ยว (Name is required)';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = '❌ ชื่อบริการต้องมีความยาวอย่างน้อย 3 ตัวอักษร';
    }

    // 2. Description validation
    if (!formData.description.trim()) {
      newErrors.description = '❌ กรุณากรอกคำอธิบายบริการ/ความต้องการ (Description is required)';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = '❌ คำอธิบายต้องมีความยาวอย่างน้อย 10 ตัวอักษร เพื่อให้ข้อมูลครบถ้วน';
    }

    // 3. Price validation
    if (!formData.price.trim()) {
      newErrors.price = '❌ กรุณาระบุงบประมาณหรือราคาต่อท่าน (Price is required)';
    } else {
      const p = Number(formData.price);
      if (isNaN(p) || p < 0) {
        newErrors.price = '❌ ราคาต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0 บาท';
      }
    }

    // 4. Quantity validation
    if (!formData.quantity.trim()) {
      newErrors.quantity = '❌ กรุณาระบุจำนวนผู้เดินทางหรือจำนวนสิทธิ์ (Quantity is required)';
    } else {
      const q = Number(formData.quantity);
      if (isNaN(q) || !Number.isInteger(q) || q < 1) {
        newErrors.quantity = '❌ จำนวนต้องเป็นตัวเลขจำนวนเต็มตั้งแต่ 1 ขึ้นไป';
      }
    }

    // 5. Date validation
    if (!formData.date.trim()) {
      newErrors.date = '❌ กรุณาเลือกวันที่ต้องการเดินทางหรือจัดกิจกรรม (Date is required)';
    } else {
      const d = new Date(formData.date);
      if (isNaN(d.getTime())) {
        newErrors.date = '❌ รูปแบบวันที่ไม่ถูกต้อง';
      }
    }

    // 6. Tag validation
    if (!formData.tag.trim()) {
      newErrors.tag = '❌ กรุณาเลือกหมวดหมู่หรือแท็กสินค้า (Tag is required)';
    }

    // 7. Province validation
    if (!formData.province.trim()) {
      newErrors.province = '❌ กรุณาเลือกจังหวัดปลายทาง (Province is required)';
    }

    // 8. Service Type validation
    if (!formData.serviceType.trim()) {
      newErrors.serviceType = '❌ กรุณาเลือกประเภทบริการ (Service Type is required)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // ล้าง error ของช่องนั้นเมื่อผู้ใช้เริ่มพิมพ์แก้ไข
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // เปลี่ยนประเภทบริการแล้วปรับ default tag อัตโนมัติ
  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const match = SERVICE_TYPES.find((s) => s.value === val);
    setFormData((prev) => ({
      ...prev,
      serviceType: val,
      tag: match ? match.defaultTag : prev.tag
    }));
    if (errors.serviceType) {
      setErrors((prev) => ({ ...prev, serviceType: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setCreatedItem(null);
    setAddedToCart(false);

    // Run Task 4 Validation on Submit
    const isValid = validate();
    if (!isValid) {
      // เลื่อนขึ้นไปแสดง error ด้านบน
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        date: new Date(formData.date).toISOString(),
        tag: formData.tag.trim(),
        province: formData.province.trim(),
        serviceType: formData.serviceType.trim(),
        isService: true,
        imageUrl:
          formData.imageUrl.trim() ||
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSuccessMessage('🎉 บันทึกคำขอบริการสำเร็จ! ข้อมูลของคุณได้รับการตรวจสอบและบันทึกลงในระบบเรียบร้อยแล้ว');
      setCreatedItem(data.data);
      if (onSuccess) onSuccess(data.data);

      // รีเซ็ตฟอร์มกลับเป็นค่าเริ่มต้น
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch (err: any) {
      setErrors({ name: err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!createdItem) return;
    try {
      await addToCart({
        _id: createdItem._id,
        name: createdItem.name,
        price: createdItem.price,
        tag: createdItem.tag,
        imageUrl: createdItem.imageUrl
      });
      setAddedToCart(true);
    } catch (err) {
      console.error('Failed to add created item to cart', err);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Card
      sx={{
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}
    >
      {/* Header Banner */}
      <Box
        sx={{
          bgcolor: '#082340',
          color: '#ffffff',
          px: { xs: 2.5, md: 4 },
          py: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Chip
              label="Task 4: Form Validation"
              size="small"
              sx={{ bgcolor: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }}
            />
            <Chip
              label="User-Facing Form"
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '0.72rem' }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
            ฟอร์มระบุจังหวัด & ประเภทบริการท่องเที่ยว (Custom Trip Request)
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            กรอกข้อมูลทริปหรือบริการที่ต้องการ พร้อมระบบตรวจสอบความถูกต้องของทุกช่องตอนกดยืนยัน (Form Validation on Submit)
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        {/* Error Summary Banner */}
        {hasErrors && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}>
            ⚠️ กรุณาตรวจสอบข้อมูลในแบบฟอร์มให้ถูกต้องครบถ้วน (พบข้อผิดพลาด {Object.keys(errors).length} จุด)
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}>
            {successMessage}
            {createdItem && (
              <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  disabled={addedToCart}
                  onClick={handleAddToCart}
                  sx={{ fontWeight: 700, borderRadius: '8px' }}
                >
                  {addedToCart ? '✅ เพิ่มในตะกร้าเรียบร้อย' : '🛒 เพิ่มบริการนี้ลงตะกร้าทันที'}
                </Button>
              </Box>
            )}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}>
            {/* 1. ประเภทบริการ (Service Type) — Requested by User */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="ประเภทบริการ (Service Type)"
                value={formData.serviceType}
                onChange={handleServiceTypeChange}
                error={Boolean(errors.serviceType)}
                helperText={errors.serviceType || 'เลือกประเภท: ที่พัก, รถเช่า, ไกด์ หรือทัวร์'}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {SERVICE_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* 2. จังหวัดเป้าหมาย (Province) — Requested by User */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="ระบุจังหวัดปลายทาง (Province — 77 จังหวัด)"
                value={formData.province}
                onChange={handleChange('province')}
                error={Boolean(errors.province)}
                helperText={errors.province || 'เลือกจังหวัดที่ต้องการจัดทริปหรือรับบริการ'}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {THAILAND_PROVINCES.map((prov) => (
                  <MenuItem key={prov.slug} value={prov.slug}>
                    📍 {prov.nameTh} ({prov.nameEn}) — {prov.region.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* 3. ชื่อบริการ/แพ็กเกจ (Name) — Rubric Field 1 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="ชื่อบริการ / แพ็กเกจท่องเที่ยว (Name)"
                placeholder="เช่น ทริปล่องแก่งชมธรรมชาติแม่น้ำแตง หรือ โฮมสเตย์ริมน้ำวิวหมอก"
                value={formData.name}
                onChange={handleChange('name')}
                error={Boolean(errors.name)}
                helperText={errors.name || 'ระบุชื่อที่สื่อถึงบริการชัดเจน (อย่างน้อย 3 ตัวอักษร)'}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            {/* 4. คำอธิบายบริการ (Description) — Rubric Field 2 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                label="คำอธิบายรายละเอียดบริการ (Description)"
                placeholder="ระบุไฮไลต์ จุดเด่น สิ่งที่รวมในทริป หรือความต้องการพิเศษ..."
                value={formData.description}
                onChange={handleChange('description')}
                error={Boolean(errors.description)}
                helperText={errors.description || 'ระบุรายละเอียดบริการให้ครบถ้วน (อย่างน้อย 10 ตัวอักษร)'}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            {/* 5. ราคา / งบประมาณ (Price) — Rubric Field 3 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="ราคา / งบประมาณต่อท่าน (Price)"
                placeholder="1500"
                value={formData.price}
                onChange={handleChange('price')}
                error={Boolean(errors.price)}
                helperText={errors.price || 'ราคาเป็นบาท (ต้องมากกว่าหรือเท่ากับ 0)'}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>
                  }
                }}
              />
            </Grid>

            {/* 6. จำนวนผู้เดินทาง / สิทธิ์ (Quantity) — Rubric Field 4 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="จำนวนผู้เดินทาง / สิทธิ์ (Quantity)"
                placeholder="2"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity || 'จำนวนผู้เดินทาง (อย่างน้อย 1 ท่าน)'}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    endAdornment: <InputAdornment position="end">ท่าน</InputAdornment>
                  }
                }}
              />
            </Grid>

            {/* 7. วันที่เดินทาง (Date) — Rubric Field 5 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="วันที่เดินทาง / เริ่มต้นกิจกรรม (Date)"
                value={formData.date}
                onChange={handleChange('date')}
                error={Boolean(errors.date)}
                helperText={errors.date || 'เลือกวันที่จัดทริปหรือวันเช็คอิน'}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            {/* 8. แท็ก / หมวดหมู่ (Tag) — Rubric Field 6 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="หมวดหมู่ / แท็กสินค้า (Tag)"
                value={formData.tag}
                onChange={handleChange('tag')}
                error={Boolean(errors.tag)}
                helperText={errors.tag || 'เลือกหมวดหมู่ที่ตรงกับบริการ'}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {POPULAR_TAGS.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    🏷️ {tag}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* 9. ลิงก์รูปภาพประกอบ (Image URL - Optional) */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="URL รูปภาพประกอบ (Image URL — ตัวเลือกเสริม)"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange('imageUrl')}
                helperText="หากไม่ระบุ ระบบจะใช้ภาพทิวทัศน์ธรรมชาติความละเอียดสูงอัตโนมัติ"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Box sx={{ mt: 3.5, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              disabled={isSubmitting}
              onClick={() => {
                setFormData(INITIAL_FORM);
                setErrors({});
                setSuccessMessage(null);
              }}
              sx={{ borderRadius: '10px', px: 3, fontWeight: 700 }}
            >
              ล้างข้อมูล (Reset)
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{
                borderRadius: '10px',
                px: 3.5,
                py: 1.2,
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  กำลังตรวจสอบและบันทึก...
                </>
              ) : (
                'ยืนยันและส่งคำขอบริการ (Submit Task 4) ➔'
              )}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
