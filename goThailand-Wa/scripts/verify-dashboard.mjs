// สคริปต์ตรวจ logic ชั่วคราว (ไม่ใช่ส่วนของแอป)
import { mockUser } from '../src/mock/currentUser.js';
import { mockBookings } from '../src/mock/bookings.js';
import { mockPlaces } from '../src/mock/places.js';
import {
  computeStats,
  fetchDashboardStats,
  fetchSavedPlaces,
  fetchUpcomingTrips
} from '../src/services/dashboardService.js';

let fail = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  got=${JSON.stringify(actual)} want=${JSON.stringify(expected)}`);
};

check('mock bookings document count', mockBookings.length, 13);
check('mock places count', mockPlaces.length, 8);
check('wishlist ids all resolve', mockUser.wishlist.every(id => mockPlaces.some(p => p.placeId === id)), true);
check('booking refs unique', new Set(mockBookings.map(b => b.bookingReference)).size, 13);

check('computeStats', computeStats(mockUser, mockBookings), {
  upcomingTrips: 2, totalBookings: 12, rewardsPoints: 4500, savedPlaces: 8
});

// เคสว่าง
check('empty user/bookings', computeStats({ points: 0, wishlist: [] }, []), {
  upcomingTrips: 0, totalBookings: 0, rewardsPoints: 0, savedPlaces: 0
});
check('missing fields tolerated', computeStats({}, []), {
  upcomingTrips: 0, totalBookings: 0, rewardsPoints: 0, savedPlaces: 0
});
check('null user tolerated', computeStats(null, []), {
  upcomingTrips: 0, totalBookings: 0, rewardsPoints: 0, savedPlaces: 0
});

const stats = await fetchDashboardStats();
check('fetchDashboardStats (async)', stats, {
  upcomingTrips: 2, totalBookings: 12, rewardsPoints: 4500, savedPlaces: 8
});

const trips = await fetchUpcomingTrips();
check('upcoming trips length', trips.length, 2);
check('upcoming sorted by pickupDate', new Date(trips[0].item.pickupDate) <= new Date(trips[1].item.pickupDate), true);
check('upcoming all confirmed+future', trips.every(t => t.bookingStatus === 'confirmed' && new Date(t.item.pickupDate) > new Date()), true);

const saved = await fetchSavedPlaces();
check('saved places join length', saved.length, 8);
check('saved places have names', saved.every(p => !!p.name), true);
check('cancelled excluded from total', mockBookings.filter(b => b.bookingStatus === 'cancelled').length, 1);
check('toLocaleString format', (4500).toLocaleString('en-US'), '4,500');

console.log(fail === 0 ? '\nALL PASS' : `\n${fail} FAILED`);
process.exit(fail ? 1 : 0);
