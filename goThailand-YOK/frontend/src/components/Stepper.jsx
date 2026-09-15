/**
 * Stepper
 * ------------------------------------------------------------
 * แถบแสดงขั้นตอนของกระบวนการจอง (Detail -> Cart -> Checkout -> Success)
 * ใช้ prop `current` (1-4) บอกว่าตอนนี้อยู่ขั้นตอนไหน เพื่อไฮไลต์จุดที่
 * "เสร็จแล้ว" (done) กับ "กำลังทำอยู่" (active) ให้ผู้ใช้เห็น flow ชัดเจน
 * และรู้ว่าแต่ละหน้าเชื่อมกันเป็นลำดับอย่างไร
 * ------------------------------------------------------------
 */
const STEPS = [
  { n: 1, label: "Detail" },
  { n: 2, label: "Cart" },
  { n: 3, label: "Checkout" },
  { n: 4, label: "Success" },
];

export default function Stepper({ current = 1 }) {
  return (
    <nav className="stepper">
      {STEPS.map((step, idx) => {
        const state =
          step.n < current ? "done" : step.n === current ? "active" : "";
        return (
          <div key={step.n} style={{ display: "contents" }}>
            <div className={`step ${state}`}>
              <div className="dot">{state === "done" ? "✓" : step.n}</div>
              <div className="lbl">{step.label}</div>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`step-bar ${step.n < current ? "fill" : ""}`} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
