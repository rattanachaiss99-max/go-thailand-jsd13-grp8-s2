/**
 * client.js
 * ------------------------------------------------------------
 * Thin fetch wrappers around the GoThailand API (server/index.js).
 * In dev, `/api` is proxied by Vite to the local API server
 * (see vite.config.js) so no CORS setup is needed.
 * ------------------------------------------------------------
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json();
}

async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request to ${path} failed with status ${res.status}`);
  }
  return data;
}

export function fetchCars() {
  return getJSON("/cars");
}

export function fetchProperties() {
  return getJSON("/properties");
}

export function fetchRegions() {
  return getJSON("/regions");
}

/** สร้างการจองจริง — บันทึกลง MongoDB (collections `bookings` + `booking_items`) คืน { order, item, ref } */
export function createBooking(payload) {
  return postJSON("/bookings", payload);
}

/** ดึงการจองที่บันทึกไว้แล้วกลับมาด้วยเลขที่การจอง — คืน { order, item } */
export function fetchBookingByRef(ref) {
  return getJSON(`/bookings/${ref}`);
}
