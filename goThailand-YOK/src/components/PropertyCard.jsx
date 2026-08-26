import { Link } from "react-router-dom";
import PhotoPlaceholder from "./PhotoPlaceholder";
import Button from "./Button";
import { useBooking } from "../context/BookingContext";

/**
 * PropertyCard
 * ------------------------------------------------------------
 * การ์ดแสดงข้อมูลที่พัก 1 รายการ ใช้ซ้ำได้ 2 รูปแบบผ่าน prop `mode`:
 *  - "list"  : การ์ดแนวนอนขนาดใหญ่ ใช้ในหน้ารายการค้นหา (Listing)
 *  - "mini"  : การ์ดแนวตั้งขนาดเล็ก ใช้ในโซน "You might also like"
 * เมื่อกด Book Now/เลือกที่พัก จะเรียก selectProperty() เพื่อบันทึกที่พัก
 * ที่เลือกไว้ใน BookingContext ก่อนพาไปหน้ารายละเอียด
 * ------------------------------------------------------------
 */
export default function PropertyCard({ property, mode = "list" }) {
  const { selectProperty, booking, nights } = useBooking();
  const handlePick = () => selectProperty(property.id);

  if (mode === "mini") {
    return (
      <article className="card hotel-mini">
        <PhotoPlaceholder src={property.images[0]} alt={property.name} caption={property.location} />
        <div className="hotel-mini-body">
          <div className="between">
            <h3 style={{ fontSize: "1.05rem" }}>{property.name}</h3>
            <span className="badge-rate">
              {property.rating} <i>★</i>
            </span>
          </div>
          <div className="loc" style={{ margin: "6px 0" }}>
            📍 {property.location}
          </div>
          <div className="between">
            <div className="muted" style={{ fontSize: ".85rem" }}>From</div>
            <div className="price" style={{ fontSize: "1.15rem" }}>
              ฿{property.pricePerNight.toLocaleString()}
              <small>/night</small>
            </div>
          </div>
          <Link
            to={`/detail/${property.id}`}
            onClick={handlePick}
            className="btn btn-ghost btn-full"
            style={{ marginTop: 12 }}
          >
            View Details
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="card hotel">
      <PhotoPlaceholder src={property.images[0]} alt={property.name} caption={property.location}>
        <span className="pill-img">{property.type}</span>
      </PhotoPlaceholder>
      <div className="hotel-body">
        <div className="between">
          <h3>{property.name}</h3>
          <span className="badge-rate">
            {property.rating} <i>★</i>
          </span>
        </div>
        <div className="loc">
          📍 {property.location}{" "}
          <Link to={`/detail/${property.id}#map`} onClick={handlePick}>
            Show on map
          </Link>
        </div>
        <p className="muted" style={{ fontSize: ".95rem" }}>
          {property.description}
        </p>
        <div className="row" style={{ margin: "14px 0", flexWrap: "wrap", gap: 8 }}>
          {property.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="hotel-foot">
          <div>
            <div className="muted" style={{ fontSize: ".85rem" }}>
              {nights} nights, {booking.guests.adults} adults
            </div>
            <div className="price">
              ฿{property.pricePerNight.toLocaleString()} <small>/ night</small>
            </div>
          </div>
          <Button to={`/detail/${property.id}`} variant="gold" onClick={handlePick}>
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
}
