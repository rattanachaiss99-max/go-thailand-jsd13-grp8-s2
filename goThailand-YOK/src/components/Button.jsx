import { Link } from "react-router-dom";

/**
 * Button
 * ------------------------------------------------------------
 * ปุ่มใช้ซ้ำได้ทั้งเว็บ รองรับ 2 โหมด:
 *  - เป็นปุ่มธรรมดา (submit ฟอร์ม, onClick)
 *  - เป็นลิงก์เปลี่ยนหน้า (ถ้าใส่ prop `to` จะ render เป็น <Link>)
 * variant: "primary" | "gold" | "ghost" | "link"
 * size: "md" (ปกติ) | "lg"
 * ------------------------------------------------------------
 */
export default function Button({
  children,
  to,
  variant = "primary",
  size = "md",
  full = false,
  type = "button",
  onClick,
  disabled = false,
  ...rest
}) {
  const className = [
    "btn",
    `btn-${variant}`,
    size === "lg" ? "btn-lg" : "",
    full ? "btn-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
