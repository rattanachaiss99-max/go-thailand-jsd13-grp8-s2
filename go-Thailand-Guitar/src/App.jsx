import { Routes, Route } from 'react-router-dom';
import CarCheckout from './components/CarCheckout';
import SignIn from './components/SignIn';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

export default function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        {/* หน้าแรกแสดง CarCheckout */}
        <Route path="/" element={<CarCheckout />} />
        
        {/* เส้นทางสลับหน้า */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}