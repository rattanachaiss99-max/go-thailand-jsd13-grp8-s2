import { useState } from "react";
import PhotoPlaceholder from "./PhotoPlaceholder";
import Button from "./Button";

/**
 * CarCard
 * ------------------------------------------------------------
 * การ์ดแสดงรถให้เช่า 1 คัน ใช้ในหน้า CarRental (Available Cars grid)
 * และ "You Might Also Like"
 * ------------------------------------------------------------
 */
export default function CarCard({ car }) {
  const [saved, setSaved] = useState(false);
  const typeLabel = (car.category || car.type || "CAR").toUpperCase();
  const dailyPrice = car.daily_rate || car.pricePerDay || 0;
  const ratingValue = car.reviews_summary?.average_star || car.rating || 4.8;
  const reviewsCount = car.reviews_summary?.total_reviews || car.reviews || 0;
  const seatsCount = car.specs?.seats || car.seats || 5;
  const transmissionType = car.specs?.transmission || car.transmission || "Auto";
  const fuelType = car.specs?.fuel_type || car.fuel || "Petrol";
  const carImage = car.pictures?.[0] || car.image;

  return (
    <article className="card car-card">
      <PhotoPlaceholder src={carImage} alt={car.name} className="car-photo">
        <span className="pill-img">{typeLabel}</span>
        <button
          type="button"
          className={`car-fav ${saved ? "on" : ""}`}
          onClick={() => setSaved((v) => !v)}
          aria-label="Save car"
        >
          {saved ? "♥" : "♡"}
        </button>
      </PhotoPlaceholder>

      <div className="car-card-body">
        <div className="between">
          <h3 style={{ fontSize: "1.05rem" }}>{car.name}</h3>
          <span className="badge-rate">
            {ratingValue} <i>★</i>
          </span>
        </div>
        <div className="muted" style={{ fontSize: ".85rem", marginBottom: 4 }}>
          ({reviewsCount} Reviews)
        </div>

        <div className="car-specs">
          <span>🧑 {seatsCount}</span>
          <span>⚙️ {transmissionType}</span>
          <span>⛽ {fuelType}</span>
        </div>

        <div style={{ margin: "12px 0" }}>
          <div className="price" style={{ fontSize: "1.15rem" }}>
            ฿{dailyPrice.toLocaleString()} <small>/ day</small>
          </div>
          <div className="muted" style={{ fontSize: ".8rem" }}>All taxes included</div>
        </div>

        <Button to={`/car-rental/${car.id}`} variant="ghost" full>
          View Detail
        </Button>
      </div>
    </article>
  );
}
