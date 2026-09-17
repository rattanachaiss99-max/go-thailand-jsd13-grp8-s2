import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchCars, fetchProperties, fetchRegions } from "../api/client";

/**
 * CatalogContext
 * ------------------------------------------------------------
 * โหลดข้อมูล cars / properties / regions จาก MongoDB
 * ผ่าน GoThailand API (server/index.js) ครั้งเดียวตอนแอปเริ่มทำงาน
 * แล้วแจกจ่ายให้ทุกหน้าใช้แทนการ import จาก src/data/*.js ตรง ๆ
 *
 * CatalogProvider จะ render children (BookingProvider + App) ก็ต่อเมื่อ
 * โหลดข้อมูลสำเร็จแล้วเท่านั้น เพื่อให้ทุกหน้าใช้ properties[0]/cars[0]
 * ได้แบบ synchronous เหมือนตอนยังใช้ mock data อยู่
 * ------------------------------------------------------------
 */
const CatalogContext = createContext(null);

/** จุดรับ-คืนรถ — ค่าคงที่ของ UI ไม่ได้เก็บใน MongoDB */
export const pickupLocations = [
  "Bangkok (BKK) Suvarnabhumi Airport",
  "Bangkok (DMK) Don Mueang Airport",
  "Phuket (HKT) International Airport",
  "Chiang Mai (CNX) International Airport",
];

const INITIAL_STATE = {
  status: "loading", // "loading" | "ready" | "error"
  error: null,
  cars: [],
  properties: [],
  regions: [],
};

export function CatalogProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((prev) => ({ ...prev, status: "loading", error: null }));
      try {
        const [cars, properties, regions] = await Promise.all([
          fetchCars(),
          fetchProperties(),
          fetchRegions(),
        ]);
        if (cancelled) return;
        setState({
          status: "ready",
          error: null,
          cars,
          properties,
          regions,
        });
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({ ...prev, status: "error", error: err.message }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const carTypes = useMemo(
    () => [...new Set(state.cars.map((c) => c.category))],
    [state.cars]
  );

  const facilityKeywords = useMemo(
    () =>
      [
        ...new Set(
          state.properties.flatMap((p) => [...(p.facilities || []), ...(p.special_options || [])])
        ),
      ].sort(),
    [state.properties]
  );

  const value = useMemo(() => {
    const getCarById = (id) =>
      state.cars.find((c) => String(c._id) === String(id) || String(c.id) === String(id));

    const getPropertyById = (id) =>
      state.properties.find(
        (p) => String(p._id) === String(id) || String(p.id) === String(id)
      );

    const getOtherProperties = (excludeId, count = 3) =>
      state.properties
        .filter(
          (p) => String(p.id) !== String(excludeId) && String(p._id) !== String(excludeId)
        )
        .slice(0, count);

    const getRegionLabel = (regionId) =>
      state.regions.find((r) => r.id === regionId)?.label || "";

    return {
      ...state,
      pickupLocations,
      carTypes,
      facilityKeywords,
      getCarById,
      getPropertyById,
      getOtherProperties,
      getRegionLabel,
    };
  }, [state, carTypes, facilityKeywords]);

  if (state.status === "loading") {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <p className="muted">Loading GoThailand…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div>
          <p style={{ marginBottom: 12 }}>
            Couldn't load data from the API. Make sure the backend is running
            (<code>npm run server</code>) and MongoDB is seeded (
            <code>npm run seed</code>).
          </p>
          <p className="muted" style={{ marginBottom: 16, fontSize: ".85rem" }}>
            {state.error}
          </p>
          <button
            type="button"
            className="btn btn-gold"
            onClick={() => setRetryCount((n) => n + 1)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
