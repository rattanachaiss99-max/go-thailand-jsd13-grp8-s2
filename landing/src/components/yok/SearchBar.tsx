'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function SearchBar() {
  const router = useRouter();
  const today = toISODate(new Date());
  const inThreeDays = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return toISODate(d);
  })();

  const [destination, setDestination] = useState('Bangkok, Thailand');
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(inThreeDays);
  const [guests, setGuests] = useState('2 Adults, 1 Room');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push('/accommodations');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div>
        <label className="fl" htmlFor="dest">
          Destination / จุดหมาย
        </label>
        <input
          className="inp"
          id="dest"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where to? (เช่น กรุงเทพฯ, เชียงใหม่)"
        />
      </div>
      <div>
        <label className="fl" htmlFor="ci">
          Check-in / เข้าพัก
        </label>
        <input
          className="inp"
          id="ci"
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>
      <div>
        <label className="fl" htmlFor="co">
          Check-out / ออก
        </label>
        <input
          className="inp"
          id="co"
          type="date"
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      <div>
        <label className="fl" htmlFor="gu">
          Guests / ผู้เข้าพัก
        </label>
        <select
          className="inp"
          id="gu"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        >
          <option>2 Adults, 1 Room</option>
          <option>2 Adults, 2 Rooms</option>
          <option>4 Adults, 2 Rooms</option>
          <option>1 Adult, 1 Room</option>
        </select>
      </div>
      <button className="btn btn-primary btn-lg" type="submit">
        ค้นหา / Search
      </button>
    </form>
  );
}
