/**
 * regions.js
 * ------------------------------------------------------------
 * รายชื่อ "ภาค" ของประเทศไทยที่ใช้แบ่งกลุ่มที่พัก ใช้ทั้งใน
 * FilterSidebar (ตัวกรองด้านซ้ายของหน้ารายการ) และผูกกับฟิลด์
 * `region` ของแต่ละที่พักใน properties.js
 * ------------------------------------------------------------
 */
export const regions = [
  { id: "north", label: "ภาคเหนือ", labelEn: "North" },
  { id: "isan", label: "ภาคอีสาน", labelEn: "Northeast (Isan)" },
  { id: "central", label: "ภาคกลาง", labelEn: "Central" },
  { id: "south", label: "ภาคใต้", labelEn: "South" },
];

/** หา label ภาษาไทยของภาคจาก id — ใช้แสดงผลในหน้ารายละเอียด/breadcrumb */
export function getRegionLabel(regionId) {
  return regions.find((r) => r.id === regionId)?.label || "";
}
