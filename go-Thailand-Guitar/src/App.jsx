import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import CarCatalog from './components/CarCatalog';
import CarDetail from './components/CarDetail';
import BookingDetails from './components/BookingDetails';
import CarCheckout from './components/CarCheckout';
import BookingConfirmed from './components/BookingConfirmed';
import SignIn from './components/SignIn';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

// ข้อมูลรถชุดกลาง
const CAR_DATA = [
  {
    id: 'toyota-fortuner',
    name: 'Toyota Fortuner',
    category: 'SUV',
    rating: 4.9,
    reviews: 97,
    price: 2500,
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Diesel',
    luggage: '4 Large Bags',
    mainImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
    ],
    description: 'Experience unparalleled comfort and capability with the Toyota Fortuner. Ideal for family trips or navigating both city streets and scenic routes in Thailand.'
  },
  {
    id: 'toyota-yaris',
    name: 'Toyota Yaris',
    category: 'Economy',
    rating: 4.8,
    reviews: 86,
    price: 1200,
    seats: 5,
    transmission: 'Auto',
    fuel: 'Petrol',
    luggage: '2 Large Bags',
    mainImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'honda-civic',
    name: 'Honda Civic',
    category: 'Sedan',
    rating: 4.9,
    reviews: 124,
    price: 1800,
    seats: 5,
    transmission: 'Auto',
    fuel: 'Petrol',
    luggage: '2 Large Bags',
    mainImage: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'honda-hr-v',
    name: 'Honda HR-V',
    category: 'SUV',
    rating: 4.8,
    reviews: 73,
    price: 2200,
    seats: 5,
    transmission: 'Auto',
    fuel: 'Hybrid',
    luggage: '3 Large Bags',
    mainImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'toyota-veloz',
    name: 'Toyota Veloz',
    category: 'MPV',
    rating: 4.7,
    reviews: 61,
    price: 2000,
    seats: 7,
    transmission: 'Auto',
    fuel: 'Petrol',
    luggage: '4 Large Bags',
    mainImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mercedes-benz-c-class',
    name: 'Mercedes-Benz C-Class',
    category: 'Luxury',
    rating: 4.9,
    reviews: 42,
    price: 4500,
    seats: 5,
    transmission: 'Auto',
    fuel: 'Petrol',
    luggage: '3 Large Bags',
    mainImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
  }
];

export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Screen 10 (Checkout) มี Header/Footer ในตัวเองอยู่แล้ว */}
      <Route
        path="/checkout"
        element={
          <div className="relative">
            <CarCheckout />
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={() => navigate('/booking/confirmed')}
                className="bg-[#0b1b36] hover:bg-black text-[#f2cb6c] px-6 py-3 rounded-xl text-xs uppercase font-bold tracking-wider shadow-2xl transition border border-[#f2cb6c]/30 cursor-pointer"
              >
                Pay Now & Complete (ไป Screen 11) →
              </button>
            </div>
          </div>
        }
      />

      {/* Auth */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Screens 7, 8, 9, 11 ใช้ Header & Footer กลาง */}
      <Route
        path="/*"
        element={
          <div className="w-full min-h-screen flex flex-col justify-between font-sans">
            <SiteHeader />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<CarCatalog cars={CAR_DATA} />} />
                <Route path="/cars" element={<CarCatalog cars={CAR_DATA} />} />
                <Route path="/cars/:id" element={<CarDetail cars={CAR_DATA} />} />
                <Route path="/cars/:id/booking" element={<BookingDetails cars={CAR_DATA} />} />
                <Route path="/booking/confirmed" element={<BookingConfirmed />} />
              </Routes>
            </div>
            <SiteFooter />
          </div>
        }
      />
    </Routes>
  );
}