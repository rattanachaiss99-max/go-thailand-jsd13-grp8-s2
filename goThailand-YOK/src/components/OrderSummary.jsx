/**
 * OrderSummary
 * ------------------------------------------------------------
 * กล่องสรุปยอดเงิน ใช้ซ้ำในหน้า Cart, Checkout และ Success
 * รับรายการค่าใช้จ่ายผ่าน prop `lines` = [{ label, amount }]
 * และยอดรวมผ่าน `total` เพื่อไม่ต้องเขียนการคำนวณ/จัดวาง UI ซ้ำ 3 หน้า
 * ------------------------------------------------------------
 */
export default function OrderSummary({ lines, total, title = "Order Summary" }) {
  return (
    <div>
      {title && <h3 style={{ marginBottom: 6 }}>{title}</h3>}
      {lines.map((line) => (
        <div className="sum-row" key={line.label}>
          <span>{line.label}</span>
          <b>฿{line.amount.toLocaleString()}</b>
        </div>
      ))}
      <div className="sum-total">
        <h3>Total</h3>
        <div className="price">฿{total.toLocaleString()}</div>
      </div>
    </div>
  );
}
