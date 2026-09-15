import { useState } from "react";

/**
 * Chip
 * ------------------------------------------------------------
 * ปุ่มแท็กกรองข้อมูลแบบกดติด/กดปลด (toggle) ใช้ในแถบตัวกรองด้านบน
 * ของหน้ารายการค้นหา (เช่น "Free Cancellation", "Breakfast Included")
 * เก็บสถานะ on/off ไว้ในตัวเอง เพราะเป็น UI-only ยังไม่ผูกกับ query จริง
 * ------------------------------------------------------------
 */
export default function Chip({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      className={`chip ${on ? "on" : ""}`}
      onClick={() => setOn((v) => !v)}
    >
      {label}
    </button>
  );
}
