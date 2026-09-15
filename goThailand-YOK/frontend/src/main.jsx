import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CatalogProvider } from "./context/CatalogContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import "./styles/theme.css";
import "./styles/components.css";

/**
 * main.jsx
 * ------------------------------------------------------------
 * จุดเริ่มต้นของแอป: ประกอบ Provider ทั้งหมดเข้าด้วยกันก่อน render
 *  - BrowserRouter: เปิดใช้งานการเปลี่ยนหน้าแบบ SPA (react-router-dom)
 *  - CatalogProvider: โหลด cars/properties/regions/masters จาก MongoDB
 *    ผ่าน API ก่อน แล้วค่อย render ลูก ๆ (ดู CatalogContext.jsx)
 *  - BookingProvider: แชร์สถานะการจองให้ทุกหน้าเข้าถึงได้ (ดู BookingContext.jsx)
 * ------------------------------------------------------------
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </CatalogProvider>
    </BrowserRouter>
  </StrictMode>
);
