/**
 * Chip
 * ------------------------------------------------------------
 * ปุ่มแท็กกรองข้อมูลแบบกดติด/กดปลด (toggle) ใช้ในแถบตัวกรองด้านบน
 * ของหน้ารายการค้นหา (เช่น "Free Cancellation", "Breakfast Included")
 * เป็น controlled component — สถานะ on/off ถูกยกขึ้นไปเก็บที่หน้า
 * AccommodationListing เพื่อให้ผูกกับการกรอง `special_options` ของ
 * property ได้จริง
 * ------------------------------------------------------------
 */
export default function Chip({ label, active, onToggle }) {
  return (
    <button
      type="button"
      className={`chip ${active ? "on" : ""}`}
      onClick={onToggle}
    >
      {label}
    </button>
  );
}
