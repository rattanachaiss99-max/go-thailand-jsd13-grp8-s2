import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }
    console.log(formData);
    // สมัครเสร็จแล้วเปลี่ยนหน้ากลับไปที่ Sign In
    navigate('/');
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
      {/* ฝั่งซ้าย: รูปภาพและข้อความหรูหรา 50% */}
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

      {/* ฝั่งขวา: Card Register 50% */}
      <div style={{
        width: '50%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '30px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '540px',
          border: '1.5px solid #757575',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          padding: '45px 55px',
          boxSizing: 'border-box'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '38px',
            fontWeight: '500',
            color: '#1E1E1E',
            margin: '0 0 24px 0'
          }}>
            Register
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '15px', color: '#1A1A1A', marginBottom: '6px', fontWeight: '500' }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #8C939D',
                  backgroundColor: '#F3F4F6',
                  fontSize: '15px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '15px', color: '#1A1A1A', marginBottom: '6px', fontWeight: '500' }}>
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #8C939D',
                  backgroundColor: '#F3F4F6',
                  fontSize: '15px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '15px', color: '#1A1A1A', marginBottom: '6px', fontWeight: '500' }}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #8C939D',
                  backgroundColor: '#F3F4F6',
                  fontSize: '15px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '15px', color: '#1A1A1A', marginBottom: '6px', fontWeight: '500' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #8C939D',
                  backgroundColor: '#F3F4F6',
                  fontSize: '15px',
                  color: '#111827',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '15px', color: '#1A1A1A', marginBottom: '6px', fontWeight: '500' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #8C939D',
                  backgroundColor: '#F3F4F6',
                  fontSize: '15px',
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
                padding: '15px 0',
                borderRadius: '6px',
                border: '1px solid #C4A545',
                backgroundColor: '#DEBA5A',
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '0.8px',
                color: '#1A1A1A',
                cursor: 'pointer',
              }}
            >
              CONTINUE YOUR JOURNEY
            </button>

            {/* ปุ่มกดกลับหน้า Sign In */}
            <div style={{ textAlign: 'center', fontSize: '15px', color: '#1A1A1A', marginTop: '6px' }}>
              Already have an account?{' '}
              <Link 
                to="/" 
                style={{ fontWeight: '700', color: '#000000', textDecoration: 'none' }}
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}