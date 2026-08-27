import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} เรียบร้อยแล้ว`);
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
      {/* ฝั่งซ้าย: รูปภาพและข้อความ 50% */}
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
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.12)',
          zIndex: 1
        }} />

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

      {/* ฝั่งขวา: Card Forgot Password 50% */}
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
            fontSize: '38px',
            fontWeight: '500',
            color: '#1E1E1E',
            margin: '0 0 12px 0'
          }}>
            Forgot Password
          </h2>

          <p style={{
            textAlign: 'center',
            fontSize: '15px',
            color: '#6B7280',
            marginBottom: '32px'
          }}>
            Enter your email and we'll send you a reset link to regain access to your account.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '16px', color: '#1A1A1A', marginBottom: '8px', fontWeight: '500' }}>
                Email
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
              SEND RESET LINK
            </button>

            {/* ปุ่มกดกลับหน้า Sign In */}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link 
                to="/" 
                style={{
                  fontSize: '15px',
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}