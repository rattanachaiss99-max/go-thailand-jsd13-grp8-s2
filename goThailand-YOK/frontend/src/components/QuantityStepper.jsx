/**
 * QuantityStepper
 * ------------------------------------------------------------
 * ตัวเพิ่ม/ลดจำนวนแบบปุ่ม (-)/(+) ใช้ซ้ำได้ทุกจุดที่ต้องเลือก "จำนวน"
 * เช่น จำนวนผู้ใหญ่, เด็ก, ห้องพัก ในกล่องจอง (Detail) และตอนแก้ไข
 * การจองในตะกร้า (Cart) ปุ่มจะถูกปิด (disabled) อัตโนมัติเมื่อค่าถึง
 * ขอบเขตต่ำสุด/สูงสุดที่กำหนด กันผู้ใช้กดเกินขอบเขตที่ระบบรองรับ
 * ------------------------------------------------------------
 */
export default function QuantityStepper({
  label,
  hint,
  value,
  min = 0,
  max = 10,
  onDecrement,
  onIncrement,
}) {
  return (
    <div className="qty-row">
      <div>
        <div className="qty-label">{label}</div>
        {hint && <div className="qty-hint">{hint}</div>}
      </div>
      <div className="qty-controls">
        <button
          type="button"
          className="qty-btn"
          onClick={onDecrement}
          disabled={value <= min}
          aria-label={`ลดจำนวน${label}`}
        >
          −
        </button>
        <span className="qty-value">{value}</span>
        <button
          type="button"
          className="qty-btn"
          onClick={onIncrement}
          disabled={value >= max}
          aria-label={`เพิ่มจำนวน${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
