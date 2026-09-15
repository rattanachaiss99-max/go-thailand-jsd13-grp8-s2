/**
 * PhotoPlaceholder
 * ------------------------------------------------------------
 * กล่องรูปภาพที่พัก ใช้ซ้ำได้ทุกจุดที่ต้องโชว์ "รูปที่พัก" ทั่วทั้งเว็บ
 * (การ์ดรายการ, แกลเลอรีหน้า Detail, การ์ดในตะกร้า/checkout/success)
 *  - ถ้าส่ง prop `src` มา จะแสดงรูปจริง (object-fit: cover เต็มกล่อง)
 *  - ถ้าไม่ส่ง `src` จะ fallback เป็นพื้นหลัง gradient จำลอง (variant)
 *    ไว้ใช้กันพังกรณีข้อมูลที่พักยังไม่มีรูป
 * `caption` = ข้อความมุมล่างซ้ายของกล่อง (เช่นชื่อทำเล)
 * ------------------------------------------------------------
 */
export default function PhotoPlaceholder({
  src,
  alt = "",
  variant = "ph-villa",
  caption = "",
  className = "",
  style = {},
  children,
}) {
  return (
    <div className={`ph ${src ? "" : variant} ${className}`} data-cap={caption} style={style}>
      {src && <img className="ph-img" src={src} alt={alt} loading="lazy" />}
      {children}
    </div>
  );
}
