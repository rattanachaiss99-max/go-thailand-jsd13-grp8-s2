import { Link } from 'react-router-dom';
import React, { useState } from 'react';


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* ฝั่งซ้าย: รูปรีสอร์ตและข้อความหรูหรา 50% */}
      <div style={{
        position: 'relative',
        width: '50%',
        height: '100%',
        backgroundImage: 'url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        boxSizing: 'border-box',
      }}>
        {/* เลเยอร์มืดบางๆ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.12)',
          zIndex: 1
        }} />

        {/* ข้อความตรงกลาง */}
        <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0', maxWidth: '580px' }}>
          <h1 style={{
            fontSize: '64px',
            fontWeight: '700',
            margin: '0 0 16px 0',
            lineHeight: 1.1,
            letterSpacing: '-0.5px'
          }}>
            <span style={{ color: '#5B93E5' }}>Go</span>
            <span style={{ color: '#E5C05B' }}>Thailand</span>
          </h1>
          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '44px',
            lineHeight: '1.25',
            color: '#FFFFFF',
            margin: 0,
            textShadow: '0 3px 10px rgba(0,0,0,0.7)'
          }}>
            Welcome Back. Your World of Luxury Thailand awaits.
          </p>
        </div>

        {/* ข้อความด้านล่าง */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: '#DEB979',
            fontSize: '24px',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            Accomodation , Car rental ,Guide
          </p>
        </div>
      </div>

      {/* ฝั่งขวา: การ์ด Sign In 50% */}
      <div style={{
        width: '50%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '40px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '540px',
          border: '1.5px solid #757575',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          padding: '60px 55px',
          boxSizing: 'border-box'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '40px',
            fontWeight: '500',
            color: '#1E1E1E',
            margin: '0 0 36px 0'
          }}>
            Sign In
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '17px', color: '#1A1A1A', marginBottom: '8px', fontWeight: '500' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '6px',
                  border: '1.5px solid #8C939D',
                  backgroundColor: '#F3F4F6',
                  fontSize: '16px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '17px', color: '#1A1A1A', marginBottom: '8px', fontWeight: '500' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '6px',
                  border: '1.5px solid #8C939D',
                  backgroundColor: '#F3F4F6',
                  fontSize: '16px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            {/* Remember Me & Forget Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '16px', color: '#2C2C2C' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#DEBA5A', cursor: 'pointer' }}
                />
                Remember me
              </label>
              
                Forget password?
              <Link to="/forgot-password" style={{ fontSize: '16px', color: '#2C2C2C', textDecoration: 'none' }}>
  Forget password?
</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '16px 0',
                borderRadius: '6px',
                border: '1px solid #C4A545',
                backgroundColor: '#DEBA5A',
                fontSize: '16px',
                fontWeight: '700',
                letterSpacing: '0.8px',
                color: '#1A1A1A',
                cursor: 'pointer',
              }}
            >
              CONTINUE YOUR JOURNEY
            </button>

            {/* Divider */}
            <div style={{ textAlign: 'center', fontSize: '15px', color: '#4A4A4A', margin: '4px 0' }}>
              --Or Sign In With--
            </div>

            {/* Google Button */}
            <div>
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  borderRadius: '6px',
                  border: '1.5px solid #333333',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
                </svg>
              </button>
            </div>

            {/* Register Footer */}
            <div style={{ textAlign: 'center', fontSize: '16px', color: '#1A1A1A' }}>
              Don’t have an account?{' '}
             
              <Link to="/register" style={{ fontWeight: '700', color: '#000000', textDecoration: 'none' }}>
  Register
  
</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}