/**
 * propertyFilters.js
 * ------------------------------------------------------------
 * ตัวเลือกของตัวกรองหน้า AccommodationListing/FilterSidebar
 * เป็นค่าคงที่ของ UI ล้วน ๆ ไม่เกี่ยวกับข้อมูลใน MongoDB
 * จึงไม่ต้องดึงผ่าน API เหมือน cars/properties
 * ------------------------------------------------------------
 */
export const bedroomOptions = [
  { value: "1", label: "1 bedroom/studio", test: (bedrooms) => bedrooms === 1 },
  { value: "2", label: "2 bedrooms", test: (bedrooms) => bedrooms === 2 },
  { value: "3+", label: "3+ bedrooms", test: (bedrooms) => bedrooms >= 3 },
];

export const renovationOptions = [
  { value: "6m", label: "Within 6 months", maxMonths: 6 },
  { value: "1y", label: "Within 1 year", maxMonths: 12 },
  { value: "2y", label: "Within 2 years", maxMonths: 24 },
];
