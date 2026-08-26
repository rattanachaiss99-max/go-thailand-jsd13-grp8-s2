import QuantityStepper from "./QuantityStepper";
import { useBooking } from "../context/BookingContext";

/**
 * GuestRoomSelector
 * ------------------------------------------------------------
 * แผงเลือกจำนวนผู้ใหญ่ / เด็ก / ห้องพัก ประกอบจาก QuantityStepper
 * 3 แถว อ่าน/แก้ไขค่าตรงกับ BookingContext เอง เรียกใช้ได้ทันทีโดย
 * ไม่ต้องส่ง props ใช้ซ้ำได้ทุกจุดที่ต้องแก้จำนวนผู้เข้าพัก (กล่องจอง
 * ในหน้า Detail และตอนแก้ไขการจองในหน้า Cart)
 * ------------------------------------------------------------
 */
export default function GuestRoomSelector() {
  const { booking, guestLimits, changeGuestCount, changeRoomCount } = useBooking();

  return (
    <div className="guest-editor">
      <QuantityStepper
        label="Adults"
        hint="Age 13+"
        value={booking.guests.adults}
        min={guestLimits.adults[0]}
        max={guestLimits.adults[1]}
        onDecrement={() => changeGuestCount("adults", -1)}
        onIncrement={() => changeGuestCount("adults", 1)}
      />
      <QuantityStepper
        label="Children"
        hint="Age 0-12"
        value={booking.guests.children}
        min={guestLimits.children[0]}
        max={guestLimits.children[1]}
        onDecrement={() => changeGuestCount("children", -1)}
        onIncrement={() => changeGuestCount("children", 1)}
      />
      <QuantityStepper
        label="Rooms"
        value={booking.rooms}
        min={guestLimits.rooms[0]}
        max={guestLimits.rooms[1]}
        onDecrement={() => changeRoomCount(-1)}
        onIncrement={() => changeRoomCount(1)}
      />
    </div>
  );
}
