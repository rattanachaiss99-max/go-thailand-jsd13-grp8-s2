import { Link, useNavigate } from "react-router-dom";
import PhotoPlaceholder from "./PhotoPlaceholder";
import Button from "./Button";
import { useBooking } from "../context/BookingContext";

/**
 * PropertyCard
 * ------------------------------------------------------------
 * การ์ดแสดงข้อมูลที่พัก 1 รายการ ใช้ซ้ำได้ 2 รูปแบบผ่าน prop `mode`:
 *  - "list"  : การ์ดแนวนอนขนาดใหญ่ ใช้ในหน้ารายการค้นหา (Listing)
 *  - "mini"  : การ์ดแนวตั้งขนาดเล็ก ใช้ในโซน "You might also like"
 * รองรับโครงสร้างข้อมูล location: { city, district, address_label, ... } ตาม Schema
 * ------------------------------------------------------------
 */
export default function PropertyCard({ property, mode = "list" }) {
  const navigate = useNavigate();
  const { selectProperty, booking, nights } = useBooking();
  const handlePick = () => selectProperty(property.id);

  const handleBookNow = (e) => {
    e.preventDefault();
    selectProperty(property.id);
    navigate("/cart");
  };

  const locationText = property.location?.address_label || (typeof property.location === "string" ? property.location : property.location?.city || "");

  if (mode === "mini") {
    return (
      <article className="card hotel-mini">
        <PhotoPlaceholder src={property.images[0]} alt={property.name} caption={locationText} />
        <div className="hotel-mini-body">
          <div className="between">
            <h3 style={{ fontSize: "1.05rem" }}>{property.name}</h3>
            <span className="badge-rate">
              {(property.rating_avg || property.rating).toFixed(1)} <i>★</i>
            </span>
          </div>
          <div className="loc" style={{ margin: "6px 0" }}>
            📍 {locationText}
          </div>
          <div className="between">
            <div className="muted" style={{ fontSize: ".85rem" }}>From</div>
            <div className="price" style={{ fontSize: "1.15rem" }}>
              ฿{(property.base_price_per_night || property.pricePerNight).toLocaleString()}
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
      <PhotoPlaceholder src={property.images[0]} alt={property.name} caption={locationText}>
        <span className="pill-img">{property.category || property.type}</span>
      </PhotoPlaceholder>
      <div className="hotel-body">
        <div className="between">
          <h3>{property.name}</h3>
          <span className="badge-rate">
            {(property.rating_avg || property.rating).toFixed(1)} <i>★</i>
          </span>
        </div>
        <div className="loc">
          📍 {locationText}{" "}
          <Link to={`/detail/${property.id}#map`} onClick={handlePick}>
            Show on map
          </Link>
        </div>
        <p className="muted" style={{ fontSize: ".95rem" }}>
          {property.description}
        </p>
        <div className="row" style={{ margin: "14px 0", flexWrap: "wrap", gap: 8 }}>
          {(property.special_options || property.tags)?.map((tag) => (
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
              ฿{(property.base_price_per_night || property.pricePerNight).toLocaleString()} <small>/ night</small>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link
              to={`/detail/${property.id}`}
              onClick={handlePick}
              className="btn btn-ghost"
              style={{ padding: "8px 14px", fontSize: ".88rem" }}
            >
              View Details
            </Link>
            <Button
              variant="gold"
              onClick={handleBookNow}
              id={`bookNow-${property.id}`}
              style={{ padding: "8px 18px" }}
            >
              Book Now →
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
